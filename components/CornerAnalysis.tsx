import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CornerBoundaries } from '../types/measurements';

interface CornerAnalysisProps {
  boundaries: CornerBoundaries;
}

export default function CornerAnalysis({ boundaries }: CornerAnalysisProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        Drag the colored lines to mark corner wear boundaries
      </Text>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#f44336' }]} />
          <Text style={styles.legendText}>Top Left</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#2196f3' }]} />
          <Text style={styles.legendText}>Top Right</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#ff9800' }]} />
          <Text style={styles.legendText}>Bottom Left</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#4caf50' }]} />
          <Text style={styles.legendText}>Bottom Right</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    color: '#fff',
    fontSize: 12,
  },
});

