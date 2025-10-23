import { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import CameraOverlay from '../components/CameraOverlay';

export default function CameraScreen() {
  const [facing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isLevel, setIsLevel] = useState(false);
  const [cardDetected, setCardDetected] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
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

  const handleLevelChange = (level: boolean) => {
    setIsLevel(level);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
        });
        
        if (photo) {
          // Navigate to analysis screen with the captured photo
          router.push({
            pathname: '/analysis',
            params: { imageUri: photo.uri },
          });
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  // TODO: Implement actual card detection using ML/CV
  // For now, this is a placeholder - you can integrate opencv.js here
  // to detect rectangular card shapes in the camera feed
  const detectCard = () => {
    // Placeholder: Set to true when you implement actual card detection
    // This would involve:
    // 1. Getting the current camera frame
    // 2. Running edge detection (Canny)
    // 3. Finding contours
    // 4. Detecting rectangular shapes matching card dimensions
    setCardDetected(false); // Currently always false until ML is implemented
  };

  // Capture button is enabled only when device is level
  // In future, also require cardDetected to be true
  const canCapture = isLevel; // && cardDetected when card detection is implemented

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <CameraOverlay cardDetected={cardDetected} onLevelChange={handleLevelChange} />
        
        <View style={styles.controlsContainer}>
          <View style={styles.spacer} />

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
              {!isLevel && '📱 Hold phone flat and level'}
              {isLevel && !cardDetected && '🃏 Position card in frame'}
              {isLevel && cardDetected && '✓ Ready to capture!'}
            </Text>
          </View>
        </View>
      </CameraView>
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
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
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
