import { Worklets } from 'react-native-worklets-core';
import type { Frame } from 'react-native-vision-camera';
import {
  OpenCV,
  ObjectType,
  DataTypes,
  ColorConversionCodes,
  RetrievalModes,
  ContourApproximationModes
} from 'react-native-fast-opencv';

// Standard TCG card aspect ratio (3.5" height / 2.5" width)
const TARGET_ASPECT_RATIO = 1.4;
const ASPECT_RATIO_TOLERANCE = 0.15; // ±15% tolerance (Phase 3: tightened from 30%)
const MIN_ASPECT_RATIO = TARGET_ASPECT_RATIO * (1 - ASPECT_RATIO_TOLERANCE); // 1.19
const MAX_ASPECT_RATIO = TARGET_ASPECT_RATIO * (1 + ASPECT_RATIO_TOLERANCE); // 1.61

// Area constraints (relative to frame size)
const MIN_AREA_RATIO = 0.05; // Card should be at least 5% of frame (far away)
const MAX_AREA_RATIO = 0.40; // Card should not exceed 40% of frame (close up)

export interface CardCorners {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
}

export interface DetectionDebugInfo {
  edgesBase64?: string;
  grayscaleBase64?: string;
  annotatedBase64?: string;
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
 * Calculate interior angles at each corner of quadrilateral
 * Returns angles in degrees
 */
function calculateCornerAngles(corners: Array<{ x: number; y: number }>): number[] {
  'worklet';
  const angles: number[] = [];

  for (let i = 0; i < 4; i++) {
    const prev = corners[(i + 3) % 4];
    const curr = corners[i];
    const next = corners[(i + 1) % 4];

    // Vectors from current corner to adjacent corners
    const v1x = prev.x - curr.x;
    const v1y = prev.y - curr.y;
    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;

    // Angle between vectors using dot product
    const dot = v1x * v2x + v1y * v2y;
    const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
    const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);

    const angle = Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2)))) * (180 / Math.PI);
    angles.push(angle);
  }

  return angles;
}

/**
 * Calculate score based on how close angles are to 90°
 */
function calculateAngleScore(angles: number[]): number {
  'worklet';
  // Average deviation from 90°
  const avgDeviation = angles.reduce((sum, a) => sum + Math.abs(90 - a), 0) / 4;
  return 1.0 - Math.min(1.0, avgDeviation / 45);
}

/**
 * Validates and scores a quadrilateral candidate
 * Returns validation result with score 0-1 (higher = better card candidate)
 */
function validateCandidate(
  corners: Array<{ x: number; y: number }>,
  area: number,
  resizedArea: number
): { valid: boolean; score: number; reason?: string } {
  'worklet';

  const areaRatio = area / resizedArea;

  // Area constraint: card should be 5-40% of frame
  if (areaRatio < MIN_AREA_RATIO) {
    return { valid: false, score: 0, reason: `Too small: ${(areaRatio*100).toFixed(1)}%` };
  }
  if (areaRatio > MAX_AREA_RATIO) {
    return { valid: false, score: 0, reason: `Too large: ${(areaRatio*100).toFixed(1)}%` };
  }

  // Calculate side lengths
  const width1 = Math.hypot(corners[0].x - corners[1].x, corners[0].y - corners[1].y);
  const width2 = Math.hypot(corners[2].x - corners[3].x, corners[2].y - corners[3].y);
  const height1 = Math.hypot(corners[1].x - corners[2].x, corners[1].y - corners[2].y);
  const height2 = Math.hypot(corners[3].x - corners[0].x, corners[3].y - corners[0].y);

  const avgWidth = (width1 + width2) / 2;
  const avgHeight = (height1 + height2) / 2;

  // Aspect ratio: TCG cards are 1.4:1 (height:width)
  const aspectRatio = Math.max(avgHeight, avgWidth) / Math.min(avgHeight, avgWidth);

  if (aspectRatio < MIN_ASPECT_RATIO || aspectRatio > MAX_ASPECT_RATIO) {
    return { valid: false, score: 0, reason: `Bad aspect: ${aspectRatio.toFixed(2)}` };
  }

  // Side parallelism: opposite sides should be similar length
  const widthDiff = Math.abs(width1 - width2) / avgWidth;
  const heightDiff = Math.abs(height1 - height2) / avgHeight;

  if (widthDiff > 0.3 || heightDiff > 0.3) {
    return { valid: false, score: 0, reason: 'Non-parallel sides' };
  }

  // Corner angle validation: all angles should be ~90° (allow 45-135°)
  const angles = calculateCornerAngles(corners);
  for (const angle of angles) {
    if (angle < 45 || angle > 135) {
      return { valid: false, score: 0, reason: `Extreme angle: ${angle.toFixed(0)}°` };
    }
  }

  // Calculate composite score (0-1)
  let score = 0;

  // Area score: prefer 15-25% (typical card distance)
  const optimalArea = 0.20;
  const areaScore = 1.0 - Math.min(1.0, Math.abs(areaRatio - optimalArea) / optimalArea);
  score += areaScore * 0.3;

  // Aspect ratio score: closer to 1.4 = better
  const aspectScore = 1.0 - Math.min(1.0, Math.abs(aspectRatio - TARGET_ASPECT_RATIO) / TARGET_ASPECT_RATIO);
  score += aspectScore * 0.4;

  // Parallelism score: lower difference = better
  const parallelScore = 1.0 - ((widthDiff + heightDiff) / 2);
  score += parallelScore * 0.2;

  // Angle score: closer to 90° = better
  const angleScore = calculateAngleScore(angles);
  score += angleScore * 0.1;

  return { valid: true, score };
}

