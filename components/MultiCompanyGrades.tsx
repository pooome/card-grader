import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { GradingResult } from '../types/grading';

interface MultiCompanyGradesProps {
  psaResult: GradingResult;
  bgsResult: GradingResult;
  cgcResult: GradingResult;
}

export default function MultiCompanyGrades({ psaResult, bgsResult, cgcResult }: MultiCompanyGradesProps) {
  const getScoreColor = (score: number) => {
    if (score >= 9) return '#4caf50'; // Green
    if (score >= 7) return '#2196f3'; // Blue
    if (score >= 5) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const renderCompanyCard = (result: GradingResult, logo: string, key: string) => {
    const color = getScoreColor(result.score);
    
    return (
      <TouchableOpacity key={key} style={styles.companyCard} activeOpacity={0.85}>
        <View style={styles.cardContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>{logo}</Text>
          </View>
          <View style={[styles.scoreContainer, { backgroundColor: color + '20' }]}>
            <Text style={[styles.scoreText, { color }]}>{result.score}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderCompanyCard(psaResult, 'PSA', 'psa')}
      {renderCompanyCard(bgsResult, 'BECKETT', 'bgs')}
      {renderCompanyCard(cgcResult, 'CGC', 'cgc')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    gap: 6,
  },
  companyCard: {
    flex: 1,
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
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
  cardContent: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  logoText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  lockText: {
    fontSize: 10,
  },
  scoreContainer: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});

