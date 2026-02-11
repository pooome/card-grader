# Feature Branch: Draggable Notch Arrows + Grading Standards Update

## Branch Overview
This feature branch (`feature/draggable-notch-arrows`) includes multiple UI/UX improvements and a comprehensive update to grading standards:

1. **Layout Restructuring** - Panned image visible behind transparent UI
2. **Draggable Notch Improvements** - Directional arrows and staggered positions
3. **Independent Zoom Controls** - Rotation preserved when resetting zoom
4. **Grading Standards Update** - Official sources with asymmetric centering support

---

## Commit 1: Restructure Layout (857c6f1)

### Changes
- Positioned `ZoomableImage` absolutely to fill entire screen below header
- Created UI overlay container with transparent background for grades and centering display
- Made `MultiCompanyGrades` and `CenteringDisplay` backgrounds transparent
- Grouped all UI elements (grades, centering, zoom controls, toggles) in single overlay
- Updated header height constant and spacing

### Benefit
The panned/zoomed image is now visible through transparent areas of the UI components, allowing better analysis workflow without UI elements blocking the card view.

### Files Modified
- `app/analysis.tsx` - Major layout restructuring
- `components/AnalysisHeader.tsx` - Header height updates
- `components/CenteringDisplay.tsx` - Transparent background
- `components/MultiCompanyGrades.tsx` - Transparent background

---

## Commit 2: Draggable Notch Enhancements (c0e1a9e)

### Changes
- Added arrow icons to each notch indicating drag direction (inward for inner borders, outward for outer borders)
- Staggered notch positions by 50px to prevent overlap between inner/outer notches on same side
- Increased notch length from 10px to 15px for better visibility
- Extracted arrow creation into reusable `createArrowPath` function
- Used chevron-style arrows with visual centering adjustment
- Standardized notch `strokeWidth` to constant value

### Benefit
Improves usability by making it clear which direction each border can be adjusted and prevents accidental interaction with overlapping handles.

### Files Modified
- `components/DraggableLines.tsx` - Added arrow rendering and staggered positioning

---

## Commit 3: Independent Zoom Reset (3f1cce5)

### Changes
- Removed rotation reset from `handleZoomReset` in analysis.tsx
- Removed `rotateX/Y/Z` props from `ZoomControls` component and interface
- Removed rotation reset from `ZoomableImage.resetZoom()` method
- Updated `hasTransformations` check to exclude rotation values

### Benefit
The reset button now only resets zoom level and pan position, preserving 3D rotation/tilt adjustments made via the advanced rotation controls. This allows users to maintain their desired viewing angle while resetting the zoom.

### Files Modified
- `app/analysis.tsx` - Removed rotation reset logic
- `components/ZoomControls.tsx` - Simplified interface
- `components/ZoomableImage.tsx` - Removed rotation from reset

---

## Commit 4: Grading Standards Update (1812d23)

### Overview
Updated all grading standards (PSA, BGS, CGC) to match official sources exactly. Removed interpolated half-point grades that were not officially documented and added support for asymmetric centering requirements.

## Changes Made

### 1. PSA Grading Standards
**Source:** https://www.psacard.com/gradingstandards

**Official Grades (11 total):**
- PSA 10 (Gem Mint) - 55/45 front, 75/25 back
- PSA 9 (Mint) - 60/40 front, 90/10 back
- PSA 8 (NM-MT) - 65/35 front, 90/10 back
- PSA 7 (Near Mint) - 70/30 front, 90/10 back
- PSA 6 (EX-MT) - 80/20 front, 90/10 back
- PSA 5 (Excellent) - 85/15 front, 90/10 back
- PSA 4 (VG-EX) - 85/15 front, 90/10 back
- PSA 3 (Very Good) - 90/10 front, 90/10 back
- PSA 2 (Good) - 90/10 front, 90/10 back
- PSA 1.5 (Fair) - 90/10 front, 90/10 back
- PSA 1 (Poor) - No official centering requirement

**Removed:** All half-point grades (9.5, 8.5, 7.5, 6.5, 5.5, 4.5, 3.5, 2.5) - not officially documented by PSA

### 2. BGS (Beckett) Grading Standards
**Source:** https://www.beckett.com/grading/scale

