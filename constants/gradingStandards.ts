import { GradingStandard } from '../types/grading';

export const PSA_STANDARD: GradingStandard = {
  company: 'PSA',
  grades: [
    {
      score: 10,
      name: 'Gem Mint',
      maxCenteringDeviationFront: 5,  // 55/45 or better
      maxCenteringDeviationBack: 25,  // 75/25 or better
      description: 'Virtually perfect card with sharp borders and focus',
    },
    {
      score: 9.5,
      name: 'Mint+',
      maxCenteringDeviationFront: 7.5,  // Interpolated
      maxCenteringDeviationBack: 32.5,  // Interpolated
      description: 'High-end mint card with exceptional qualities',
    },
    {
      score: 9,
      name: 'Mint',
      maxCenteringDeviationFront: 10,  // 60/40 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Super high-end card with only minor imperfections',
    },
    {
      score: 8.5,
      name: 'NM-MT+',
      maxCenteringDeviationFront: 12.5,  // Interpolated
      maxCenteringDeviationBack: 40,
      description: 'High-end near mint to mint condition',
    },
    {
      score: 8,
      name: 'NM-MT',
      maxCenteringDeviationFront: 15,  // 65/35 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Near Mint to Mint condition with minimal wear',
    },
    {
      score: 7.5,
      name: 'Near Mint+',
      maxCenteringDeviationFront: 17.5,  // Interpolated
      maxCenteringDeviationBack: 40,
      description: 'High-end near mint with slight surface wear',
    },
    {
      score: 7,
      name: 'Near Mint',
      maxCenteringDeviationFront: 20,  // 70/30 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Card has slight surface wear visible upon close inspection',
    },
    {
      score: 6.5,
      name: 'EX-MT+',
      maxCenteringDeviationFront: 25,  // Interpolated
      maxCenteringDeviationBack: 40,
      description: 'High-end excellent to mint condition',
    },
    {
      score: 6,
      name: 'EX-MT',
      maxCenteringDeviationFront: 30,  // 80/20 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Excellent to Mint with minor wear on borders',
    },
    {
      score: 5.5,
      name: 'Excellent+',
      maxCenteringDeviationFront: 32.5,  // Interpolated
      maxCenteringDeviationBack: 40,
      description: 'High-end excellent condition',
    },
    {
      score: 5,
      name: 'Excellent',
      maxCenteringDeviationFront: 35,  // 85/15 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Borders may show wear, surface wear evident',
    },
    {
      score: 4.5,
      name: 'VG-EX+',
      maxCenteringDeviationFront: 35,
      maxCenteringDeviationBack: 40,
      description: 'High-end very good to excellent',
    },
    {
      score: 4,
      name: 'VG-EX',
      maxCenteringDeviationFront: 35,  // 85/15 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Very Good to Excellent with noticeable border wear',
    },
    {
      score: 3.5,
      name: 'Very Good+',
      maxCenteringDeviationFront: 40,
      maxCenteringDeviationBack: 40,
      description: 'High-end very good condition',
    },
    {
      score: 3,
      name: 'Very Good',
      maxCenteringDeviationFront: 40,  // 90/10 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Obvious border wear and surface scratching',
    },
    {
      score: 2.5,
      name: 'Good+',
      maxCenteringDeviationFront: 40,
      maxCenteringDeviationBack: 40,
      description: 'High-end good condition',
    },
    {
      score: 2,
      name: 'Good',
      maxCenteringDeviationFront: 40,  // 90/10 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Heavily worn borders and edges',
    },
    {
      score: 1.5,
      name: 'Fair',
      maxCenteringDeviationFront: 40,  // ~90/10 or better
      maxCenteringDeviationBack: 40,
      description: 'Card with extreme wear',
    },
    {
      score: 1,
      name: 'Poor',
      maxCenteringDeviationFront: 50,  // Any centering
      maxCenteringDeviationBack: 50,
      description: 'Card has significant damage and wear',
    },
  ],
};