/**
 * Applies adaptive preprocessing to handle varied lighting conditions
 * Returns processed Mat ready for edge detection
 */
function adaptivePreprocess(cv: any, gray: any, resizeWidth: number, resizeHeight: number): any {
  'worklet';

  // Create adaptive threshold version (for low contrast scenarios)
  const adaptive = cv.createObject(ObjectType.Mat, resizeHeight, resizeWidth, DataTypes.CV_8UC1);

  // Use adaptive threshold: computes threshold for each pixel based on local neighborhood
  // blockSize=11: neighborhood size (must be odd)
  // C=2: constant subtracted from mean
  cv.invoke('adaptiveThreshold', gray, adaptive, 255,
    cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);

  // Apply morphological closing to fill small gaps in card edges
  const morphed = cv.createObject(ObjectType.Mat, resizeHeight, resizeWidth, DataTypes.CV_8UC1);

  // Create kernel for morphological operations (3x3 rectangular)
  const kernel = cv.getStructuringElement(cv.MORPH_RECT,
    cv.createObject(ObjectType.Size, 3, 3));

  // Closing: dilate then erode (fills small holes, connects broken edges)
  cv.invoke('morphologyEx', adaptive, morphed, cv.MORPH_CLOSE, kernel);

  return morphed;
}

/**
 * Detects a rectangular card in the camera frame using OpenCV with multi-stage adaptive detection
 * @param frame Camera frame from VisionCamera
 * @param resize Resize plugin function from vision-camera-resize-plugin
 * @returns Detected card corners in normalized coordinates (0-1) or null if no card found
 */
