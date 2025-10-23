import { GradingStandard } from '../types/grading';

export const PSA_STANDARD: GradingStandard = {
  company: 'PSA',
  grades: [
    {
      score: 10,
      name: 'Gem Mint',
      maxBorderWearPercent: 1,
      description: 'Virtually perfect card with sharp borders and focus',
    },
    {
      score: 9,
      name: 'Mint',
      maxBorderWearPercent: 2,
      description: 'Super high-end card with only minor imperfections',
    },
    {
      score: 8,
      name: 'NM-MT',
      maxBorderWearPercent: 5,
      description: 'Near Mint to Mint condition with minimal wear',
    },
    {
      score: 7,
      name: 'Near Mint',
      maxBorderWearPercent: 10,
      description: 'Card has slight surface wear visible upon close inspection',
    },
    {
      score: 6,
      name: 'EX-MT',
      maxBorderWearPercent: 15,
      description: 'Excellent to Mint with minor wear on borders',
    },
    {
      score: 5,
      name: 'Excellent',
      maxBorderWearPercent: 25,
      description: 'Borders may show wear, surface wear evident',
    },
    {
      score: 4,
      name: 'VG-EX',
      maxBorderWearPercent: 35,
      description: 'Very Good to Excellent with noticeable border wear',
    },
    {
      score: 3,
      name: 'Very Good',
      maxBorderWearPercent: 50,
      description: 'Obvious border wear and surface scratching',
    },
    {
      score: 2,
      name: 'Good',
      maxBorderWearPercent: 70,
      description: 'Heavily worn borders and edges',
    },
    {
      score: 1,
      name: 'Poor',
      maxBorderWearPercent: 100,
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
      maxBorderWearPercent: 0.5,
      description: 'The best of the best - museum quality',
    },
    {
      score: 9.5,
      name: 'Gem Mint',
      maxBorderWearPercent: 1,
      description: 'Near perfect card',
    },
    {
      score: 9,
      name: 'Mint',
      maxBorderWearPercent: 2,
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
      maxBorderWearPercent: 1,
      description: 'Perfect or near-perfect card',
    },
    {
      score: 9.5,
      name: 'Mint+',
      maxBorderWearPercent: 1.5,
      description: 'Outstanding card with minimal wear',
    },
    {
      score: 9,
      name: 'Mint',
      maxBorderWearPercent: 2,
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

