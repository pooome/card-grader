import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useSettings } from '../utils/settings';
import CameraClassicScreen from './camera-classic';
import CameraVisionScreen from './camera-vision';

/**
 * Camera router that conditionally loads either:
 * - Classic mode (expo-camera) - works in Expo Go
 * - Vision mode (VisionCamera + OpenCV) - requires native build
 */
export default function CameraScreen() {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  // Render based on vision mode setting
  if (settings.visionModeEnabled) {
    return <CameraVisionScreen />;
  }

  return <CameraClassicScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
