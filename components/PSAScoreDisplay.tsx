import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { GradingResult } from '../types/grading';

interface PSAScoreDisplayProps {
  result: GradingResult;
}

export default function PSAScoreDisplay({ result }: PSAScoreDisplayProps) {
  const { score, gradeName, cornerWearPercentages, company } = result;

  const getScoreColor = (score: number) => {
    if (score >= 9) return '#4caf50'; // Green
    if (score >= 7) return '#2196f3'; // Blue
    if (score >= 5) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  return (
    <Card style={styles.container} elevation={4}>
      <View style={styles.scoreSection}>
        <Text style={styles.companyLabel}>{company} Grade</Text>
        <View style={[styles.scoreCircle, { borderColor: getScoreColor(score) }]}>
          <Text style={[styles.scoreText, { color: getScoreColor(score) }]}>
            {score}
          </Text>
        </View>
        <Text style={styles.gradeName}>{gradeName}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsSection}>
        <Text style={styles.detailsTitle}>Corner Wear Analysis</Text>
        
        <View style={styles.cornerRow}>
          <View style={styles.cornerItem}>
            <Text style={styles.cornerLabel}>Top Left</Text>
            <Text style={styles.cornerValue}>
              {cornerWearPercentages.topLeft.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.cornerItem}>
            <Text style={styles.cornerLabel}>Top Right</Text>
            <Text style={styles.cornerValue}>
              {cornerWearPercentages.topRight.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.cornerRow}>
          <View style={styles.cornerItem}>
            <Text style={styles.cornerLabel}>Bottom Left</Text>
            <Text style={styles.cornerValue}>
              {cornerWearPercentages.bottomLeft.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.cornerItem}>
            <Text style={styles.cornerLabel}>Bottom Right</Text>
            <Text style={styles.cornerValue}>
              {cornerWearPercentages.bottomRight.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.maxWearContainer}>
          <Text style={styles.maxWearLabel}>Maximum Wear:</Text>
          <Text style={[styles.maxWearValue, { color: getScoreColor(score) }]}>
            {cornerWearPercentages.maxWear.toFixed(1)}%
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  companyLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  gradeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  detailsSection: {
    paddingVertical: 8,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  cornerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cornerItem: {
    flex: 1,
    alignItems: 'center',
  },
  cornerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cornerValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  maxWearContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  maxWearLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  maxWearValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