export const BGS_STANDARD: GradingStandard = {
  company: 'BGS',
  grades: [
    {
      score: 10,
      name: 'Pristine',
      maxCenteringDeviationFront: 0,   // 50/50 perfect
      maxCenteringDeviationBack: 10,   // 60/40 or better
      description: 'The best of the best - museum quality',
      isPristine: true,
    },
    {
      score: 10,
      name: 'Gem Mint',
      maxCenteringDeviationFront: 5,   // 55/45 or better
      maxCenteringDeviationBack: 10,   // 60/40 or better
      description: 'Near perfect card',
      isPristine: false,
    },
    {
      score: 9.5,
      name: 'Gem Mint',
      maxCenteringDeviationFront: 5,   // ~50/50 one way, 55/45 other
      maxCenteringDeviationBack: 10,   // 60/40 or better
      description: 'Near perfect card',
    },
    {
      score: 9,
      name: 'Mint',
      maxCenteringDeviationFront: 5,   // 55/45 both ways
      maxCenteringDeviationBack: 20,   // 70/30 or better
      description: 'Excellent condition with minor flaws',
    },
    {
      score: 8.5,
      name: 'NM/Mint+',
      maxCenteringDeviationFront: 7.5,  // Interpolated
      maxCenteringDeviationBack: 25,    // Interpolated
      description: 'High-end near mint to mint',
    },
    {
      score: 8,
      name: 'NM/Mint',
      maxCenteringDeviationFront: 10,  // 60/40 both ways
      maxCenteringDeviationBack: 30,   // 80/20 or better
      description: 'Near mint to mint condition',
    },
    {
      score: 7.5,
      name: 'Near Mint+',
      maxCenteringDeviationFront: 12.5,  // Interpolated
      maxCenteringDeviationBack: 35,     // Interpolated
      description: 'High-end near mint',
    },
    {
      score: 7,
      name: 'Near Mint',
      maxCenteringDeviationFront: 15,  // 65/35 both ways
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Near mint with minor wear',
    },
    {
      score: 6.5,
      name: 'Excellent/Mint+',
      maxCenteringDeviationFront: 17.5,  // Interpolated
      maxCenteringDeviationBack: 42.5,   // Interpolated
      description: 'High-end excellent to mint',
    },
    {
      score: 6,
      name: 'Excellent/Mint',
      maxCenteringDeviationFront: 20,  // 70/30 both ways
      maxCenteringDeviationBack: 45,   // 95/5 or better
      description: 'Excellent to mint condition',
    },
    {
      score: 5.5,
      name: 'Excellent+',
      maxCenteringDeviationFront: 22.5,  // Interpolated
      maxCenteringDeviationBack: 45,
      description: 'High-end excellent',
    },
    {
      score: 5,
      name: 'Excellent',
      maxCenteringDeviationFront: 25,  // 75/25 front
      maxCenteringDeviationBack: 45,   // 95/5 back
      description: 'Excellent condition',
    },
    {
      score: 4.5,
      name: 'VG/Ex+',
      maxCenteringDeviationFront: 27.5,  // Interpolated
      maxCenteringDeviationBack: 47.5,   // Interpolated
      description: 'High-end very good to excellent',
    },
    {
      score: 4,
      name: 'VG/Ex',
      maxCenteringDeviationFront: 30,  // 80/20 front
      maxCenteringDeviationBack: 50,   // 100/0 or better
      description: 'Very good to excellent',
    },
    {
      score: 3.5,
      name: 'Very Good+',
      maxCenteringDeviationFront: 32.5,  // Interpolated
      maxCenteringDeviationBack: 50,
      description: 'High-end very good',
    },
    {
      score: 3,
      name: 'Very Good',
      maxCenteringDeviationFront: 35,  // 85/15 front
      maxCenteringDeviationBack: 50,   // 100/0 back
      description: 'Very good condition',
    },
    {
      score: 2.5,
      name: 'Good+',
      maxCenteringDeviationFront: 37.5,  // Interpolated
      maxCenteringDeviationBack: 50,
      description: 'High-end good',
    },
    {
      score: 2,
      name: 'Good',
      maxCenteringDeviationFront: 40,  // 90/10 front
      maxCenteringDeviationBack: 50,   // 100/0 or off-cut back
      description: 'Good condition',
    },
    {
      score: 1.5,
      name: 'Fair',
      maxCenteringDeviationFront: 45,  // Interpolated
      maxCenteringDeviationBack: 50,
      description: 'Fair condition',
    },
    {
      score: 1,
      name: 'Poor',
      maxCenteringDeviationFront: 50,  // 100/0 or off-cut
      maxCenteringDeviationBack: 50,
      description: 'Poor condition',
    },
  ],
};

