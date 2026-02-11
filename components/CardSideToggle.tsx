import React from 'react';
import { View, Text, StyleSheet, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CardSideToggleProps {
  cardSide: 'front' | 'back';
  onToggle: () => void;
}

export default function CardSideToggle({ cardSide, onToggle }: CardSideToggleProps) {
  return (
    <SafeAreaView edges={['bottom', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={[styles.label, cardSide === 'front' && styles.labelActive]}>
          FRONT
        </Text>
        <View style={styles.switchContainer}>
          <Switch
            value={cardSide === 'back'}
            onValueChange={onToggle}
            trackColor={{ false: '#4caf50', true: '#2196f3' }}
            thumbColor="#fff"
            ios_backgroundColor="#4caf50"
            style={styles.switch}
          />
        </View>
        <Text style={[styles.label, cardSide === 'back' && styles.labelActive]}>
          BACK
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    right: 48,
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 0,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
    height: 32,
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
  label: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.4,
  },
  labelActive: {
    color: '#fff',
  },
  switchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
  },
});

