import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, Modal } from 'react-native';
import { GradingResult } from '../types/grading';
import { getGradeThreshold } from '../utils/grading';

interface MultiCompanyGradesProps {
  psaResult: GradingResult;
  bgsResult: GradingResult;
  cgcResult: GradingResult;
  cardSide: 'front' | 'back';
}

export default function MultiCompanyGrades({ psaResult, bgsResult, cgcResult, cardSide }: MultiCompanyGradesProps) {
  const [selectedGrade, setSelectedGrade] = useState<GradingResult | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 9) return '#4caf50'; // Green
    if (score >= 7) return '#2196f3'; // Blue
    if (score >= 5) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const renderCompanyCard = (result: GradingResult, logoSource: any, key: string) => {
    const color = getScoreColor(result.score);
    
    return (
      <TouchableOpacity 
        key={key} 
        style={styles.companyCard} 
        activeOpacity={0.85}
        onPress={() => setSelectedGrade(result)}
      >
        <View style={styles.cardContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={logoSource}
              style={[styles.logoImage, { tintColor: '#FFFFFF' }]}
              resizeMode="contain"
            />
          </View>
          <View style={[styles.scoreContainer, { backgroundColor: color + '20' }]}>
            <Text style={[styles.scoreText, { color }]}>{result.score}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGradeModal = () => {
    if (!selectedGrade) return null;
    
    const gradeThreshold = getGradeThreshold(selectedGrade.score, selectedGrade.company);
    const color = getScoreColor(selectedGrade.score);
    
    return (
      <Modal
        visible={selectedGrade !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedGrade(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setSelectedGrade(null)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.companyName}>{selectedGrade.company}</Text>
                  <Text style={styles.cardSideLabel}>{cardSide.toUpperCase()} SIDE</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedGrade(null)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[styles.scoreCircle, { backgroundColor: color + '20', borderColor: color }]}>
                <Text style={[styles.numericGrade, { color }]}>{selectedGrade.score}</Text>
              </View>
              
              <Text style={styles.gradeName}>{selectedGrade.gradeName}</Text>
              
              {gradeThreshold && (
                <>
                  <View style={styles.criteriaContainer}>
                    <Text style={styles.criteriaTitle}>Centering Requirements ({cardSide.toUpperCase()})</Text>
                    <View style={styles.criteriaRow}>
                      <Text style={styles.criteriaLabel}>Max Deviation:</Text>
                      <Text style={styles.criteriaValue}>
                        {cardSide === 'front' 
                          ? gradeThreshold.maxCenteringDeviationFront 
                          : gradeThreshold.maxCenteringDeviationBack}% or better
                      </Text>
                    </View>
                    <Text style={styles.criteriaNote}>
                      Both horizontal and vertical centering must meet this threshold
                    </Text>
                  </View>
                  
                  <View style={styles.actualContainer}>
                    <Text style={styles.actualTitle}>Card Measurements</Text>
                    <View style={styles.criteriaRow}>
                      <Text style={styles.criteriaLabel}>Horizontal (L/R):</Text>
                      <Text style={styles.criteriaValue}>
                        {selectedGrade.centeringFrontDeviation.toFixed(1)}% deviation
                      </Text>
                    </View>
                    <View style={styles.criteriaRow}>
                      <Text style={styles.criteriaLabel}>Vertical (T/B):</Text>
                      <Text style={styles.criteriaValue}>
                        {selectedGrade.centeringBackDeviation.toFixed(1)}% deviation
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{gradeThreshold.description}</Text>
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {renderCompanyCard(psaResult, require('../assets/psa-logo.png'), 'psa')}
      {renderCompanyCard(bgsResult, require('../assets/beckett-logo.png'), 'bgs')}
      {renderCompanyCard(cgcResult, require('../assets/cgc-logo.png'), 'cgc')}
      {renderGradeModal()}
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
    justifyContent: 'center',
    flex: 1,
  },
  logoImage: {
    width: 60,
    height: 24,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: 320,
    maxWidth: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  cardSideLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  numericGrade: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  gradeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  criteriaContainer: {
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  criteriaTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2196f3',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  criteriaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  criteriaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  criteriaValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  criteriaNote: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  actualContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  actualTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4caf50',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 12,
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    textAlign: 'center',
  },
});

