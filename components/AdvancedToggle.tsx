import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AdvancedToggleProps {
  advancedControlsEnabled: boolean;
  onToggle: () => void;
}

export default function AdvancedToggle({ advancedControlsEnabled, onToggle }: AdvancedToggleProps) {
  return (
    <SafeAreaView edges={['bottom', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        <IconButton
          icon="rotate-3d"
          iconColor={advancedControlsEnabled ? "#4caf50" : "#fff"}
          size={18}
          style={styles.icon}
          onPress={onToggle}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 100,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
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
  icon: {
    margin: 0,
    width: 20,
    height: 20,
  },
});
