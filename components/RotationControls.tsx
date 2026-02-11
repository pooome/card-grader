import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

interface RotationControlsProps {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  onRotationChange: (axis: 'X' | 'Y' | 'Z', value: number) => void;
  onResetAxis: (axis: 'X' | 'Y' | 'Z') => void;
}

// Rotation ranges
const Z_MIN = -30;
const Z_MAX = 30;
const X_MIN = -15;
const X_MAX = 15;
const Y_MIN = -15;
const Y_MAX = 15;

// Convert slider value (0-100) to rotation degrees
const sliderToRotation = (sliderValue: number, axis: 'X' | 'Y' | 'Z'): number => {
  const min = axis === 'Z' ? Z_MIN : (axis === 'X' ? X_MIN : Y_MIN);
  const max = axis === 'Z' ? Z_MAX : (axis === 'X' ? X_MAX : Y_MAX);
  return min + (sliderValue / 100) * (max - min);
};

// Convert rotation degrees to slider value (0-100)
const rotationToSlider = (rotation: number, axis: 'X' | 'Y' | 'Z'): number => {
  const min = axis === 'Z' ? Z_MIN : (axis === 'X' ? X_MIN : Y_MIN);
  const max = axis === 'Z' ? Z_MAX : (axis === 'X' ? X_MAX : Y_MAX);
  return ((rotation - min) / (max - min)) * 100;
};

export default function RotationControls({
  rotateX,
  rotateY,
  rotateZ,
  onRotationChange,
  onResetAxis,
}: RotationControlsProps) {
  const [selectedAxis, setSelectedAxis] = useState<'X' | 'Y' | 'Z'>('Z');

  const currentRotation = selectedAxis === 'X' ? rotateX : selectedAxis === 'Y' ? rotateY : rotateZ;
  const showResetButton = currentRotation !== 0;

  const handleSliderChange = (value: number) => {
    const rotation = sliderToRotation(value, selectedAxis);
    onRotationChange(selectedAxis, rotation);
  };

  const handleAxisSelect = (axis: 'X' | 'Y' | 'Z') => {
    setSelectedAxis(axis);
  };

  const handleReset = () => {
    onResetAxis(selectedAxis);
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Axis toggle buttons */}
        <TouchableOpacity
          style={[styles.axisButton, selectedAxis === 'Z' && styles.axisButtonActive]}
          onPress={() => handleAxisSelect('Z')}
          activeOpacity={0.7}
        >
          <Text style={styles.axisButtonText}>Z</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.axisButton, selectedAxis === 'X' && styles.axisButtonActive]}
          onPress={() => handleAxisSelect('X')}
          activeOpacity={0.7}
        >
          <Text style={styles.axisButtonText}>X</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.axisButton, selectedAxis === 'Y' && styles.axisButtonActive]}
          onPress={() => handleAxisSelect('Y')}
          activeOpacity={0.7}
        >
          <Text style={styles.axisButtonText}>Y</Text>
        </TouchableOpacity>

        {/* Slider */}
        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={rotationToSlider(currentRotation, selectedAxis)}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#4caf50"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#fff"
          />
        </View>

        {/* Reset button */}
        {showResetButton && (
          <IconButton
            icon="restore"
            iconColor="#fff"
            size={16}
            style={styles.resetIcon}
            onPress={handleReset}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 46,
    left: 12,
    right: 12,
    zIndex: 90,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  axisButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  axisButtonActive: {
    backgroundColor: '#4caf50',
  },
  axisButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  sliderWrapper: {
    flex: 1,
    transform: [{ scaleY: 0.7 }],
  },
  slider: {
    flex: 1,
  },
  resetIcon: {
    margin: 0,
    width: 20,
    height: 20,
  },
});
