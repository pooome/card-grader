import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';

const { width, height } = Dimensions.get('window');

// Standard TCG card ratio (2.5" x 3.5")
const CARD_ASPECT_RATIO = 3.5 / 2.5;
const GUIDE_WIDTH = width * 0.7;
const GUIDE_HEIGHT = GUIDE_WIDTH * CARD_ASPECT_RATIO;

// Level indicator dimensions
const INDICATOR_TRACK_SIZE = 80; // Track length (vertical height or horizontal width)
const INDICATOR_TRACK_THICKNESS = 30; // Track thickness
const INDICATOR_LABEL_HEIGHT = 20; // Approximate label + margin height
const INDICATOR_SPACING = 20; // Spacing between indicator and card guide
const INDICATOR_SIZE = 20; // Size of the moving indicator dot
const INDICATOR_BORDER_RADIUS = INDICATOR_SIZE / 2; // Make it circular
const INDICATOR_CENTER_LINE_THICKNESS = 2; // Thickness of center reference line

// Card guide styling
const GUIDE_CORNER_RADIUS = 20; // Corner radius for card outline
const GUIDE_STROKE_WIDTH = 3; // Card outline stroke width
const GUIDE_DASH_ARRAY = '10,5'; // Dash pattern for card outline
const GUIDE_OPACITY = 0.8; // Card outline opacity

// Crosshair styling
const CROSSHAIR_LENGTH = 20; // Length of crosshair lines from center
const CROSSHAIR_STROKE_WIDTH = 2; // Crosshair line thickness
const CROSSHAIR_OPACITY = 0.6; // Crosshair opacity

// Motion tracking
const MOTION_UPDATE_INTERVAL = 100; // Update interval in ms for device motion
const TILT_MULTIPLIER = 2; // Multiplier for tilt sensitivity

// UI styling
const LABEL_FONT_SIZE = 12; // Font size for X/Y labels
const LABEL_MARGIN = 4; // Margin below labels
const TRACK_BORDER_RADIUS = 15; // Border radius for indicator tracks
const CENTER_LINE_OPACITY = 0.5; // Opacity of center reference line
const INDICATOR_TRANSFORM_OFFSET = 50; // Offset for centering transforms

// Threshold for level detection (in degrees)
const LEVEL_THRESHOLD_GREEN = 3; // Perfect level
const LEVEL_THRESHOLD_YELLOW = 8; // Getting close
// Above 8 degrees = red (not level)

interface CameraOverlayProps {
  cardDetected?: boolean;
  onLevelChange?: (isLevel: boolean) => void;
}

export default function CameraOverlay({ cardDetected = false, onLevelChange }: CameraOverlayProps) {
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

      DeviceMotion.setUpdateInterval(MOTION_UPDATE_INTERVAL);

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

  const guideLeft = (width - GUIDE_WIDTH) / 2;
  const guideTop = (height - GUIDE_HEIGHT) / 2;

  // Outline color based on level status (not card detection)
  const guideColor = isLevel ? '#4caf50' : '#fff';

  const getColorForTilt = (tilt: number): string => {
    const absTilt = Math.abs(tilt);
    if (absTilt <= LEVEL_THRESHOLD_GREEN) return '#4caf50'; // Green
    if (absTilt <= LEVEL_THRESHOLD_YELLOW) return '#ff9800'; // Yellow
    return '#f44336'; // Red
  };

  const colorX = getColorForTilt(tiltX);
  const colorY = getColorForTilt(tiltY);

  // Clamp the indicator positions to stay within the track bounds
  // Calculate max movement: (track size - indicator size) / 2
  const maxMovement = (INDICATOR_TRACK_SIZE - INDICATOR_SIZE) / 2;
  const clampedY = Math.max(-maxMovement, Math.min(maxMovement, tiltY * TILT_MULTIPLIER));
  const clampedX = Math.max(-maxMovement, Math.min(maxMovement, tiltX * TILT_MULTIPLIER));

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} style={styles.svg}>
        {/* Card outline guide */}
        <Rect
          x={guideLeft}
          y={guideTop}
          width={GUIDE_WIDTH}
          height={GUIDE_HEIGHT}
          rx={GUIDE_CORNER_RADIUS}
          ry={GUIDE_CORNER_RADIUS}
          stroke={guideColor}
          strokeWidth={GUIDE_STROKE_WIDTH}
          fill="none"
          strokeDasharray={GUIDE_DASH_ARRAY}
          opacity={GUIDE_OPACITY}
        />

        {/* Center crosshairs */}
        <Line
          x1={width / 2 - CROSSHAIR_LENGTH}
          y1={height / 2}
          x2={width / 2 + CROSSHAIR_LENGTH}
          y2={height / 2}
          stroke="#fff"
          strokeWidth={CROSSHAIR_STROKE_WIDTH}
          opacity={CROSSHAIR_OPACITY}
        />
        <Line
          x1={width / 2}
          y1={height / 2 - CROSSHAIR_LENGTH}
          x2={width / 2}
          y2={height / 2 + CROSSHAIR_LENGTH}
          stroke="#fff"
          strokeWidth={CROSSHAIR_STROKE_WIDTH}
          opacity={CROSSHAIR_OPACITY}
        />
      </Svg>

      {/* Y-axis (Pitch) - Vertical indicator centered vertically */}
      <View style={[styles.yAxisContainer, { left: guideLeft - INDICATOR_TRACK_THICKNESS - INDICATOR_SPACING }]}>
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
          <View style={[styles.centerLine, { width: INDICATOR_SIZE, height: INDICATOR_CENTER_LINE_THICKNESS }]} />
        </View>
      </View>

      {/* X-axis (Roll) - Horizontal indicator centered horizontally */}
      <View style={[styles.xAxisContainer, { top: guideTop - INDICATOR_TRACK_SIZE - INDICATOR_LABEL_HEIGHT - INDICATOR_SPACING }]}>
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
          <View style={[styles.centerLine, { width: INDICATOR_CENTER_LINE_THICKNESS, height: INDICATOR_SIZE }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  yAxisContainer: {
    position: 'absolute',
    alignItems: 'center',
    top: '50%',
    transform: [{ translateY: -INDICATOR_TRANSFORM_OFFSET }],
  },
  xAxisContainer: {
    position: 'absolute',
    alignItems: 'center',
    left: '50%',
    transform: [{ translateX: -INDICATOR_TRANSFORM_OFFSET }],
  },
  label: {
    color: '#fff',
    fontSize: LABEL_FONT_SIZE,
    fontWeight: 'bold',
    marginBottom: LABEL_MARGIN,
  },
  verticalTrack: {
    width: INDICATOR_TRACK_THICKNESS,
    height: INDICATOR_TRACK_SIZE,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: TRACK_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  horizontalTrack: {
    width: INDICATOR_TRACK_SIZE,
    height: INDICATOR_TRACK_THICKNESS,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: TRACK_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  verticalIndicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_BORDER_RADIUS,
    position: 'absolute',
  },
  horizontalIndicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_BORDER_RADIUS,
    position: 'absolute',
  },
  centerLine: {
    position: 'absolute',
    backgroundColor: '#fff',
    opacity: CENTER_LINE_OPACITY,
  },
});