export const CGC_STANDARD: GradingStandard = {
  company: 'CGC',
  grades: [
    {
      score: 10,
      name: 'Pristine',
      maxCenteringDeviationFront: 0,   // 50/50 perfect
      maxCenteringDeviationBack: 0,    // 50/50 perfect
      description: 'Virtually flawless under 10x magnification',
      isPristine: true,
    },
    {
      score: 10,
      name: 'Gem Mint',
      maxCenteringDeviationFront: 5,   // 55/45 or better
      maxCenteringDeviationBack: 25,   // 75/25 or better
      description: 'Perfect or near-perfect card',
      isPristine: false,
    },
    {
      score: 9.5,
      name: 'Mint+',
      maxCenteringDeviationFront: 7,   // Slightly less than Gem Mint
      maxCenteringDeviationBack: 30,
      description: 'Outstanding card with minimal wear',
    },
    {
      score: 9,
      name: 'Mint',
      maxCenteringDeviationFront: 10,  // 60/40 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'High quality card with slight imperfections',
    },
    {
      score: 8.5,
      name: 'NM/Mint+',
      maxCenteringDeviationFront: 12,  // Interpolated
      maxCenteringDeviationBack: 40,
      description: 'High-end near mint to mint',
    },
    {
      score: 8,
      name: 'NM/Mint',
      maxCenteringDeviationFront: 15,  // 65/35 or better
      maxCenteringDeviationBack: 40,
      description: 'Near mint to mint condition',
    },
    {
      score: 7.5,
      name: 'Near Mint+',
      maxCenteringDeviationFront: 15,  // 65/35 allowed
      maxCenteringDeviationBack: 40,
      description: 'High-end near mint',
    },
    {
      score: 7,
      name: 'Near Mint',
      maxCenteringDeviationFront: 20,  // 70/30 or better
      maxCenteringDeviationBack: 40,
      description: 'Near mint with touch of wear',
    },
    {
      score: 6.5,
      name: 'Ex/NM+',
      maxCenteringDeviationFront: 22,  // Interpolated
      maxCenteringDeviationBack: 40,
      description: 'High-end excellent to near mint',
    },
    {
      score: 6,
      name: 'Ex/NM',
      maxCenteringDeviationFront: 25,  // 75/25 or better
      maxCenteringDeviationBack: 40,
      description: 'Excellent to near mint',
    },
    {
      score: 5.5,
      name: 'Excellent+',
      maxCenteringDeviationFront: 27.5,  // Interpolated
      maxCenteringDeviationBack: 42.5,   // Interpolated
      description: 'High-end excellent',
    },
    {
      score: 5,
      name: 'Excellent',
      maxCenteringDeviationFront: 30,  // Interpolated
      maxCenteringDeviationBack: 45,
      description: 'Excellent condition',
    },
    {
      score: 4.5,
      name: 'VG/Ex+',
      maxCenteringDeviationFront: 32.5,  // Interpolated
      maxCenteringDeviationBack: 45,
      description: 'High-end very good to excellent',
    },
    {
      score: 4,
      name: 'VG/Ex',
      maxCenteringDeviationFront: 35,  // 85/15
      maxCenteringDeviationBack: 45,
      description: 'Very good to excellent',
    },
    {
      score: 3.5,
      name: 'Very Good+',
      maxCenteringDeviationFront: 37.5,  // Interpolated
      maxCenteringDeviationBack: 47.5,   // Interpolated
      description: 'High-end very good',
    },
    {
      score: 3,
      name: 'Very Good',
      maxCenteringDeviationFront: 40,
      maxCenteringDeviationBack: 50,
      description: 'Very good condition',
    },
    {
      score: 2.5,
      name: 'Good+',
      maxCenteringDeviationFront: 42.5,  // Interpolated
      maxCenteringDeviationBack: 50,
      description: 'High-end good',
    },
    {
      score: 2,
      name: 'Good',
      maxCenteringDeviationFront: 45,
      maxCenteringDeviationBack: 50,
      description: 'Good condition',
    },
    {
      score: 1.5,
      name: 'Fair',
      maxCenteringDeviationFront: 48,
      maxCenteringDeviationBack: 50,
      description: 'Fair condition with major defects',
    },
    {
      score: 1,
      name: 'Poor',
      maxCenteringDeviationFront: 50,
      maxCenteringDeviationBack: 50,
      description: 'Poor condition with severe damage',
    },
  ],
};

export const GRADING_STANDARDS: Record<string, GradingStandard> = {
  PSA: PSA_STANDARD,
  BGS: BGS_STANDARD,
  CGC: CGC_STANDARD,
};
