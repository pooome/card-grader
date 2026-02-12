import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ColorPickerButton from './ColorPickerButton';

interface ZoomControlsProps {
  zoomLevel: number;
  translateX?: number;
  translateY?: number;
  onReset?: () => void;
  lineColor: string;
  onColorPickerToggle: () => void;
  colorPickerVisible: boolean;
}

export default function ZoomControls({
  zoomLevel,
  translateX = 0,
  translateY = 0,
  onReset,
  lineColor,
  onColorPickerToggle,
  colorPickerVisible,
}: ZoomControlsProps) {
  const hasTransformations =
    zoomLevel !== 1.00 ||
    translateX !== 0 ||
    translateY !== 0

  const showResetButton = hasTransformations;

  return (
    <SafeAreaView edges={['bottom', 'left']} style={styles.safeArea}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <IconButton
            icon="magnify"
            iconColor="#fff"
            size={18}
            style={styles.icon}
          />
          <Text style={styles.zoomText}>{zoomLevel.toFixed(2)}x</Text>
        </View>
        {showResetButton && (
          <View style={styles.resetContainer}>
            <IconButton
              icon="restore"
              iconColor="#fff"
              size={18}
              style={styles.icon}
              onPress={onReset}
            />
          </View>
        )}
        <ColorPickerButton
          lineColor={lineColor}
          colorPickerVisible={colorPickerVisible}
          onToggle={onColorPickerToggle}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 100,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 8,
    gap: 6,
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
  resetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
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
  icon: {
    margin: 0,
    width: 20,
    height: 20,
  },
  zoomText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 2,
    letterSpacing: 0.3,
    fontVariant: ['tabular-nums'],
  },
});

