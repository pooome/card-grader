import { GradingStandard } from '../types/grading';

export const PSA_STANDARD: GradingStandard = {
  company: 'PSA',
  grades: [
    {
      score: 10,
      name: 'Gem Mint',
      maxCenteringDeviationFront: 5,  // 55/45 or better
      maxCenteringDeviationBack: 25,  // 75/25 or better
      description: 'Virtually perfect card. Four perfectly sharp corners, sharp focus and full original gloss',
    },
    {
      score: 9,
      name: 'Mint',
      maxCenteringDeviationFront: 10,  // 60/40 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Superb condition card with only minor flaws: slight wax stain, minor printing imperfection, or slightly off-white borders',
    },
    {
      score: 8,
      name: 'NM-MT',
      maxCenteringDeviationFront: 15,  // 65/35 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Super high-end card that appears Mint 9 at first glance. May have slight wax stain, slightest fraying at corners, or slightly off-white borders',
    },
    {
      score: 7,
      name: 'Near Mint',
      maxCenteringDeviationFront: 20,  // 70/30 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Slight surface wear visible upon close inspection. May have slight corner fraying or minor printing blemish. Most original gloss retained',
    },
    {
      score: 6,
      name: 'EX-MT',
      maxCenteringDeviationFront: 30,  // 80/20 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Visible surface wear or printing defect that does not detract from overall appeal. May have light scratches, corner fraying, or slight notching',
    },
    {
      score: 5,
      name: 'Excellent',
      maxCenteringDeviationFront: 35,  // 85/15 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Very minor corner rounding becoming evident. Surface wear or printing defects more visible. May have minor edge chipping or light scratches',
    },
    {
      score: 4,
      name: 'VG-EX',
      maxCenteringDeviationFront: 35,  // 85/15 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Slightly rounded corners. Surface wear noticeable but modest. May have light scuffing or scratches. Some original gloss retained. Light crease possible',
    },
    {
      score: 3,
      name: 'Very Good',
      maxCenteringDeviationFront: 40,  // 90/10 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Some corner rounding, though not extreme. Surface wear apparent with possible scuffing or scratches. May have visible crease or discolored borders',
    },
    {
      score: 2,
      name: 'Good',
      maxCenteringDeviationFront: 40,  // 90/10 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Accelerated corner rounding. Surface wear obvious with scratching, scuffing, or staining. May have several creases. Original gloss may be absent',
    },
    {
      score: 1.5,
      name: 'Fair',
      maxCenteringDeviationFront: 40,  // 90/10 or better
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Extreme corner wear. Advanced stages of wear including scuffing, scratching, pitting, and staining. May have heavy creases. Must be fully intact',
    },
    {
      score: 1,
      name: 'Poor',
      maxCenteringDeviationFront: 50,  // Any centering (no official requirement stated)
      maxCenteringDeviationBack: 50,
      description: 'Defects so serious that eye appeal has nearly vanished. May be missing small pieces, have major creasing, or extreme discoloration making identification difficult',
    },
  ],
};

