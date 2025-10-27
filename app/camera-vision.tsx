import { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useRouter } from 'expo-router';
import { Button, IconButton } from 'react-native-paper';
import { useSharedValue, runOnJS } from 'react-native-reanimated';
import CameraOverlay from '../components/CameraOverlay';
import { detectCard, CornerSmoother, type CardCorners } from '../utils/cardDetectionProcessor';

export default function CameraScreen() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isLevel, setIsLevel] = useState(false);
  const [cardDetected, setCardDetected] = useState(false);
  const [detectedCardCorners, setDetectedCardCorners] = useState<CardCorners | null>(null);
  const [showLevelIndicators, setShowLevelIndicators] = useState(true);
  const cameraRef = useRef<Camera>(null);
  const router = useRouter();
  const cornerSmootherRef = useRef(new CornerSmoother());
  
  // Frame counter for throttling detection
  const frameCount = useSharedValue(0);
  const DETECTION_INTERVAL = 5; // Run detection every 5 frames

  // Callback to update card detection state from the frame processor
  const updateCardDetection = useCallback((corners: CardCorners | null) => {
    if (corners) {
      const smoothed = cornerSmootherRef.current.addCorners(corners);
      setDetectedCardCorners(smoothed);
      setCardDetected(!!smoothed);
    } else {
      cornerSmootherRef.current.reset();
      setDetectedCardCorners(null);
      setCardDetected(false);
    }
  }, []);

  // Frame processor for real-time card detection
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    
    // Throttle detection to every Nth frame
    frameCount.value++;
    if (frameCount.value % DETECTION_INTERVAL !== 0) {
      return;
    }
    
    try {
      const corners = detectCard(frame);
      runOnJS(updateCardDetection)(corners);
    } catch (error) {
      console.error('Frame processor error:', error);
    }
  }, [updateCardDetection]);

  // Request camera permission on mount if not granted
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    // Camera permissions are still loading or not granted
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  if (!device) {
    // Camera device not available
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera device not available
        </Text>
      </View>
    );
  }

  const handleLevelChange = (level: boolean) => {
    setIsLevel(level);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          enableShutterSound: true,
        });
        
        if (photo) {
          // Convert file:// path to proper format for the router
          const photoUri = Platform.OS === 'android' 
            ? `file://${photo.path}` 
            : photo.path;
          
          // Navigate to analysis screen with the captured photo and detected corners
          router.push({
            pathname: '/analysis',
            params: { 
              imageUri: photoUri,
              detectedCardCorners: detectedCardCorners ? JSON.stringify(detectedCardCorners) : undefined,
            },
          });
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  // Capture button is enabled when:
  // 1. Level indicators are shown AND device is level, OR level indicators are hidden
  // 2. Card is detected
  const isLevelOk = showLevelIndicators ? isLevel : true;
  const canCapture = isLevelOk && cardDetected;

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        frameProcessor={frameProcessor}
      >
        <CameraOverlay 
          cardDetected={cardDetected}
          detectedCardCorners={detectedCardCorners}
          onLevelChange={handleLevelChange} 
          showLevelIndicators={showLevelIndicators}
        />
        
        <View style={styles.controlsContainer}>
          <View style={styles.levelToggleButton}>
            <IconButton
              icon="spirit-level"
              iconColor={showLevelIndicators ? "#4caf50" : "#fff"}
              size={32}
              onPress={() => setShowLevelIndicators(!showLevelIndicators)}
              style={{ margin: 0 }}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.captureButton,
              !canCapture && styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            disabled={!canCapture}
          >
            <View style={[
              styles.captureButtonInner,
              canCapture && styles.captureButtonInnerActive,
            ]} />
          </TouchableOpacity>

          <View style={styles.spacer} />
        </View>

        <View style={styles.instructionContainer}>
          <View style={styles.instructionBubble}>
            <Text style={styles.instructionText}>
              {showLevelIndicators && !isLevel && 'Hold phone flat and level'}
              {isLevelOk && !cardDetected && 'Position card in frame'}
              {isLevelOk && cardDetected && 'Ready to capture!'}
            </Text>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#000',
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
    color: '#fff',
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  spacer: {
    width: 60,
  },
  levelToggleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonDisabled: {
    opacity: 0.4,
    borderColor: '#999',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  captureButtonInnerActive: {
    backgroundColor: '#4caf50',
  },
  instructionContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionBubble: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: '80%',
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
