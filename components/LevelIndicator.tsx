import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';

interface LevelIndicatorProps {
  onLevelChange?: (isLevel: boolean) => void;
}

// Threshold for level detection (in degrees)
const LEVEL_THRESHOLD_GREEN = 3; // Perfect level
const LEVEL_THRESHOLD_YELLOW = 8; // Getting close
// Above 8 degrees = red (not level)

export default function LevelIndicator({ onLevelChange }: LevelIndicatorProps) {
  const [tiltX, setTiltX] = useState(0); // Roll (side to side)
  const [tiltY, setTiltY] = useState(0); // Pitch (front to back)
  const [isLevel, setIsLevel] = useState(false);

  useEffect(() => {
    let subscription: any;

    const startMotionTracking = async () => {
      const isAvailable = await DeviceMotion.isAvailableAsync();
      if (!isAvailable) {
        console.log('Device motion not available');
        return;
      }

      DeviceMotion.setUpdateInterval(100); // Update every 100ms

      subscription = DeviceMotion.addListener((motionData: DeviceMotionMeasurement) => {
        const { rotation } = motionData;
        
        if (rotation) {
          // Convert radians to degrees
          const pitchDeg = (rotation.beta || 0) * (180 / Math.PI);
          const rollDeg = (rotation.gamma || 0) * (180 / Math.PI);

          setTiltX(rollDeg);
          setTiltY(pitchDeg);

          // Check if device is level
          const absX = Math.abs(rollDeg);
          const absY = Math.abs(pitchDeg);
          const level = absX <= LEVEL_THRESHOLD_GREEN && absY <= LEVEL_THRESHOLD_GREEN;
          
          setIsLevel(level);
          onLevelChange?.(level);
        }
      });
    };

    startMotionTracking();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [onLevelChange]);

  const getColorForTilt = (tilt: number): string => {
    const absTilt = Math.abs(tilt);
    if (absTilt <= LEVEL_THRESHOLD_GREEN) return '#4caf50'; // Green
    if (absTilt <= LEVEL_THRESHOLD_YELLOW) return '#ff9800'; // Yellow
    return '#f44336'; // Red
  };

  const colorX = getColorForTilt(tiltX);
  const colorY = getColorForTilt(tiltY);

  // Clamp the indicator positions to stay within the track bounds
  // Track dimensions: vertical = 80px, horizontal = 80px
  // Indicator size: 20px, so max movement is +/- 30px (to keep center within bounds)
  const maxMovement = 30;
  const clampedY = Math.max(-maxMovement, Math.min(maxMovement, tiltY * 2));
  const clampedX = Math.max(-maxMovement, Math.min(maxMovement, tiltX * 2));

  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        {/* Y-axis (Pitch) - Vertical indicator */}
        <View style={styles.verticalLevelContainer}>
          <Text style={styles.label}>Y</Text>
          <View style={styles.verticalTrack}>
            <View
              style={[
                styles.verticalIndicator,
                {
                  backgroundColor: colorY,
                  transform: [{ translateY: clampedY }],
                },
              ]}
            />
            <View style={[styles.centerLine, { width: 20, height: 2 }]} />
          </View>
        </View>

        {/* Center bubble level */}
        <View style={styles.bubbleContainer}>
          <View style={styles.bubbleOuter}>
            <View
              style={[
                styles.bubble,
                {
                  transform: [
                    { translateX: clampedX },
                    { translateY: clampedY },
                  ],
                  backgroundColor: isLevel ? '#4caf50' : colorX,
                },
              ]}
            />
            <View style={styles.crosshair} />
          </View>
        </View>

        {/* X-axis (Roll) - Horizontal indicator */}
        <View style={styles.horizontalLevelContainer}>
          <Text style={styles.label}>X</Text>
          <View style={styles.horizontalTrack}>
            <View
              style={[
                styles.horizontalIndicator,
                {
                  backgroundColor: colorX,
                  transform: [{ translateX: clampedX }],
                },
              ]}
            />
            <View style={[styles.centerLine, { width: 2, height: 20 }]} />
          </View>
        </View>
      </View>

      {/* Status text */}
      <View style={[styles.statusContainer, { backgroundColor: isLevel ? '#4caf50' : 'rgba(0,0,0,0.7)' }]}>
        <Text style={styles.statusText}>
          {isLevel ? '✓ LEVEL' : '⚠ Level Required'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    right: 16,
    alignItems: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 12,
  },
  verticalLevelContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  horizontalLevelContainer: {
    alignItems: 'center',
    marginLeft: 12,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  verticalTrack: {
    width: 30,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  horizontalTrack: {
    width: 80,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  verticalIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
  },
  horizontalIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
  },
  centerLine: {
    position: 'absolute',
    backgroundColor: '#fff',
    opacity: 0.5,
  },
  bubbleContainer: {
    marginHorizontal: 8,
  },
  bubbleOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  bubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  crosshair: {
    width: 20,
    height: 20,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    opacity: 0.6,
  },
  statusContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
