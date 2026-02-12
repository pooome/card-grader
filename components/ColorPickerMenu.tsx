import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLOR_PALETTE = [
  '#A020F0', // Purple (default)
  '#FF0000', // Red
  '#00FF00', // Lime Green
  '#00FFFF', // Cyan
  '#FFFF00', // Yellow
  '#FF6B35', // Orange
  '#FFFFFF', // White
  '#4169E1', // Royal Blue
];

interface ColorPickerMenuProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export default function ColorPickerMenu({
  selectedColor,
  onColorSelect,
}: ColorPickerMenuProps) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea} pointerEvents="box-none">
      <View style={styles.container}>
        {COLOR_PALETTE.map((color, index) => {
          const isActive = color === selectedColor;
          return (
            <TouchableOpacity
              key={color}
              style={[
                styles.swatch,
                { backgroundColor: color },
                isActive && styles.activeSwatch,
              ]}
              onPress={() => onColorSelect(color)}
              activeOpacity={0.7}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 50,
    left: 12,
    right: 12,
    zIndex: 99,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeSwatch: {
    borderColor: '#fff',
    borderWidth: 2.5,
  },
});
