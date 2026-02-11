import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

interface AnalysisHeaderProps {
  onFavorite?: () => void;
  onGallery?: () => void;
  onCamera?: () => void;
  onMenu?: () => void;
}

export default function AnalysisHeader({
  onFavorite,
  onGallery,
  onCamera,
  onMenu
}: AnalysisHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Left side - Favorite */}
      <TouchableOpacity style={styles.iconButton} onPress={onFavorite} activeOpacity={0.7}>
        <IconButton
          icon="star"
          iconColor="#FFD700"
          size={22}
          />
      </TouchableOpacity>

      {/* Center - Gallery and Camera */}
      <View style={styles.centerGroup}>
        <TouchableOpacity style={styles.centerButton} onPress={onGallery} activeOpacity={0.7}>
          <IconButton
            icon="image-multiple"
            iconColor="#fff"
            size={22}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.centerButton} onPress={onCamera} activeOpacity={0.7}>
          <IconButton
            icon="camera"
            iconColor="#fff"
            size={22}
          />
        </TouchableOpacity>
      </View>

      {/* Right side - Menu */}
      <TouchableOpacity style={styles.iconButton} onPress={onMenu} activeOpacity={0.7}>
        <IconButton
          icon="dots-horizontal"
          iconColor="#fff"
          size={22}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingBottom: 4,
    backgroundColor: '#000',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  centerGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 22,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  centerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

