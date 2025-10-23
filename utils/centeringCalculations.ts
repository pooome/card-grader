import { BorderBoundaries, CardDimensions, CenteringMeasurements } from '../types/measurements';

/**
 * Calculate centering percentages from border boundaries
 * 
 * Centering measures how centered the card's artwork/image is on the card.
 * L|R shows the percentage of the LEFT border area compared to RIGHT border area.
 * T|B shows the percentage of the TOP border area compared to BOTTOM border area.
 * 
 * Example: L|R 50.0% | 50.0% means perfectly centered horizontally
 *          L|R 55.0% | 45.0% means more border on left (image shifted right)
 */
export function calculateCentering(
  boundaries: BorderBoundaries,
  cardDimensions: CardDimensions
): CenteringMeasurements {
  const { inner, outer } = boundaries;
  
  // Calculate border widths on each side
  // LEFT border = distance from card left edge to inner left edge
  const leftBorderWidth = inner.left - outer.left;
  
  // RIGHT border = distance from inner right edge to card right edge  
  const rightBorderWidth = outer.right - inner.right;
  
  // TOP border = distance from card top edge to inner top edge
  const topBorderWidth = inner.top - outer.top;
  
  // BOTTOM border = distance from inner bottom edge to card bottom edge
  const bottomBorderWidth = outer.bottom - inner.bottom;
  
  // Calculate total dimensions
  const totalHorizontal = leftBorderWidth + rightBorderWidth;
  const totalVertical = topBorderWidth + bottomBorderWidth;
  
  // Calculate percentages - what % is left vs right, top vs bottom
  const leftPercent = totalHorizontal > 0 ? (leftBorderWidth / totalHorizontal) * 100 : 50;
  const rightPercent = totalHorizontal > 0 ? (rightBorderWidth / totalHorizontal) * 100 : 50;
  const topPercent = totalVertical > 0 ? (topBorderWidth / totalVertical) * 100 : 50;
  const bottomPercent = totalVertical > 0 ? (bottomBorderWidth / totalVertical) * 100 : 50;
  
  return {
    leftRight: {
      left: Math.max(0, Math.min(100, leftPercent)),
      right: Math.max(0, Math.min(100, rightPercent)),
    },
    topBottom: {
      top: Math.max(0, Math.min(100, topPercent)),
      bottom: Math.max(0, Math.min(100, bottomPercent)),
    },
  };
}

