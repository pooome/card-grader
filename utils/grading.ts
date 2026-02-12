import { GradingCompany, GradingResult, GradeThreshold } from '../types/grading';
import { CenteringMeasurements } from '../types/measurements';
import { GRADING_STANDARDS } from '../constants/gradingStandards';

/**
 * Calculate the maximum deviation from perfect 50/50 centering
 * For example: 55/45 = 5% deviation, 70/30 = 20% deviation
 */
function calculateCenteringDeviation(
  centering: { left: number; right: number } | { top: number; bottom: number }
): number {
  let larger: number;
  
  if ('left' in centering) {
    larger = Math.max(centering.left, centering.right);
  } else {
    larger = Math.max(centering.top, centering.bottom);
  }
  
  // Deviation from perfect 50/50
  return Math.abs(larger - 50);
}

/**
 * Calculate grade based on centering measurements
 */
export function calculateGrade(
  centering: CenteringMeasurements,
  side: 'front' | 'back',
  company: GradingCompany = 'PSA'
): GradingResult {
  const standard = GRADING_STANDARDS[company];
  
  if (!standard) {
    throw new Error(`Unknown grading company: ${company}`);
  }

  // Calculate deviations for both horizontal (leftRight) and vertical (topBottom)
  const leftRightDeviation = calculateCenteringDeviation(centering.leftRight);
  const topBottomDeviation = calculateCenteringDeviation(centering.topBottom);

  // Determine which threshold to use based on selected side
  const thresholdKey = side === 'front' ? 'maxCenteringDeviationFront' : 'maxCenteringDeviationBack';

  // Find the appropriate grade based on centering
  // BOTH leftRight AND topBottom deviations must meet the threshold for the selected side
  let matchedGrade: GradeThreshold = standard.grades[standard.grades.length - 1]; // Default to lowest grade

  for (const grade of standard.grades) {
    const maxThreshold = grade[thresholdKey];
    let meetsRequirement = false;

    // Check for asymmetric centering (only applies to front side for 9.5 grades)
    if (side === 'front' && grade.minCenteringDeviationFront !== undefined) {
      // Asymmetric centering: ONE direction must be <= min, OTHER direction must be <= max
      // Check both possible combinations
      const minThreshold = grade.minCenteringDeviationFront;
      const combo1 = leftRightDeviation <= minThreshold && topBottomDeviation <= maxThreshold;
      const combo2 = topBottomDeviation <= minThreshold && leftRightDeviation <= maxThreshold;
      meetsRequirement = combo1 || combo2;
    } else {
      // Symmetric centering: BOTH directions must be <= max
      meetsRequirement = leftRightDeviation <= maxThreshold && topBottomDeviation <= maxThreshold;
    }

    if (meetsRequirement) {
      matchedGrade = grade;
      break;
    }
  }

  return {
    company,
    score: matchedGrade.score,
    gradeName: matchedGrade.name,
    centeringFrontDeviation: leftRightDeviation,
    centeringBackDeviation: topBottomDeviation,
    timestamp: new Date(),
  };
}

/**
 * Calculate grades for all three companies
 */
export function calculateAllGrades(
  centering: CenteringMeasurements,
  side: 'front' | 'back'
): Record<GradingCompany, GradingResult> {
  return {
    PSA: calculateGrade(centering, side, 'PSA'),
    BGS: calculateGrade(centering, side, 'BGS'),
    CGC: calculateGrade(centering, side, 'CGC'),
  };
}

/**
 * Get the full grade threshold details for a specific score and company
 */
export function getGradeThreshold(score: number, company: GradingCompany = 'PSA'): GradeThreshold | undefined {
  const standard = GRADING_STANDARDS[company];
  return standard.grades.find(g => g.score === score && (g.isPristine === undefined || !g.isPristine));
}

/**
 * Get grade description
 */
export function getGradeDescription(score: number, company: GradingCompany = 'PSA'): string {
  const grade = getGradeThreshold(score, company);
  return grade?.description || 'Unknown grade';
}

/**
 * Get grade name
 */
export function getGradeName(score: number, company: GradingCompany = 'PSA'): string {
  const grade = getGradeThreshold(score, company);
  return grade?.name || 'Unknown';
}
