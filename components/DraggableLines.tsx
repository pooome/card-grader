import React, { useState, useRef } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import Svg, { Line, Rect, Polygon, Defs, Pattern, Path, G, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { BorderBoundaries, CardDimensions } from '../types/measurements';

interface DraggableLinesProps {
  boundaries: BorderBoundaries;
  cardDimensions: CardDimensions;
  imageWidth: number;
  imageHeight: number;
  onBoundariesChange: (boundaries: BorderBoundaries) => void;
  onDraggingChange?: (isDragging: boolean) => void;
  scale?: number;
  lineColor?: string;
}

type BorderSide = 'top' | 'bottom' | 'left' | 'right';
type BorderType = 'outer' | 'inner';

export default function DraggableLines({
  boundaries,
  cardDimensions,
  imageWidth,
  imageHeight,
  onBoundariesChange,
  onDraggingChange,
  scale = 1,
  lineColor = '#A020F0',
}: DraggableLinesProps) {
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const lastHapticPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const HAPTIC_THRESHOLD = 1; // Trigger haptic every 3 pixels

  const triggerHapticIfNeeded = (newX: number, newY: number) => {
    const dx = Math.abs(newX - lastHapticPosition.current.x);
    const dy = Math.abs(newY - lastHapticPosition.current.y);

    if (dx >= HAPTIC_THRESHOLD || dy >= HAPTIC_THRESHOLD) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      lastHapticPosition.current = { x: newX, y: newY };
    }
  };

  const createArrowPath = (
    centerX: number,
    centerY: number,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => {
    const arrowHeadSize = 5;
    // Offset the arrow tip slightly so the visual center of the V-shape is at the geometric center
    const visualOffset = arrowHeadSize / 3;

    switch (direction) {
      case 'up':
        // Arrow pointing up - shift up so visual center is at centerY
        return `
          M ${centerX - arrowHeadSize},${centerY + visualOffset}
          L ${centerX},${centerY - arrowHeadSize + visualOffset}
          L ${centerX + arrowHeadSize},${centerY + visualOffset}
        `;
      case 'down':
        // Arrow pointing down - shift down so visual center is at centerY
        return `
          M ${centerX - arrowHeadSize},${centerY - visualOffset}
          L ${centerX},${centerY + arrowHeadSize - visualOffset}
          L ${centerX + arrowHeadSize},${centerY - visualOffset}
        `;
      case 'left':
        // Arrow pointing left - shift left so visual center is at centerX
        return `
          M ${centerX + visualOffset},${centerY - arrowHeadSize}
          L ${centerX - arrowHeadSize + visualOffset},${centerY}
          L ${centerX + visualOffset},${centerY + arrowHeadSize}
        `;
      case 'right':
        // Arrow pointing right - shift right so visual center is at centerX
        return `
          M ${centerX - visualOffset},${centerY - arrowHeadSize}
          L ${centerX + arrowHeadSize - visualOffset},${centerY}
          L ${centerX - visualOffset},${centerY + arrowHeadSize}
        `;
    }
  };

  const handleDrag = (
    borderType: BorderType,
    side: BorderSide,
    deltaX: number,
    deltaY: number
  ) => {
    const newBoundaries = {
      outer: { ...boundaries.outer },
      inner: { ...boundaries.inner },
    };

    const isVertical = side === 'left' || side === 'right';
    
    if (isVertical) {
      const newX = boundaries[borderType][side] + deltaX;
      
      // Clamp based on boundary type
      let clampedX: number;
      if (borderType === 'outer') {
        // Outer boundaries can extend to the edge of the image
        if (side === 'left') {
          clampedX = Math.max(
            0, // Can go to left edge of image
            Math.min(boundaries.inner.left, newX) // Can't go past inner boundary
          );
        } else {
          clampedX = Math.min(
            imageWidth, // Can go to right edge of image
            Math.max(boundaries.inner.right, newX) // Can't go past inner boundary
          );
        }
      } else {
        // Inner boundaries can only extend up to their respective outer boundary
        // AND cannot cross over each other
        if (side === 'left') {
          clampedX = Math.max(
            boundaries.outer.left,
            Math.min(boundaries.inner.right - 1, newX) // Cannot go past inner right
          );
        } else {
          clampedX = Math.min(
            boundaries.outer.right,
            Math.max(boundaries.inner.left + 1, newX) // Cannot go past inner left
          );
        }
      }
      
      newBoundaries[borderType][side] = clampedX;
      triggerHapticIfNeeded(clampedX, 0);
    } else {
      const newY = boundaries[borderType][side] + deltaY;
      
      // Clamp based on boundary type
      let clampedY: number;
      if (borderType === 'outer') {
        // Outer boundaries can extend to the edge of the image
        if (side === 'top') {
          clampedY = Math.max(
            0, // Can go to top edge of image
            Math.min(boundaries.inner.top, newY) // Can't go past inner boundary
          );
        } else {
          clampedY = Math.min(
            imageHeight, // Can go to bottom edge of image
            Math.max(boundaries.inner.bottom, newY) // Can't go past inner boundary
          );
        }
      } else {
        // Inner boundaries can only extend up to their respective outer boundary
        // AND cannot cross over each other
        if (side === 'top') {
          clampedY = Math.max(
            boundaries.outer.top,
            Math.min(boundaries.inner.bottom - 1, newY) // Cannot go past inner bottom
          );
        } else {
          clampedY = Math.min(
            boundaries.outer.bottom,
            Math.max(boundaries.inner.top + 1, newY) // Cannot go past inner top
          );
        }
      }
      
      newBoundaries[borderType][side] = clampedY;
      triggerHapticIfNeeded(0, clampedY);
    }

    onBoundariesChange(newBoundaries);
  };

  const renderNotch = (
    id: string,
    x: number,
    y: number,
    direction: 'up' | 'down' | 'left' | 'right',
    borderType: BorderType,
    side: BorderSide
  ) => {
    const isActive = activeHandle === id;
    const color = lineColor;
    const notchWidth = 40;
    const notchLength = 15;
    const cornerRadius = 8;
    // Minimum touch target size (48x48 for Android, 44x44 for iOS - using 48 for safety)
    const minTouchSize = 48;

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setActiveHandle(id);
        // Reset haptic position when starting a new drag
        const isVertical = side === 'left' || side === 'right';
        if (isVertical) {
          lastHapticPosition.current = { x: boundaries[borderType][side], y: 0 };
        } else {
          lastHapticPosition.current = { x: 0, y: boundaries[borderType][side] };
        }
        if (onDraggingChange) {
          onDraggingChange(true);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        // Adjust deltas by scale to account for zoomed coordinate system
        const adjustedDx = gestureState.dx / scale;
        const adjustedDy = gestureState.dy / scale;
        handleDrag(borderType, side, adjustedDx, adjustedDy);
      },
      onPanResponderRelease: () => {
        setActiveHandle(null);
        if (onDraggingChange) {
          onDraggingChange(false);
        }
      },
      onPanResponderTerminate: () => {
        setActiveHandle(null);
        if (onDraggingChange) {
          onDraggingChange(false);
        }
      },
    });

    // Create path with rounded corners only on far end
    let pathData = '';
    const r = cornerRadius;

    switch (direction) {
      case 'up':
        // Extends upward from the line - round top corners
        const upX = x - notchWidth / 2;
        const upY = y - notchLength;
        pathData = `
          M ${upX + r},${upY}
          L ${upX + notchWidth - r},${upY}
          Q ${upX + notchWidth},${upY} ${upX + notchWidth},${upY + r}
          L ${upX + notchWidth},${y}
          L ${upX},${y}
          L ${upX},${upY + r}
          Q ${upX},${upY} ${upX + r},${upY}
          Z
        `;
        break;
      case 'down':
        // Extends downward from the line - round bottom corners
        const downX = x - notchWidth / 2;
        const downY = y;
        pathData = `
          M ${downX},${downY}
          L ${downX + notchWidth},${downY}
          L ${downX + notchWidth},${downY + notchLength - r}
          Q ${downX + notchWidth},${downY + notchLength} ${downX + notchWidth - r},${downY + notchLength}
          L ${downX + r},${downY + notchLength}
          Q ${downX},${downY + notchLength} ${downX},${downY + notchLength - r}
          L ${downX},${downY}
          Z
        `;
        break;
      case 'left':
        // Extends leftward from the line - round left corners
        const leftX = x - notchLength;
        const leftY = y - notchWidth / 2;
        pathData = `
          M ${leftX + r},${leftY}
          L ${x},${leftY}
          L ${x},${leftY + notchWidth}
          L ${leftX + r},${leftY + notchWidth}
          Q ${leftX},${leftY + notchWidth} ${leftX},${leftY + notchWidth - r}
          L ${leftX},${leftY + r}
          Q ${leftX},${leftY} ${leftX + r},${leftY}
          Z
        `;
        break;
      case 'right':
        // Extends rightward from the line - round right corners
        const rightX = x;
        const rightY = y - notchWidth / 2;
        pathData = `
          M ${rightX},${rightY}
          L ${rightX + notchLength - r},${rightY}
          Q ${rightX + notchLength},${rightY} ${rightX + notchLength},${rightY + r}
          L ${rightX + notchLength},${rightY + notchWidth - r}
          Q ${rightX + notchLength},${rightY + notchWidth} ${rightX + notchLength - r},${rightY + notchWidth}
          L ${rightX},${rightY + notchWidth}
          L ${rightX},${rightY}
          Z
        `;
        break;
    }

    // Calculate touch area position (centered on notch)
    let touchAreaX = x - minTouchSize / 2;
    let touchAreaY = y - minTouchSize / 2;
    
    // Adjust touch area position based on direction to keep it centered on the notch
    switch (direction) {
      case 'up':
        touchAreaY = y - notchLength - (minTouchSize - notchLength) / 2;
        break;
      case 'down':
        touchAreaY = y - (minTouchSize - notchLength) / 2;
        break;
      case 'left':
        touchAreaX = x - notchLength - (minTouchSize - notchLength) / 2;
        break;
      case 'right':
        touchAreaX = x - (minTouchSize - notchLength) / 2;
        break;
    }

    // Calculate center of notch
    let arrowCenterX = 0;
    let arrowCenterY = 0;

    switch (direction) {
      case 'up':
        arrowCenterX = x;
        arrowCenterY = y - notchLength / 2;
        break;
      case 'down':
        arrowCenterX = x;
        arrowCenterY = y + notchLength / 2;
        break;
      case 'left':
        arrowCenterX = x - notchLength / 2;
        arrowCenterY = y;
        break;
      case 'right':
        arrowCenterX = x + notchLength / 2;
        arrowCenterY = y;
        break;
    }

    // Determine arrow direction based on borderType and side
    // Inner borders: arrows point inward (toward card center)
    // Outer borders: arrows point outward (away from card)
    let arrowDirection: 'up' | 'down' | 'left' | 'right';

    if (borderType === 'inner') {
      // Inner notches: arrow points toward card center
      switch (direction) {
        case 'up': arrowDirection = 'up'; break; // Inner bottom - arrow points up
        case 'down': arrowDirection = 'down'; break; // Inner top - arrow points down
        case 'left': arrowDirection = 'left'; break; // Inner right - arrow points left
        case 'right': arrowDirection = 'right'; break; // Inner left - arrow points right
      }
    } else {
      // Outer notches: arrow points away from card
      switch (direction) {
        case 'up': arrowDirection = 'down'; break; // Outer bottom - arrow points down
        case 'down': arrowDirection = 'up'; break; // Outer top - arrow points up
        case 'left': arrowDirection = 'right'; break; // Outer right - arrow points right
        case 'right': arrowDirection = 'left'; break; // Outer left - arrow points left
      }
    }

    const arrowPath = createArrowPath(arrowCenterX, arrowCenterY, arrowDirection);
    const arrowStrokeWidth = 2;

    return (
      <G key={id}>
        {/* Invisible expanded touch area */}
        <Rect
          x={touchAreaX}
          y={touchAreaY}
          width={minTouchSize}
          height={minTouchSize}
          fill="transparent"
          {...panResponder.panHandlers}
        />
        {/* Visible notch (no handlers, purely visual - pointer events disabled to allow touch area to receive events) */}
        <Path
          d={pathData}
          fill={color}
          opacity={isActive ? 0.9 : 0.4}
          stroke={color}
          strokeWidth={1}
          pointerEvents="none"
        />
        {/* Arrow icon - arrowhead only */}
        <Path
          d={arrowPath}
          stroke="white"
          strokeWidth={arrowStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={isActive ? 1 : 0.7}
          pointerEvents="none"
        />
      </G>
    );
  };

  const renderBorderHighlight = () => {
    const { outer, inner } = boundaries;

    return (
      <>
        <Defs>
          <Pattern
            id="diagonalHatch"
            patternUnits="userSpaceOnUse"
            width="10"
            height="10"
          >
            <Path
              d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2"
              stroke={lineColor}
              strokeWidth="1"
            />
          </Pattern>
        </Defs>

        {/* Top border area */}
        <Rect
          x={outer.left}
          y={outer.top}
          width={outer.right - outer.left}
          height={inner.top - outer.top}
          fill="url(#diagonalHatch)"
          opacity={0.3}
        />

        {/* Bottom border area */}
        <Rect
          x={outer.left}
          y={inner.bottom}
          width={outer.right - outer.left}
          height={outer.bottom - inner.bottom}
          fill="url(#diagonalHatch)"
          opacity={0.3}
        />

        {/* Left border area */}
        <Rect
          x={outer.left}
          y={outer.top}
          width={inner.left - outer.left}
          height={outer.bottom - outer.top}
          fill="url(#diagonalHatch)"
          opacity={0.3}
        />

        {/* Right border area */}
        <Rect
          x={inner.right}
          y={outer.top}
          width={outer.right - inner.right}
          height={outer.bottom - outer.top}
          fill="url(#diagonalHatch)"
          opacity={0.3}
        />
      </>
    );
  };

  const { outer, inner } = boundaries;

  // Add padding to SVG to accommodate notches extending from edges
  const svgPadding = 25;
  const svgWidth = imageWidth + (svgPadding * 2);
  const svgHeight = imageHeight + (svgPadding * 2);

  return (
    <View style={[styles.container, { left: -svgPadding, top: -svgPadding }]}>
      <Svg width={svgWidth} height={svgHeight} style={styles.svg}>
        <G transform={`translate(${svgPadding}, ${svgPadding})`}>
        {/* Border area highlighting */}
        {renderBorderHighlight()}

        {/* Outer border lines */}
        <Line
          x1={outer.left}
          y1={outer.top}
          x2={outer.right}
          y2={outer.top}
          stroke={lineColor}
          strokeWidth={0.5}
          opacity={0.9}
        />
        <Line
          x1={outer.left}
          y1={outer.bottom}
          x2={outer.right}
          y2={outer.bottom}
          stroke={lineColor}
          strokeWidth={0.5}
          opacity={0.9}
        />
        <Line
          x1={outer.left}
          y1={outer.top}
          x2={outer.left}
          y2={outer.bottom}
          stroke={lineColor}
          strokeWidth={0.5}
          opacity={0.9}
        />
        <Line
          x1={outer.right}
          y1={outer.top}
          x2={outer.right}
          y2={outer.bottom}
          stroke={lineColor}
          strokeWidth={0.5}
          opacity={0.9}
        />

        {/* Inner border lines */}
        <Line
          x1={inner.left}
          y1={inner.top}
          x2={inner.right}
          y2={inner.top}
          stroke={lineColor}
          strokeWidth={0.5}
          opacity={0.9}
        />
        <Line
          x1={inner.left}
          y1={inner.bottom}
          x2={inner.right}
          y2={inner.bottom}
          stroke={lineColor}
          strokeWidth={0.5}
          opacity={0.9}
        />
        <Line
          x1={inner.left}
          y1={inner.top}
          x2={inner.left}
          y2={inner.bottom}
          stroke={lineColor}
          strokeWidth={0.5}
          opacity={0.9}
        />
        <Line
          x1={inner.right}
          y1={inner.top}
          x2={inner.right}
          y2={inner.bottom}
          stroke={lineColor}
          strokeWidth={0.5}
          opacity={0.9}
        />

        {/* Draggable notch handles - staggered positions to avoid overlap */}
        {/* Outer border notches - extend inward toward card center */}
        {renderNotch('outer-top', (outer.left + outer.right) / 2 - 50, outer.top, 'down', 'outer', 'top')}
        {renderNotch('outer-bottom', (outer.left + outer.right) / 2 - 50, outer.bottom, 'up', 'outer', 'bottom')}
        {renderNotch('outer-left', outer.left, (outer.top + outer.bottom) / 2 - 50, 'right', 'outer', 'left')}
        {renderNotch('outer-right', outer.right, (outer.top + outer.bottom) / 2 - 50, 'left', 'outer', 'right')}

        {/* Inner border notches - staggered to avoid overlap with outer notches */}
        {renderNotch('inner-top', (inner.left + inner.right) / 2 + 50, inner.top, 'down', 'inner', 'top')}
        {renderNotch('inner-bottom', (inner.left + inner.right) / 2 + 50, inner.bottom, 'up', 'inner', 'bottom')}
        {renderNotch('inner-left', inner.left, (inner.top + inner.bottom) / 2 + 50, 'right', 'inner', 'left')}
        {renderNotch('inner-right', inner.right, (inner.top + inner.bottom) / 2 + 50, 'left', 'inner', 'right')}
        </G>
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
});