export const BGS_STANDARD: GradingStandard = {
  company: 'BGS',
  grades: [
    {
      score: 10,
      name: 'Pristine',
      maxCenteringDeviationFront: 1,   // 50/50 perfect (allowing 49/51 to 51/49)
      maxCenteringDeviationBack: 10,   // 60/40 or better
      description: 'Perfect centering. Corners perfect to naked eye and mint under magnification. Edges perfect with virtually no flaws. Flawless surface with perfect gloss',
      isPristine: true,
    },
    {
      score: 9.5,
      name: 'Gem Mint',
      minCenteringDeviationFront: 1,   // 50/50 one way (49/51 to 51/49)
      maxCenteringDeviationFront: 5,   // 55/45 the other way
      maxCenteringDeviationBack: 10,   // 60/40 or better
      description: 'Mint to naked eye with slight imperfections under magnification. Virtually mint edges. Few extremely minor print spots under intense scrutiny. Perfect gloss',
    },
    {
      score: 9,
      name: 'Mint',
      maxCenteringDeviationFront: 5,   // 55/45 both ways
      maxCenteringDeviationBack: 20,   // 70/30 or better
      description: 'Mint on close inspection with speck of wear under intense scrutiny. Virtually mint edges. Handful of printing specks or one minor spot. Clean gloss with tiny scratches',
    },
    {
      score: 8,
      name: 'NM/Mint',
      maxCenteringDeviationFront: 10,  // 60/40 both ways
      maxCenteringDeviationBack: 30,   // 80/20 or better
      description: 'Sharp corners with slight imperfections under close examination. Relatively smooth borders. Few minor print spots. Solid gloss with very minor scratches',
    },
    {
      score: 7,
      name: 'Near Mint',
      maxCenteringDeviationFront: 15,  // 65/35 both ways
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Very minor wear on 2-3 corners. Slight roughness or minor chipping. Few noticeable print spots. Solid gloss with minor scratches. Very slight diamond cutting allowed',
    },
    {
      score: 6,
      name: 'Excellent/Mint',
      maxCenteringDeviationFront: 20,  // 70/30 both ways
      maxCenteringDeviationBack: 45,   // 95/5 or better
      description: 'Fuzzy corners but free of dings and fraying. Moderate roughness or chipping. Noticeable print spots. Relatively solid gloss with minor scratches. Slight diamond cutting allowed',
    },
    {
      score: 5,
      name: 'Excellent',
      maxCenteringDeviationFront: 25,  // 75/25 both ways
      maxCenteringDeviationBack: 45,   // 95/5 or better
      description: 'Four fuzzy corners with touch of notching or minor ding. Noticeable roughness but no layering. Some gloss lost from surface. Slight diamond cutting allowed',
    },
    {
      score: 4,
      name: 'VG/Ex',
      maxCenteringDeviationFront: 30,  // 80/20 both ways
      maxCenteringDeviationBack: 50,   // 100/0 or better
      description: 'Slight notching or layering, or moderate dings. Readily chipped or notched edges. Hairline creases possible. Good deal of gloss lost. Moderate diamond cutting allowed',
    },
    {
      score: 3,
      name: 'Very Good',
      maxCenteringDeviationFront: 35,  // 85/15 both ways
      maxCenteringDeviationBack: 50,   // 100/0 or better
      description: 'Slightly rounded or noticeably notched corners with slight layering. Heavy notching or moderate layering. Very minor creases. Very little surface gloss. Moderate diamond cutting allowed',
    },
    {
      score: 2,
      name: 'Good',
      maxCenteringDeviationFront: 40,  // 90/10 both ways
      maxCenteringDeviationBack: 50,   // 100/0 or offcut
      description: 'Noticeably rounded or heavily notched corners with moderate layering. Severely chipped or notched edges. Noticeable creases. Surface devoid of gloss. Noticeable diamond cutting allowed',
    },
    {
      score: 1,
      name: 'Poor',
      maxCenteringDeviationFront: 50,  // 100/0 or offcut
      maxCenteringDeviationBack: 50,   // 100/0 or offcut
      description: 'Heavily rounded or heavily notched with noticeable layering. Destructive chipping or notching. Heavy creases. Severe color imperfections. No original gloss. Heavy diamond cutting allowed',
    },
  ],
};

