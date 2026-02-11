import React, { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

interface ZoomableImageProps {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  onTransformChange?: (scale: number, translateX: number, translateY: number) => void;
  children?: React.ReactNode;
  isLinesDragging?: boolean;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
}

export interface ZoomableImageRef {
  resetZoom: () => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 15;

const ZoomableImage = forwardRef<ZoomableImageRef, ZoomableImageProps>((
  {
    imageUri,
    imageWidth,
    imageHeight,
    onTransformChange,
    children,
    isLinesDragging = false,
    rotateX: rotateXProp,
    rotateY: rotateYProp,
    rotateZ: rotateZProp,
  },
  ref
) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  const savedScale = useSharedValue(1);
  const startTranslateX = useSharedValue(0);
  const startTranslateY = useSharedValue(0);

  // Sync rotation props to shared values
  useEffect(() => {
    rotateX.value = rotateXProp ?? 0;
    rotateY.value = rotateYProp ?? 0;
    rotateZ.value = rotateZProp ?? 0;
  }, [rotateXProp, rotateYProp, rotateZProp]);

  // Expose reset method to parent
  useImperativeHandle(ref, () => ({
    resetZoom: () => {
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
      rotateX.value = 0;
      rotateY.value = 0;
      rotateZ.value = 0;
      savedScale.value = 1;
      startTranslateX.value = 0;
      startTranslateY.value = 0;

      if (onTransformChange) {
        onTransformChange(1, 0, 0);
      }
    },
  }));

  const notifyTransformChange = (s: number, x: number, y: number) => {
    if (onTransformChange) {
      onTransformChange(s, x, y);
    }
  };

  const pinchGesture = Gesture.Pinch()
    .enabled(!isLinesDragging)
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
      scale.value = clampedScale;

      if (onTransformChange) {
        runOnJS(notifyTransformChange)(clampedScale, translateX.value, translateY.value);
      }
    });

  const panGesture = Gesture.Pan()
    .enabled(!isLinesDragging)
    .onStart(() => {
      startTranslateX.value = translateX.value;
      startTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = startTranslateX.value + event.translationX;
      translateY.value = startTranslateY.value + event.translationY;

      if (onTransformChange) {
        runOnJS(notifyTransformChange)(scale.value, translateX.value, translateY.value);
      }
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
        { rotateZ: `${rotateZ.value}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.imageContainer,
            {
              width: imageWidth,
              height: imageHeight,
            },
            animatedStyle,
          ]}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width: imageWidth, height: imageHeight, margin: 0, padding: 0 }}
            resizeMode="cover"
          />
          {children}
        </Animated.View>
      </View>
    </GestureDetector>
  );
});

ZoomableImage.displayName = 'ZoomableImage';

export default ZoomableImage;

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

