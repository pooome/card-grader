import React, { useRef, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface ZoomableImageProps {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  onTransformChange?: (scale: number, translateX: number, translateY: number) => void;
  children?: React.ReactNode;
  isLinesDragging?: boolean;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 15;

export default function ZoomableImage({
  imageUri,
  imageWidth,
  imageHeight,
  onTransformChange,
  children,
  isLinesDragging = false,
}: ZoomableImageProps) {
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  
  const savedScale = useRef(1);
  const savedTranslateX = useRef(0);
  const savedTranslateY = useRef(0);

  const pinchGesture = Gesture.Pinch()
    .enabled(!isLinesDragging)
    .onUpdate((event) => {
      const newScale = savedScale.current * event.scale;
      const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
      setScale(clampedScale);
      
      if (onTransformChange) {
        onTransformChange(clampedScale, translateX, translateY);
      }
    })
    .onEnd(() => {
      savedScale.current = scale;
      savedTranslateX.current = translateX;
      savedTranslateY.current = translateY;
    });

  const panGesture = Gesture.Pan()
    .enabled(!isLinesDragging)
    .onUpdate((event) => {
      const newTranslateX = savedTranslateX.current + event.translationX;
      const newTranslateY = savedTranslateY.current + event.translationY;
      
      setTranslateX(newTranslateX);
      setTranslateY(newTranslateY);

      if (onTransformChange) {
        onTransformChange(scale, newTranslateX, newTranslateY);
      }
    })
    .onEnd(() => {
      savedTranslateX.current = translateX;
      savedTranslateY.current = translateY;
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composed}>
        <View 
          style={[
            styles.imageContainer, 
            { 
              width: imageWidth,
              height: imageHeight,
              transform: [
                { translateX },
                { translateY },
                { scale },
              ],
            }
          ]}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width: imageWidth, height: imageHeight, margin: 0, padding: 0 }}
            resizeMode="contain"
          />
          {children}
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    margin: 0,
    padding: 0,
  },
});

