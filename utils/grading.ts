import { GradingCompany, GradingResult, GradeThreshold } from '../types/grading';
import { GRADING_STANDARDS } from '../constants/gradingStandards';

export function calculateGrade(
  borderWearPercent: number,
  company: GradingCompany = 'PSA'
): GradingResult {
  const standard = GRADING_STANDARDS[company];
  
  if (!standard) {
    throw new Error(`Unknown grading company: ${company}`);
  }

  // Find the appropriate grade based on the border wear percentage
  let matchedGrade: GradeThreshold = standard.grades[standard.grades.length - 1]; // Default to lowest grade
  
  for (const grade of standard.grades) {
    if (borderWearPercent <= grade.maxBorderWearPercent) {
      matchedGrade = grade;
      break;
    }
  }

  return {
    company,
    score: matchedGrade.score,
    gradeName: matchedGrade.name,
    borderWearPercent,
    timestamp: new Date(),
  };
}

export function calculateAllGrades(
  borderWearPercent: number
): Record<GradingCompany, GradingResult> {
  return {
    PSA: calculateGrade(borderWearPercent, 'PSA'),
    BGS: calculateGrade(borderWearPercent, 'BGS'),
    CGC: calculateGrade(borderWearPercent, 'CGC'),
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

