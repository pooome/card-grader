import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { CornerBoundaries, CardDimensions } from '../types/measurements';

const { width: screenWidth } = Dimensions.get('window');

interface DraggableLinesProps {
  boundaries: CornerBoundaries;
  cardDimensions: CardDimensions;
  imageWidth: number;
  imageHeight: number;
  onBoundariesChange: (boundaries: CornerBoundaries) => void;
}

export default function DraggableLines({
  boundaries,
  cardDimensions,
  imageWidth,
  imageHeight,
  onBoundariesChange,
}: DraggableLinesProps) {
  const [activeLine, setActiveLine] = useState<string | null>(null);

  const handleDrag = (
    lineId: string,
    isHorizontal: boolean,
    corner: keyof CornerBoundaries,
    dx: number,
    dy: number
  ) => {
    const newBoundaries = { ...boundaries };
    
    if (isHorizontal) {
      // Dragging horizontal line (changes Y position)
      const newY = boundaries[corner].horizontal + dy;
      // Clamp to card bounds
      const clampedY = Math.max(
        cardDimensions.topEdge,
        Math.min(cardDimensions.bottomEdge, newY)
      );
      newBoundaries[corner] = {
        ...newBoundaries[corner],
        horizontal: clampedY,
      };
    } else {
      // Dragging vertical line (changes X position)
      const newX = boundaries[corner].vertical + dx;
      // Clamp to card bounds
      const clampedX = Math.max(
        cardDimensions.leftEdge,
        Math.min(cardDimensions.rightEdge, newX)
      );
      newBoundaries[corner] = {
        ...newBoundaries[corner],
        vertical: clampedX,
      };
    }
    
    onBoundariesChange(newBoundaries);
  };

  const renderDraggableLine = (
    lineId: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    isHorizontal: boolean,
    corner: keyof CornerBoundaries,
    color: string
  ) => {
    const isActive = activeLine === lineId;
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setActiveLine(lineId);
      },
      onPanResponderMove: (_, gestureState) => {
        handleDrag(lineId, isHorizontal, corner, gestureState.dx, gestureState.dy);
      },
      onPanResponderRelease: () => {
        setActiveLine(null);
      },
    });

    return (
      <React.Fragment key={lineId}>
        <Line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={isActive ? 3 : 2}
          opacity={isActive ? 1 : 0.8}
        />
        <View
          {...panResponder.panHandlers}
          style={[
            styles.touchable,
            {
              left: centerX - 20,
              top: centerY - 20,
            },
          ]}
        >
          <Svg width={40} height={40}>
            <Circle
              cx={20}
              cy={20}
              r={isActive ? 16 : 12}
              fill={color}
              opacity={isActive ? 0.8 : 0.6}
            />
          </Svg>
        </View>
      </React.Fragment>
    );
  };

  return (
    <View style={styles.container}>
      <Svg width={imageWidth} height={imageHeight} style={styles.svg}>
        {/* Top-left corner lines */}
        {renderDraggableLine(
          'tl-h',
          cardDimensions.leftEdge,
          boundaries.topLeft.horizontal,
          boundaries.topLeft.vertical,
          boundaries.topLeft.horizontal,
          true,
          'topLeft',
          '#f44336'
        )}
        {renderDraggableLine(
          'tl-v',
          boundaries.topLeft.vertical,
          cardDimensions.topEdge,
          boundaries.topLeft.vertical,
          boundaries.topLeft.horizontal,
          false,
          'topLeft',
          '#f44336'
        )}

        {/* Top-right corner lines */}
        {renderDraggableLine(
          'tr-h',
          boundaries.topRight.vertical,
          boundaries.topRight.horizontal,
          cardDimensions.rightEdge,
          boundaries.topRight.horizontal,
          true,
          'topRight',
          '#2196f3'
        )}
        {renderDraggableLine(
          'tr-v',
          boundaries.topRight.vertical,
          cardDimensions.topEdge,
          boundaries.topRight.vertical,
          boundaries.topRight.horizontal,
          false,
          'topRight',
          '#2196f3'
        )}

        {/* Bottom-left corner lines */}
        {renderDraggableLine(
          'bl-h',
          cardDimensions.leftEdge,
          boundaries.bottomLeft.horizontal,
          boundaries.bottomLeft.vertical,
          boundaries.bottomLeft.horizontal,
          true,
          'bottomLeft',
          '#ff9800'
        )}
        {renderDraggableLine(
          'bl-v',
          boundaries.bottomLeft.vertical,
          boundaries.bottomLeft.horizontal,
          boundaries.bottomLeft.vertical,
          cardDimensions.bottomEdge,
          false,
          'bottomLeft',
          '#ff9800'
        )}

        {/* Bottom-right corner lines */}
        {renderDraggableLine(
          'br-h',
          boundaries.bottomRight.vertical,
          boundaries.bottomRight.horizontal,
          cardDimensions.rightEdge,
          boundaries.bottomRight.horizontal,
          true,
          'bottomRight',
          '#4caf50'
        )}
        {renderDraggableLine(
          'br-v',
          boundaries.bottomRight.vertical,
          boundaries.bottomRight.horizontal,
          boundaries.bottomRight.vertical,
          cardDimensions.bottomEdge,
          false,
          'bottomRight',
          '#4caf50'
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  svg: {
    position: 'absolute',
  },
  touchable: {
    position: 'absolute',
    width: 40,
    height: 40,
    zIndex: 10,
  },
});
