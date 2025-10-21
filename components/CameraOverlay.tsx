import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Standard TCG card ratio (2.5" x 3.5")
const CARD_ASPECT_RATIO = 3.5 / 2.5;
const GUIDE_WIDTH = width * 0.7;
const GUIDE_HEIGHT = GUIDE_WIDTH * CARD_ASPECT_RATIO;

interface CameraOverlayProps {
  cardDetected?: boolean;
  isLevel?: boolean;
}

export default function CameraOverlay({ cardDetected = false, isLevel = false }: CameraOverlayProps) {
  const guideLeft = (width - GUIDE_WIDTH) / 2;
  const guideTop = (height - GUIDE_HEIGHT) / 2;

  // Outline color based on level status (not card detection)
  const guideColor = isLevel ? '#4caf50' : '#fff';
  const cornerColor = isLevel ? '#4caf50' : '#fff';

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} style={styles.svg}>
        {/* Card outline guide */}
        <Rect
          x={guideLeft}
          y={guideTop}
          width={GUIDE_WIDTH}
          height={GUIDE_HEIGHT}
          stroke={guideColor}
          strokeWidth="3"
          fill="none"
          strokeDasharray="10,5"
          opacity={0.8}
        />

        {/* Corner markers */}
        {/* Top-left */}
        <Line
          x1={guideLeft}
          y1={guideTop + 30}
          x2={guideLeft}
          y2={guideTop}
          stroke={cornerColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <Line
          x1={guideLeft}
          y1={guideTop}
          x2={guideLeft + 30}
          y2={guideTop}
          stroke={cornerColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Top-right */}
        <Line
          x1={guideLeft + GUIDE_WIDTH}
          y1={guideTop + 30}
          x2={guideLeft + GUIDE_WIDTH}
          y2={guideTop}
          stroke={cornerColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <Line
          x1={guideLeft + GUIDE_WIDTH}
          y1={guideTop}
          x2={guideLeft + GUIDE_WIDTH - 30}
          y2={guideTop}
          stroke={cornerColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Bottom-left */}
        <Line
          x1={guideLeft}
          y1={guideTop + GUIDE_HEIGHT - 30}
          x2={guideLeft}
          y2={guideTop + GUIDE_HEIGHT}
          stroke={cornerColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <Line
          x1={guideLeft}
          y1={guideTop + GUIDE_HEIGHT}
          x2={guideLeft + 30}
          y2={guideTop + GUIDE_HEIGHT}
          stroke={cornerColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Bottom-right */}
        <Line
          x1={guideLeft + GUIDE_WIDTH}
          y1={guideTop + GUIDE_HEIGHT - 30}
          x2={guideLeft + GUIDE_WIDTH}
          y2={guideTop + GUIDE_HEIGHT}
          stroke={cornerColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <Line
          x1={guideLeft + GUIDE_WIDTH}
          y1={guideTop + GUIDE_HEIGHT}
          x2={guideLeft + GUIDE_WIDTH - 30}
          y2={guideTop + GUIDE_HEIGHT}
          stroke={cornerColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Center crosshairs */}
        <Line
          x1={width / 2 - 20}
          y1={height / 2}
          x2={width / 2 + 20}
          y2={height / 2}
          stroke="#fff"
          strokeWidth="2"
          opacity={0.6}
        />
        <Line
          x1={width / 2}
          y1={height / 2 - 20}
          x2={width / 2}
          y2={height / 2 + 20}
          stroke="#fff"
          strokeWidth="2"
          opacity={0.6}
        />
      </Svg>

      {/* Card Detection Status Banner - Only shows based on actual card detection */}
      {!cardDetected && (
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <Text style={styles.bannerIcon}>⚠️</Text>
            <Text style={styles.bannerText}>Card Not Detected</Text>
            <Text style={styles.bannerSubtext}>
              Position card within the guides
            </Text>
          </View>
        </View>
      )}

      {cardDetected && (
        <View style={styles.bannerContainer}>
          <View style={[styles.banner, styles.bannerSuccess]}>
            <Text style={styles.bannerIcon}>✓</Text>
            <Text style={styles.bannerText}>Card Detected</Text>
          </View>
        </View>
      )}
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
  bannerContainer: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  banner: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bannerSuccess: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  bannerIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bannerSubtext: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.9,
  },
});