export const CGC_STANDARD: GradingStandard = {
  company: 'CGC',
  grades: [
    {
      score: 10,
      name: 'Pristine',
      maxCenteringDeviationFront: 1,   // 50/50 perfect (allowing 49/51 to 51/49)
      maxCenteringDeviationBack: 10,   // 60/40 or better
      description: 'Perfect centering with no evidence of any manufacturing or handling defects. Corners perfect to naked eye and gem mint under 10x magnification. Flawless surface with perfect gloss',
      isPristine: true,
    },
    {
      score: 9.5,
      name: 'Gem Mint',
      minCenteringDeviationFront: 1,   // 50/50 one way (49/51 to 51/49)
      maxCenteringDeviationFront: 5,   // 55/45 the other way
      maxCenteringDeviationBack: 10,   // 60/40 or better
      description: 'Mint to naked eye with slight imperfections under magnification. Virtually mint edges. Few extremely minor print spots. Deep color with perfect gloss',
    },
    {
      score: 9,
      name: 'Mint',
      maxCenteringDeviationFront: 5,   // 55/45 both ways
      maxCenteringDeviationBack: 20,   // 70/30 or better
      description: 'At least above-average centering. Mint on close inspection. Virtually mint edges with unobtrusive specks of chipping. Handful of printing specks. Clean gloss with tiny scratches',
    },
    {
      score: 8,
      name: 'NM/Mint',
      maxCenteringDeviationFront: 10,  // 60/40 both ways
      maxCenteringDeviationBack: 30,   // 80/20 or better
      description: 'At least average centering. Sharp corners with slight imperfections. Relatively smooth borders. Few minor print spots. Solid gloss with very minor scratches',
    },
    {
      score: 7,
      name: 'Near Mint',
      maxCenteringDeviationFront: 15,  // 65/35 both ways
      maxCenteringDeviationBack: 40,   // 90/10 or better
      description: 'Very minor wear on 2-3 corners. Slight roughness or minor chipping. Few noticeable print spots. Solid gloss with minor scratches. Very slight diamond cutting allowed',
    },
    {
      score: 6,
      name: 'Ex/NM',
      maxCenteringDeviationFront: 20,  // 70/30 both ways
      maxCenteringDeviationBack: 45,   // 95/5 or better
      description: 'Fuzzy corners but free of dings and fraying. Moderate roughness or chipping. Noticeable print spots. Relatively solid gloss with minor scratches. Slight diamond cutting allowed',
    },
    {
      score: 5,
      name: 'Excellent',
      maxCenteringDeviationFront: 25,  // 75/25 both ways
      maxCenteringDeviationBack: 45,   // 95/5 or better
      description: 'Four fuzzy corners with touch of notching or minor ding. Noticeable roughness but no layering. Some gloss lost from surface. Slight diamond cutting allowed',
    },
    {
      score: 4,
      name: 'VG/Ex',
      maxCenteringDeviationFront: 30,  // 80/20 both ways
      maxCenteringDeviationBack: 50,   // 100/0 or better
      description: 'Slight notching or layering, or moderate dings. Readily chipped or notched edges. Hairline creases. Good deal of gloss lost. Moderate diamond cutting allowed',
    },
    {
      score: 3,
      name: 'Very Good',
      maxCenteringDeviationFront: 35,  // 85/15 both ways
      maxCenteringDeviationBack: 50,   // 100/0 or better
      description: 'Slightly rounded or noticeably notched corners with slight layering. Heavy notching or moderate layering. Very minor creases. Very little surface gloss. Moderate diamond cutting allowed',
    },
    {
      score: 2,
      name: 'Good',
      maxCenteringDeviationFront: 40,  // 90/10 both ways
      maxCenteringDeviationBack: 50,   // 100/0 or offcut
      description: 'Noticeably rounded or heavily notched corners with moderate layering. Severely chipped or notched edges. Noticeable creases. Surface devoid of gloss. Noticeable diamond cutting allowed',
    },
    {
      score: 1,
      name: 'Poor',
      maxCenteringDeviationFront: 50,  // 100/0 or offcut
      maxCenteringDeviationBack: 50,   // 100/0 or offcut
      description: 'Heavily rounded or heavily notched with noticeable layering. Destructive chipping or notching. Heavy creases. Severe color imperfections. No original gloss. Heavy diamond cutting allowed',
    },
  ],
};

export const GRADING_STANDARDS: Record<string, GradingStandard> = {
  PSA: PSA_STANDARD,
  BGS: BGS_STANDARD,
  CGC: CGC_STANDARD,
};
