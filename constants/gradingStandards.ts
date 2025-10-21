import { GradingStandard } from '../types/grading';

export const PSA_STANDARD: GradingStandard = {
  company: 'PSA',
  grades: [
    {
      score: 10,
      name: 'Gem Mint',
      maxCornerWearPercent: 1,
      description: 'Virtually perfect card with sharp corners and focus',
    },
    {
      score: 9,
      name: 'Mint',
      maxCornerWearPercent: 2,
      description: 'Super high-end card with only minor imperfections',
    },
    {
      score: 8,
      name: 'NM-MT',
      maxCornerWearPercent: 5,
      description: 'Near Mint to Mint condition with minimal wear',
    },
    {
      score: 7,
      name: 'Near Mint',
      maxCornerWearPercent: 10,
      description: 'Card has slight surface wear visible upon close inspection',
    },
    {
      score: 6,
      name: 'EX-MT',
      maxCornerWearPercent: 15,
      description: 'Excellent to Mint with minor wear on corners',
    },
    {
      score: 5,
      name: 'Excellent',
      maxCornerWearPercent: 25,
      description: 'Corners may be slightly rounded, surface wear evident',
    },
    {
      score: 4,
      name: 'VG-EX',
      maxCornerWearPercent: 35,
      description: 'Very Good to Excellent with noticeable corner wear',
    },
    {
      score: 3,
      name: 'Very Good',
      maxCornerWearPercent: 50,
      description: 'Obvious corner wear and surface scratching',
    },
    {
      score: 2,
      name: 'Good',
      maxCornerWearPercent: 70,
      description: 'Heavily worn corners and edges',
    },
    {
      score: 1,
      name: 'Poor',
      maxCornerWearPercent: 100,
      description: 'Card has significant damage and wear',
    },
  ],
};

// Future grading standards can be added here
export const BGS_STANDARD: GradingStandard = {
  company: 'BGS',
  grades: [
    {
      score: 10,
      name: 'Pristine',
      maxCornerWearPercent: 0.5,
      description: 'The best of the best - museum quality',
    },
    {
      score: 9.5,
      name: 'Gem Mint',
      maxCornerWearPercent: 1,
      description: 'Near perfect card',
    },
    {
      score: 9,
      name: 'Mint',
      maxCornerWearPercent: 2,
      description: 'Excellent condition with minor flaws',
    },
    // Add more BGS grades as needed
  ],
};

export const CGC_STANDARD: GradingStandard = {
  company: 'CGC',
  grades: [
    {
      score: 10,
      name: 'Pristine',
      maxCornerWearPercent: 1,
      description: 'Perfect or near-perfect card',
    },
    {
      score: 9.5,
      name: 'Mint+',
      maxCornerWearPercent: 1.5,
      description: 'Outstanding card with minimal wear',
    },
    {
      score: 9,
      name: 'Mint',
      maxCornerWearPercent: 2,
      description: 'High quality card with slight imperfections',
    },
    // Add more CGC grades as needed
  ],
};

export const GRADING_STANDARDS: Record<string, GradingStandard> = {
  PSA: PSA_STANDARD,
  BGS: BGS_STANDARD,
  CGC: CGC_STANDARD,
};

