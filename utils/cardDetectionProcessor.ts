import { Worklets } from 'react-native-worklets-core';
import type { Frame } from 'react-native-vision-camera';

// Standard TCG card aspect ratio (3.5" height / 2.5" width)
const TARGET_ASPECT_RATIO = 1.4;
const ASPECT_RATIO_TOLERANCE = 0.15; // ±15% tolerance
const MIN_ASPECT_RATIO = TARGET_ASPECT_RATIO * (1 - ASPECT_RATIO_TOLERANCE);
const MAX_ASPECT_RATIO = TARGET_ASPECT_RATIO * (1 + ASPECT_RATIO_TOLERANCE);

// Minimum area threshold (relative to frame size)
const MIN_AREA_RATIO = 0.1; // Card should be at least 10% of frame
const MAX_AREA_RATIO = 0.9; // Card should not exceed 90% of frame

export interface CardCorners {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
}

/**
 * Detects a rectangular card in the camera frame using OpenCV
 * @param frame Camera frame from VisionCamera
 * @returns Detected card corners in normalized coordinates (0-1) or null if no card found
 */
export function detectCard(frame: Frame): CardCorners | null {
  'worklet';
  
  try {
    // Import OpenCV inside the worklet
    const cv = global.cv;
    
    if (!cv) {
      console.warn('OpenCV not available');
      return null;
    }

    // Get frame dimensions
    const frameWidth = frame.width;
    const frameHeight = frame.height;
    const frameArea = frameWidth * frameHeight;

    // Convert frame to OpenCV Mat
    const mat = cv.frameToMat(frame);
    
    // Convert to grayscale
    const gray = new cv.Mat();
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
    
    // Apply Gaussian blur to reduce noise
    const blurred = new cv.Mat();
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    
    // Apply Canny edge detection
    const edges = new cv.Mat();
    cv.Canny(blurred, edges, 50, 150);
    
    // Find contours
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
    let bestCandidate: CardCorners | null = null;
    let bestScore = 0;
    
    // Iterate through contours to find the best rectangle
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const area = cv.contourArea(contour);
      
      // Check if area is within acceptable range
      const areaRatio = area / frameArea;
      if (areaRatio < MIN_AREA_RATIO || areaRatio > MAX_AREA_RATIO) {
        continue;
      }
      
      // Approximate contour to polygon
      const peri = cv.arcLength(contour, true);
      const approx = new cv.Mat();
      cv.approxPolyDP(contour, approx, 0.02 * peri, true);
      
      // Check if it's a quadrilateral
      if (approx.rows === 4) {
        // Get the four corners
        const corners = [
          { x: approx.data32S[0], y: approx.data32S[1] },
          { x: approx.data32S[2], y: approx.data32S[3] },
          { x: approx.data32S[4], y: approx.data32S[5] },
          { x: approx.data32S[6], y: approx.data32S[7] },
        ];
        
        // Calculate width and height of the detected rectangle
        const width1 = Math.hypot(corners[0].x - corners[1].x, corners[0].y - corners[1].y);
        const width2 = Math.hypot(corners[2].x - corners[3].x, corners[2].y - corners[3].y);
        const height1 = Math.hypot(corners[1].x - corners[2].x, corners[1].y - corners[2].y);
        const height2 = Math.hypot(corners[3].x - corners[0].x, corners[3].y - corners[0].y);
        
        const avgWidth = (width1 + width2) / 2;
        const avgHeight = (height1 + height2) / 2;
        
        // Calculate aspect ratio (height / width for portrait orientation)
        const aspectRatio = Math.max(avgHeight, avgWidth) / Math.min(avgHeight, avgWidth);
        
        // Check if aspect ratio matches TCG card
        if (aspectRatio >= MIN_ASPECT_RATIO && aspectRatio <= MAX_ASPECT_RATIO) {
          // Score based on area (prefer larger cards) and aspect ratio match
          const aspectRatioDiff = Math.abs(aspectRatio - TARGET_ASPECT_RATIO);
          const score = areaRatio * (1 - aspectRatioDiff);
          
          if (score > bestScore) {
            bestScore = score;
            
            // Order corners: top-left, top-right, bottom-right, bottom-left
            const sortedCorners = orderCorners(corners);
            
            // Normalize coordinates to 0-1 range
            bestCandidate = {
              topLeft: { 
                x: sortedCorners[0].x / frameWidth, 
                y: sortedCorners[0].y / frameHeight 
              },
              topRight: { 
                x: sortedCorners[1].x / frameWidth, 
                y: sortedCorners[1].y / frameHeight 
              },
              bottomRight: { 
                x: sortedCorners[2].x / frameWidth, 
                y: sortedCorners[2].y / frameHeight 
              },
              bottomLeft: { 
                x: sortedCorners[3].x / frameWidth, 
                y: sortedCorners[3].y / frameHeight 
              },
            };
          }
        }
      }
      
      approx.delete();
    }
    
    // Cleanup
    mat.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
    
    return bestCandidate;
    
  } catch (error) {
    console.error('Error in card detection:', error);
    return null;
  }
}

/**
 * Orders four corners in clockwise order starting from top-left
 */
function orderCorners(corners: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
  'worklet';
  
  // Calculate centroid
  const centroidX = corners.reduce((sum, p) => sum + p.x, 0) / 4;
  const centroidY = corners.reduce((sum, p) => sum + p.y, 0) / 4;
  
  // Sort by angle from centroid
  const sorted = corners.map(corner => {
    const angle = Math.atan2(corner.y - centroidY, corner.x - centroidX);
    return { corner, angle };
  }).sort((a, b) => a.angle - b.angle);
  
  // Find top-left (smallest x + y)
  const summed = sorted.map(({ corner }) => ({
    corner,
    sum: corner.x + corner.y,
  }));
  
  const topLeftIdx = summed.reduce((minIdx, curr, idx) => 
    curr.sum < summed[minIdx].sum ? idx : minIdx, 0
  );
  
  // Reorder starting from top-left going clockwise
  const ordered = [];
  for (let i = 0; i < 4; i++) {
    ordered.push(sorted[(topLeftIdx + i) % 4].corner);
  }
  
  return ordered;
}

/**
 * Smooths detected corners over multiple frames to reduce jitter
 */
export class CornerSmoother {
  private history: CardCorners[] = [];
  private readonly maxHistory = 5;
  
  addCorners(corners: CardCorners | null): CardCorners | null {
    if (!corners) {
      this.history = [];
      return null;
    }
    
    this.history.push(corners);
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    
    // Return average of all corners in history
    if (this.history.length === 0) {
      return null;
    }
    
    const avgCorners: CardCorners = {
      topLeft: this.averagePoint(this.history.map(c => c.topLeft)),
      topRight: this.averagePoint(this.history.map(c => c.topRight)),
      bottomRight: this.averagePoint(this.history.map(c => c.bottomRight)),
      bottomLeft: this.averagePoint(this.history.map(c => c.bottomLeft)),
    };
    
    return avgCorners;
  }
  
  private averagePoint(points: Array<{ x: number; y: number }>): { x: number; y: number } {
    const sum = points.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
      { x: 0, y: 0 }
    );
    return {
      x: sum.x / points.length,
      y: sum.y / points.length,
    };
  }
  
  reset(): void {
    this.history = [];
  }
}

