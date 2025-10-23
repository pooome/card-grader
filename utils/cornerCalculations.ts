import { BorderBoundaries, CardDimensions } from '../types/measurements';

/**
 * Initialize border boundaries based on detected card edges
 * Places outer border outside card edges and inner border inside
 */
export function initializeBorderBoundaries(
  cardDimensions: CardDimensions,
  imageWidth: number,
  imageHeight: number,
  outerBorderOffset: number = 30,
  innerBorderOffset: number = 20
): BorderBoundaries {
  // Calculate outer boundaries constrained to image dimensions
  const outer = {
    top: Math.max(0, cardDimensions.topEdge - outerBorderOffset),
    bottom: Math.min(imageHeight, cardDimensions.bottomEdge + outerBorderOffset),
    left: Math.max(0, cardDimensions.leftEdge - outerBorderOffset),
    right: Math.min(imageWidth, cardDimensions.rightEdge + outerBorderOffset),
  };

  // Calculate inner boundaries constrained to both image dimensions and outer boundaries
  const inner = {
    top: Math.max(outer.top + 1, Math.min(cardDimensions.topEdge + innerBorderOffset, imageHeight - 1)),
    bottom: Math.min(outer.bottom - 1, Math.max(cardDimensions.bottomEdge - innerBorderOffset, 1)),
    left: Math.max(outer.left + 1, Math.min(cardDimensions.leftEdge + innerBorderOffset, imageWidth - 1)),
    right: Math.min(outer.right - 1, Math.max(cardDimensions.rightEdge + innerBorderOffset, 1)),
  };

  return {
    outer,
    inner,
  };
}

/**
 * Calculate border wear based on the outer and inner border positions
 * Returns a single wear percentage based on average border quality
 */
export function calculateBorderWear(
  boundaries: BorderBoundaries,
  cardDimensions: CardDimensions
): number {
  // Calculate border widths for each side
  const topBorderWidth = boundaries.inner.top - boundaries.outer.top;
  const bottomBorderWidth = boundaries.outer.bottom - boundaries.inner.bottom;
  const leftBorderWidth = boundaries.inner.left - boundaries.outer.left;
  const rightBorderWidth = boundaries.outer.right - boundaries.inner.right;

  // Calculate wear percentages based on border width
  // Larger border = more wear on the card edge
  const referenceSize = Math.min(cardDimensions.width, cardDimensions.height);
  
  const topWearPercent = (topBorderWidth / referenceSize) * 100;
  const bottomWearPercent = (bottomBorderWidth / referenceSize) * 100;
  const leftWearPercent = (leftBorderWidth / referenceSize) * 100;
  const rightWearPercent = (rightBorderWidth / referenceSize) * 100;

  // Calculate maximum wear across all sides (worst case)
  const maxWear = Math.max(
    topWearPercent,
    bottomWearPercent,
    leftWearPercent,
    rightWearPercent
  );

  return Math.max(0, Math.min(100, maxWear));
}

