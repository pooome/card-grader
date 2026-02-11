export type GradingCompany = 'PSA' | 'BGS' | 'CGC';

export interface GradingStandard {
  company: GradingCompany;
  grades: GradeThreshold[];
}

export interface GradeThreshold {
  score: number;  // Support 0.5 increments: 1, 1.5, 2, 2.5, ..., 9.5, 10
  name: string;
  maxCenteringDeviationFront: number;  // Max % deviation from 50/50 (e.g., 55/45 = 5%)
  minCenteringDeviationFront?: number; // When present: one direction must be <= min, other <= max (e.g., BGS/CGC 9.5: 50/50 one way + 55/45 other)
  maxCenteringDeviationBack: number;   // Max % deviation from 50/50 (always symmetric - both directions must meet this)
  description: string;
  isPristine?: boolean;  // To differentiate Pristine 10 from Gem Mint 10
}

export interface GradingResult {
  company: GradingCompany;
  score: number;
  gradeName: string;
  centeringFrontDeviation: number;  // Max deviation from 50/50 on front
  centeringBackDeviation: number;   // Max deviation from 50/50 on back
  timestamp: Date;
}