export function detectCard(frame: Frame, resize: any): CardCorners | null {
  'worklet';

  try {
    // Access OpenCV from global context (JSI module)
    const cv = global.__loadOpenCV?.() || OpenCV;

    if (!cv) {
      console.warn('[detectCard] OpenCV not available');
      return null;
    }

    // Get original frame dimensions for coordinate normalization
    const frameWidth = frame.width;
    const frameHeight = frame.height;

    // Resize frame to 480×640 for faster processing
    const resizeWidth = 480;
    const resizeHeight = 640;
    const resizedArea = resizeWidth * resizeHeight;

    const resized = resize(frame, {
      scale: { width: resizeWidth, height: resizeHeight },
      pixelFormat: 'rgb',
      dataType: 'uint8'
    });

    // Convert Uint8Array to OpenCV Mat
    const mat = cv.bufferToMat('uint8', resizeHeight, resizeWidth, 3, resized);

    // Create grayscale image
    const gray = cv.createObject(ObjectType.Mat, resizeHeight, resizeWidth, DataTypes.CV_8UC1);
    cv.invoke('cvtColor', mat, gray, ColorConversionCodes.COLOR_RGB2GRAY);

    // STAGE 1: Adaptive preprocessing
    const preprocessed = adaptivePreprocess(cv, gray, resizeWidth, resizeHeight);

    // Apply Gaussian blur to reduce noise
    const blurred = cv.createObject(ObjectType.Mat, resizeHeight, resizeWidth, DataTypes.CV_8UC1);
    const ksize = cv.createObject(ObjectType.Size, 5, 5);
    cv.invoke('GaussianBlur', preprocessed, blurred, ksize, 0);

    // STAGE 2: Multi-pass edge detection with different threshold combinations
    const edgeConfigs = [
      { lower: 50, upper: 150, name: 'conservative' },
      { lower: 30, upper: 100, name: 'moderate' },
      { lower: 20, upper: 80, name: 'aggressive' },
    ];

    let allCandidates: Array<{ corners: CardCorners; score: number }> = [];

    for (const config of edgeConfigs) {
      const edges = cv.createObject(ObjectType.Mat, resizeHeight, resizeWidth, DataTypes.CV_8UC1);
      cv.invoke('Canny', blurred, edges, config.lower, config.upper);

      const contours = cv.createObject(ObjectType.PointVectorOfVectors);
      const hierarchy = cv.createObject(ObjectType.Mat, 1, 1, DataTypes.CV_32SC4);
      cv.invoke('findContoursWithHierarchy', edges, contours, hierarchy,
                RetrievalModes.RETR_EXTERNAL, ContourApproximationModes.CHAIN_APPROX_SIMPLE);

      const contoursInfo = cv.toJSValue(contours);
      const numContours = contoursInfo.array.length;

      console.log(`[detectCard] ${config.name}: ${numContours} contours`);

      // STAGE 3: Process and validate candidates
      for (let i = 0; i < numContours; i++) {
        const contour = cv.copyObjectFromVector(contours, i);
        const areaResult = cv.invoke('contourArea', contour, false);
        const area = areaResult.value;

        // Quick area filter before expensive operations
        if (area < resizedArea * MIN_AREA_RATIO || area > resizedArea * MAX_AREA_RATIO) {
          continue;
        }

        // Approximate to polygon
        const periResult = cv.invoke('arcLength', contour, true);
        const peri = periResult.value;
        const approx = cv.createObject(ObjectType.PointVector);
        cv.invoke('approxPolyDP', contour, approx, 0.04 * peri, true);

        const approxInfo = cv.toJSValue(approx);
        if (approxInfo.array.length !== 4) {
          continue; // Not a quadrilateral
        }

        const corners = approxInfo.array.map((p: any) => ({ x: p.x, y: p.y }));

        // STAGE 4: Validate candidate with strict checks
        const validation = validateCandidate(corners, area, resizedArea);

        if (validation.valid && validation.score > 0.5) {
          // Order corners and transform to normalized coordinates
          const sortedCorners = orderCorners(corners);
          const scaleX = frameWidth / resizeWidth;
          const scaleY = frameHeight / resizeHeight;

          const cardCorners: CardCorners = {
            topLeft: {
              x: (sortedCorners[0].x * scaleX) / frameWidth,
              y: (sortedCorners[0].y * scaleY) / frameHeight
            },
            topRight: {
              x: (sortedCorners[1].x * scaleX) / frameWidth,
              y: (sortedCorners[1].y * scaleY) / frameHeight
            },
            bottomRight: {
              x: (sortedCorners[2].x * scaleX) / frameWidth,
              y: (sortedCorners[2].y * scaleY) / frameHeight
            },
            bottomLeft: {
              x: (sortedCorners[3].x * scaleX) / frameWidth,
              y: (sortedCorners[3].y * scaleY) / frameHeight
            },
          };

          // Log coordinate transformations for debugging
          console.log(`[detectCard]   Candidate: resized=(${sortedCorners[0].x.toFixed(0)},${sortedCorners[0].y.toFixed(0)}) → normalized=(${cardCorners.topLeft.x.toFixed(3)},${cardCorners.topLeft.y.toFixed(3)}) score=${validation.score.toFixed(2)}`);

          allCandidates.push({ corners: cardCorners, score: validation.score });
        }
      }

      // If we found high-quality candidates, stop trying more aggressive thresholds
      const bestInPass = allCandidates.sort((a, b) => b.score - a.score)[0];
      if (bestInPass && bestInPass.score > 0.8) {
        console.log(`[detectCard] High-quality detection with ${config.name} (score: ${bestInPass.score.toFixed(2)})`);
        break;
      }
    }

    // Return best candidate
    if (allCandidates.length > 0) {
      allCandidates.sort((a, b) => b.score - a.score);
      const best = allCandidates[0];
      console.log(`[detectCard] ✓ Card detected! Score: ${best.score.toFixed(2)} from ${allCandidates.length} candidates`);
      console.log(`[detectCard]   Final corners: TL=(${best.corners.topLeft.x.toFixed(3)},${best.corners.topLeft.y.toFixed(3)}) TR=(${best.corners.topRight.x.toFixed(3)},${best.corners.topRight.y.toFixed(3)}) BR=(${best.corners.bottomRight.x.toFixed(3)},${best.corners.bottomRight.y.toFixed(3)}) BL=(${best.corners.bottomLeft.x.toFixed(3)},${best.corners.bottomLeft.y.toFixed(3)})`);
      return best.corners;
    }

    console.log(`[detectCard] ✗ No valid card candidates found`);
    return null;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[detectCard] Error:', errorMessage);
    return null;
  }
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
