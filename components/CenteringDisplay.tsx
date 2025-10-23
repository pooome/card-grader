import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { CenteringMeasurements } from '../types/measurements';

interface CenteringDisplayProps {
  centering: CenteringMeasurements;
}

export default function CenteringDisplay({ centering }: CenteringDisplayProps) {
  const { leftRight, topBottom } = centering;
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.measurementRow}>
          <Text style={styles.label}>L|R</Text>
          <Text style={styles.value}>
            {leftRight.left.toFixed(1)}% | {leftRight.right.toFixed(1)}%
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.measurementRow}>
          <Text style={styles.label}>T|B</Text>
          <Text style={styles.value}>
            {topBottom.top.toFixed(1)}% | {topBottom.bottom.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  card: {
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
  measurementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  label: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    minWidth: 32,
    letterSpacing: 0.5,
  },
  value: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
});