**Official Grades (11 total):**
- Pristine 10 - 50/50 perfect (1% deviation allowed for practicality)
- Gem Mint 9.5 - **50/50 one way + 55/45 other** front, 60/40 back
- Mint 9 - 55/45 both ways front, 70/30 back
- NM/Mint 8 - 60/40 both ways front, 80/20 back
- Near Mint 7 - 65/35 both ways front, 90/10 back
- Excellent/Mint 6 - 70/30 both ways front, 95/5 back
- Excellent 5 - 75/25 both ways front, 95/5 back
- VG/Ex 4 - 80/20 both ways front, 100/0 back
- Very Good 3 - 85/15 both ways front, 100/0 back
- Good 2 - 90/10 both ways front, 100/0 or offcut back
- Poor 1 - 100/0 or offcut front/back

**Removed:** All half-point grades except 9.5, second Gem Mint 10 entry

### 3. CGC Cards Grading Standards
**Source:** Heritage Auctions TCG Grading Guide (CGC Cards website unavailable)

**Official Grades (11 total):**
- Same structure as BGS with identical centering requirements
- Pristine 10 - 50/50 perfect (1% deviation)
- Gem Mint 9.5 - **50/50 one way + 55/45 other** front, 60/40 back
- [Grades 9 through 1 follow BGS structure]

**Removed:** All half-point grades except 9.5, second Gem Mint 10 entry

## Technical Implementation

### Type Changes (`types/grading.ts`)
Added `minCenteringDeviationFront` field to support asymmetric centering:
```typescript
export interface GradeThreshold {
  score: number;
  name: string;
  maxCenteringDeviationFront: number;
  minCenteringDeviationFront?: number; // For BGS/CGC 9.5: one direction <= min, other <= max
  maxCenteringDeviationBack: number;   // Always symmetric
  description: string;
  isPristine?: boolean;
}
```

### Grading Logic (`utils/grading.ts`)
Updated to handle asymmetric centering requirements:
- When `minCenteringDeviationFront` is present (9.5 grades): ONE direction must be ≤ min AND OTHER direction must be ≤ max
- Otherwise: BOTH directions must be ≤ max (existing behavior)
- Only applies to front side - back centering is always symmetric

### Pristine 10 Adjustment
Changed from 0% deviation to 1% deviation (49/51 to 51/49) for practicality:
- 0% would require mathematically perfect 50.000/50.000 centering
- 1% allows for realistic measurement tolerances while maintaining "perfect" standard

## Validation
All centering values verified against official sources:
- `.firecrawl/psa-grading-standards.md` - PSA official standards
- `.firecrawl/bgs-grading-scale.md` - BGS official standards
- `.firecrawl/heritage-tcg-grading.md` - CGC Cards standards (via Heritage Auctions)

### Example: BGS/CGC 9.5 Centering
A card with:
- Horizontal: 51/49 (1% deviation)
- Vertical: 54/46 (4% deviation)

Will correctly qualify for 9.5 because:
- One direction (1%) ≤ min (1%) ✓
- Other direction (4%) ≤ max (5%) ✓

This accurately implements "50/50 one way, 55/45 the other" requirement.

### Files Modified
- `constants/gradingStandards.ts` - Updated all three grading standards
- `types/grading.ts` - Added `minCenteringDeviationFront` field
- `utils/grading.ts` - Updated grading logic for asymmetric centering
- `.gitignore` - Added `.firecrawl/` directory
- `CLAUDE.md` - Documentation (this file)

---

## Feature Branch Summary

### Total Changes
**4 commits** with improvements spanning UI/UX, controls, and grading accuracy:

1. ✅ **Layout** - Transparent UI overlay for better image visibility
2. ✅ **Notches** - Directional arrows and staggered positioning
3. ✅ **Controls** - Independent zoom reset preserving rotation
4. ✅ **Grading** - Official standards with asymmetric centering

### Files Modified Across Branch
- `app/analysis.tsx`
- `components/AnalysisHeader.tsx`
- `components/CenteringDisplay.tsx`
- `components/MultiCompanyGrades.tsx`
- `components/DraggableLines.tsx`
- `components/ZoomControls.tsx`
- `components/ZoomableImage.tsx`
- `constants/gradingStandards.ts`
- `types/grading.ts`
- `utils/grading.ts`
- `.gitignore`

### Impact
These changes significantly improve the card analysis workflow:
- **Better visibility** of card details during analysis
- **Clearer controls** for border adjustment
- **More flexible** zoom/rotation manipulation
- **More accurate** grading based on official standards

### Testing Recommendations
1. Test transparent UI overlay with zoomed/panned images
2. Verify draggable notch arrows point correct directions
3. Confirm zoom reset preserves rotation angles
4. Test grading with symmetric centering (most grades)
5. Test grading with asymmetric centering (9.5 grades specifically)
6. Verify all three grading companies (PSA, BGS, CGC) work correctly
