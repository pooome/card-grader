export type GradingCompany = 'PSA' | 'BGS' | 'CGC';

export interface GradingStandard {
  company: GradingCompany;
  grades: GradeThreshold[];
}

export interface GradeThreshold {
  score: number;
  name: string;
  maxCornerWearPercent: number;
  description: string;
}

export interface GradingResult {
  company: GradingCompany;
  score: number;
  gradeName: string;
  cornerWearPercentages: CornerWearPercentages;
  timestamp: Date;
}

export interface CornerWearPercentages {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
  maxWear: number;
}

