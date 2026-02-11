export interface Point {
  x: number;
  y: number;
}

export interface Line {
  start: Point;
  end: Point;
}

// New border-based structure
export interface BorderBoundaries {
  outer: {
    top: number;    // Y position
    bottom: number; // Y position
    left: number;   // X position
    right: number;  // X position
  };
  inner: {
    top: number;    // Y position
    bottom: number; // Y position
    left: number;   // X position
    right: number;  // X position
  };
}

// Legacy corner-based structure (kept for backward compatibility)
export interface CornerBoundaries {
  topLeft: {
    horizontal: number; // Y position of horizontal line
    vertical: number;   // X position of vertical line
  };
  topRight: {
    horizontal: number;
    vertical: number;
  };
  bottomLeft: {
    horizontal: number;
    vertical: number;
  };
  bottomRight: {
    horizontal: number;
    vertical: number;
  };
}

export interface CardDimensions {
  width: number;
  height: number;
  topEdge: number;
  bottomEdge: number;
  leftEdge: number;
  rightEdge: number;
}

export interface CornerMeasurement {
  corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  wearLength: number;
  edgeLength: number;
  wearPercentage: number;
}

export interface CenteringMeasurements {
  leftRight: { left: number; right: number };
  topBottom: { top: number; bottom: number };
}

