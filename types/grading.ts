export type GradingCompany = 'PSA' | 'BGS' | 'CGC';

export interface GradingStandard {
  company: GradingCompany;
  grades: GradeThreshold[];
}

export interface GradeThreshold {
  score: number;
  name: string;
  maxBorderWearPercent: number;
  description: string;
}

export interface GradingResult {
  company: GradingCompany;
  score: number;
  gradeName: string;
  borderWearPercent: number;
  timestamp: Date;
}

