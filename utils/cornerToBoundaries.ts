import { CardCorners } from './cardDetectionProcessor';
import { BorderBoundaries, CardDimensions } from '../types/measurements';

/**
 * Converts detected card corners to BorderBoundaries format
 * @param corners Detected card corners in normalized coordinates (0-1)
 * @param imageWidth Display width of the image
 * @param imageHeight Display height of the image
 * @returns BorderBoundaries and CardDimensions based on detected corners
 */
export function cornersToInitialBoundaries(
  corners: CardCorners,
  imageWidth: number,
  imageHeight: number
): { boundaries: BorderBoundaries; dimensions: CardDimensions } {
  // Convert normalized coordinates to pixel coordinates
  const topLeft = {
    x: corners.topLeft.x * imageWidth,
    y: corners.topLeft.y * imageHeight,
  };
  const topRight = {
    x: corners.topRight.x * imageWidth,
    y: corners.topRight.y * imageHeight,
  };
  const bottomRight = {
    x: corners.bottomRight.x * imageWidth,
    y: corners.bottomRight.y * imageHeight,
  };
  const bottomLeft = {
    x: corners.bottomLeft.x * imageWidth,
    y: corners.bottomLeft.y * imageHeight,
  };

  // Calculate the outer boundaries (the detected card edges)
  const outerLeft = Math.min(topLeft.x, bottomLeft.x);
  const outerRight = Math.max(topRight.x, bottomRight.x);
  const outerTop = Math.min(topLeft.y, topRight.y);
  const outerBottom = Math.max(bottomLeft.y, bottomRight.y);

  // Calculate the detected card dimensions
  const cardWidth = outerRight - outerLeft;
  const cardHeight = outerBottom - outerTop;

  // Standard border is approximately 3-4% of card dimensions on each side
  // For a well-centered card with perfect borders
  const borderPercentage = 0.035; // 3.5% is a good default
  const horizontalBorderWidth = cardWidth * borderPercentage;
  const verticalBorderWidth = cardHeight * borderPercentage;

  // Calculate inner boundaries (assuming standard border width)
  const innerLeft = outerLeft + horizontalBorderWidth;
  const innerRight = outerRight - horizontalBorderWidth;
  const innerTop = outerTop + verticalBorderWidth;
  const innerBottom = outerBottom - verticalBorderWidth;

  // Ensure inner boundaries are valid (not crossed over)
  const validInnerLeft = Math.min(innerLeft, (outerLeft + outerRight) / 2 - 10);
  const validInnerRight = Math.max(innerRight, (outerLeft + outerRight) / 2 + 10);
  const validInnerTop = Math.min(innerTop, (outerTop + outerBottom) / 2 - 10);
  const validInnerBottom = Math.max(innerBottom, (outerTop + outerBottom) / 2 + 10);

  const boundaries: BorderBoundaries = {
    outer: {
      left: outerLeft,
      right: outerRight,
      top: outerTop,
      bottom: outerBottom,
    },
    inner: {
      left: validInnerLeft,
      right: validInnerRight,
      top: validInnerTop,
      bottom: validInnerBottom,
    },
  };

  const dimensions: CardDimensions = {
    width: cardWidth,
    height: cardHeight,
    left: outerLeft,
    top: outerTop,
  };

  return { boundaries, dimensions };
}

