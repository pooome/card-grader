import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@tcg_grader_settings';

interface AppSettings {
  visionModeEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  visionModeEnabled: false, // Default to false for compatibility
};

let cachedSettings: AppSettings = DEFAULT_SETTINGS;

/**
 * Load settings from AsyncStorage
 */
export async function loadSettings(): Promise<AppSettings> {
  try {
    const stored = await AsyncStorage.getItem(SETTINGS_KEY);
    if (stored) {
      cachedSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      return cachedSettings;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Save settings to AsyncStorage
 */
export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    cachedSettings = { ...cachedSettings, ...settings };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(cachedSettings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

/**
 * Hook to use settings in components
 */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(cachedSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings().then((loaded) => {
      setSettings(loaded);
      setLoading(false);
    });
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await saveSettings(newSettings);
  };

  return {
    settings,
    updateSettings,
    loading,
  };
}

