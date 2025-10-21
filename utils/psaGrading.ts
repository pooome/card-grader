import { GradingCompany, GradingResult, GradeThreshold, CornerWearPercentages } from '../types/grading';
import { GRADING_STANDARDS } from '../constants/gradingStandards';

export function calculateGrade(
  cornerWearPercentages: CornerWearPercentages,
  company: GradingCompany = 'PSA'
): GradingResult {
  const standard = GRADING_STANDARDS[company];
  
  if (!standard) {
    throw new Error(`Unknown grading company: ${company}`);
  }

  // Find the appropriate grade based on the maximum corner wear
  const maxWear = cornerWearPercentages.maxWear;
  
  let matchedGrade: GradeThreshold = standard.grades[standard.grades.length - 1]; // Default to lowest grade
  
  for (const grade of standard.grades) {
    if (maxWear <= grade.maxCornerWearPercent) {
      matchedGrade = grade;
      break;
    }
  }

  return {
    company,
    score: matchedGrade.score,
    gradeName: matchedGrade.name,
    cornerWearPercentages,
    timestamp: new Date(),
  };
}

export function getGradeDescription(score: number, company: GradingCompany = 'PSA'): string {
  const standard = GRADING_STANDARDS[company];
  const grade = standard.grades.find(g => g.score === score);
  return grade?.description || 'Unknown grade';
}

export function getGradeName(score: number, company: GradingCompany = 'PSA'): string {
  const standard = GRADING_STANDARDS[company];
  const grade = standard.grades.find(g => g.score === score);
  return grade?.name || 'Unknown';
}

