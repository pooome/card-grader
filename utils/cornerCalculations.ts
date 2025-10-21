import { CornerBoundaries, CardDimensions, CornerMeasurement } from '../types/measurements';
import { CornerWearPercentages } from '../types/grading';

/**
 * Calculate corner wear percentages based on draggable line positions
 * Each corner has 2 lines that mark the start and end of corner wear
 */
export function calculateCornerWearPercentages(
  boundaries: CornerBoundaries,
  cardDimensions: CardDimensions
): CornerWearPercentages {
  // Calculate wear for each corner
  const topLeftWear = calculateSingleCornerWear(
    boundaries.topLeft,
    cardDimensions,
    'topLeft'
  );
  
  const topRightWear = calculateSingleCornerWear(
    boundaries.topRight,
    cardDimensions,
    'topRight'
  );
  
  const bottomLeftWear = calculateSingleCornerWear(
    boundaries.bottomLeft,
    cardDimensions,
    'bottomLeft'
  );
  
  const bottomRightWear = calculateSingleCornerWear(
    boundaries.bottomRight,
    cardDimensions,
    'bottomRight'
  );

  const maxWear = Math.max(
    topLeftWear.wearPercentage,
    topRightWear.wearPercentage,
    bottomLeftWear.wearPercentage,
    bottomRightWear.wearPercentage
  );

  return {
    topLeft: topLeftWear.wearPercentage,
    topRight: topRightWear.wearPercentage,
    bottomLeft: bottomLeftWear.wearPercentage,
    bottomRight: bottomRightWear.wearPercentage,
    maxWear,
  };
}

/**
 * Calculate wear percentage for a single corner
 * Average the wear on both edges (horizontal and vertical) of the corner
 */
function calculateSingleCornerWear(
  corner: { horizontal: number; vertical: number },
  cardDimensions: CardDimensions,
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
): CornerMeasurement {
  let horizontalWear = 0;
  let verticalWear = 0;

  switch (position) {
    case 'topLeft':
      // Horizontal: distance from top edge to horizontal line
      horizontalWear = corner.horizontal - cardDimensions.topEdge;
      // Vertical: distance from left edge to vertical line
      verticalWear = corner.vertical - cardDimensions.leftEdge;
      break;
    
    case 'topRight':
      // Horizontal: distance from top edge to horizontal line
      horizontalWear = corner.horizontal - cardDimensions.topEdge;
      // Vertical: distance from vertical line to right edge
      verticalWear = cardDimensions.rightEdge - corner.vertical;
      break;
    
    case 'bottomLeft':
      // Horizontal: distance from horizontal line to bottom edge
      horizontalWear = cardDimensions.bottomEdge - corner.horizontal;
      // Vertical: distance from left edge to vertical line
      verticalWear = corner.vertical - cardDimensions.leftEdge;
      break;
    
    case 'bottomRight':
      // Horizontal: distance from horizontal line to bottom edge
      horizontalWear = cardDimensions.bottomEdge - corner.horizontal;
      // Vertical: distance from vertical line to right edge
      verticalWear = cardDimensions.rightEdge - corner.vertical;
      break;
  }

  // Calculate percentage based on card dimensions
  const horizontalPercent = (horizontalWear / cardDimensions.height) * 100;
  const verticalPercent = (verticalWear / cardDimensions.width) * 100;

  // Average the two wear measurements
  const averageWear = (horizontalPercent + verticalPercent) / 2;
  const wearPercentage = Math.max(0, Math.min(100, averageWear)); // Clamp between 0-100

  return {
    corner: position,
    wearLength: (horizontalWear + verticalWear) / 2,
    edgeLength: (cardDimensions.width + cardDimensions.height) / 2,
    wearPercentage,
  };
}

/**
 * Initialize corner boundaries based on detected card edges
 * Places boundaries at estimated corner positions (small default wear)
 */
export function initializeCornerBoundaries(
  cardDimensions: CardDimensions,
  defaultWearPercent: number = 2
): CornerBoundaries {
  const defaultWearPixels = (cardDimensions.width * defaultWearPercent) / 100;

  return {
    topLeft: {
      horizontal: cardDimensions.topEdge + defaultWearPixels,
      vertical: cardDimensions.leftEdge + defaultWearPixels,
    },
    topRight: {
      horizontal: cardDimensions.topEdge + defaultWearPixels,
      vertical: cardDimensions.rightEdge - defaultWearPixels,
    },
    bottomLeft: {
      horizontal: cardDimensions.bottomEdge - defaultWearPixels,
      vertical: cardDimensions.leftEdge + defaultWearPixels,
    },
    bottomRight: {
      horizontal: cardDimensions.bottomEdge - defaultWearPixels,
      vertical: cardDimensions.rightEdge - defaultWearPixels,
    },
  };
}

