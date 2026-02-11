# Phase 3 Implementation Status

**Date:** February 10, 2026
**Branch:** `feature/phase1-dummy-overlay-visualization`
**Status:** ⚠️ Implemented but NOT working as expected

---

## What We Implemented

### 1. Multi-Stage Adaptive Detection Pipeline

**Goal:** Improve detection accuracy from 10-20% to 60-80% success rate

**Changes Made:**

#### Stricter Constants
```typescript
// Before (Phase 2):
MIN_AREA_RATIO = 0.015 (1.5%)
MAX_AREA_RATIO = 0.9 (90%)
ASPECT_RATIO_TOLERANCE = 0.30 (±30%)

// After (Phase 3):
MIN_AREA_RATIO = 0.05 (5%)
MAX_AREA_RATIO = 0.40 (40%)
ASPECT_RATIO_TOLERANCE = 0.15 (±15%)
```

#### New Helper Functions

1. **`adaptivePreprocess()`**
   - Applies adaptive thresholding (Gaussian, block size 11, C=2)
   - Morphological closing (3×3 kernel) to connect broken edges
   - Goal: Handle varied lighting conditions

2. **`validateCandidate()`**
   - Comprehensive validation with 5 checks:
     - Area: 5-40% of frame
     - Aspect ratio: 1.19-1.61 (TCG card standard 1.4 ±15%)
     - Side parallelism: Opposite sides within 30% length
     - Corner angles: All angles 45-135°
     - Composite scoring (0-1 scale)

3. **`calculateCornerAngles()`**
   - Computes interior angles using dot product
   - Validates quadrilateral has reasonable corners

4. **`calculateAngleScore()`**
   - Scores how close angles are to 90° (ideal rectangle)

#### Redesigned `detectCard()` Function

**4-Stage Pipeline:**

1. **Stage 1: Adaptive Preprocessing**
   - Grayscale conversion
   - Adaptive thresholding
   - Morphological operations
   - Gaussian blur

2. **Stage 2: Multi-Pass Edge Detection**
   - Try 3 Canny threshold configurations:
     - Conservative (50, 150): High contrast
     - Moderate (30, 100): Normal conditions
     - Aggressive (20, 80): Low contrast
   - Early stopping if high-quality candidate found (score > 0.8)

3. **Stage 3: Candidate Validation**
   - Filter by area (5-40%)
   - Approximate to quadrilaterals only
   - Validate with strict geometric checks
   - Only accept score > 0.5

4. **Stage 4: Multi-Candidate Scoring**
   - Collect ALL valid candidates
   - Sort by composite score
   - Return best candidate

#### Enhanced Logging

Added detailed logging for debugging:
- Edge detection pass results
- Candidate scores and validation reasons
- Coordinate transformations (resized → normalized)
- Frame vs screen dimensions
- Aspect ratio comparisons

---

## What We Found (Issues)

### Issue 1: Detection Still Not Working Reliably

**Symptom:** Card detection is not appearing or very inconsistent

**Possible Causes:**
1. **Too strict constraints** - 5-40% area + 1.19-1.61 aspect ratio may be filtering out valid cards
2. **Adaptive preprocessing too aggressive** - May be destroying edges instead of enhancing them
3. **Score threshold too high** - Requiring score > 0.5 might be rejecting good candidates
4. **Multi-pass not helping** - May need different Canny thresholds for real-world conditions

### Issue 2: Coordinate Transformation Uncertainty

**Concern:** Cyan overlay may not align with card corners due to aspect ratio mismatch

**The Problem:**
- Camera frame: e.g., 1920×1440 (aspect 1.33)
- iPhone screen: 393×852 (aspect 2.17)
- VisionCamera uses 'cover' mode (crops frame to fit screen)
- Current normalization: `normalized = (corner * scale) / frameSize`
- This assumes full frame is visible, but cover mode crops it!

**Expected Behavior:**
- Point at (0.5, 0.5) in camera frame = screen center
- But if frame is cropped, (0.5, 0.5) may NOT be at screen center

**Not Yet Verified:**
- Need logs showing frame dimensions vs screen dimensions
- Need to test if overlay aligns with card corners
- May need to implement crop region correction

### Issue 3: Unable to Monitor Logs Effectively

**Problem:** Difficult to capture console logs from physical iPhone device

**Attempts Made:**
1. `xcrun devicectl device info logs` - No output
2. `log stream --device` - Process completed but no logs
3. Metro bundler tail - Couldn't capture console.log output

**Current Workaround:**
- User must use Console.app manually
- Or observe behavior visually without logs

---

## What Still Needs to Be Fixed

### Priority 1: Verify Basic Detection Works

**Tasks:**
- [ ] Check if ANY detection is happening at all
- [ ] Review logs to see which stage is failing:
  - Are contours being found? (Stage 2)
  - Are candidates being validated? (Stage 3)
  - Are scores too low? (Stage 4)
- [ ] Test with Phase 2 settings to see if Phase 3 made it worse

**Debug Strategy:**
1. Temporarily revert to Phase 2 constants (loose constraints)
2. Add more logging to see validation rejection reasons
3. Lower score threshold from 0.5 to 0.3
4. Try single-pass detection (remove multi-pass complexity)

### Priority 2: Fix Coordinate Transformation

**Tasks:**
- [ ] Capture actual frame dimensions from iPhone
- [ ] Capture actual screen dimensions
- [ ] Compare aspect ratios
- [ ] If different, implement crop region correction:

```typescript
const frameAspect = frameWidth / frameHeight;
const screenAspect = screenWidth / screenHeight;

if (frameAspect > screenAspect) {
  // Frame is wider - crops left/right
  const visibleWidth = frameHeight * screenAspect;
  const cropOffset = (frameWidth - visibleWidth) / 2;
  normalized_x = (scaled_x - cropOffset) / visibleWidth;
} else {
  // Frame is taller - crops top/bottom
  const visibleHeight = frameWidth / screenAspect;
  const cropOffset = (frameHeight - visibleHeight) / 2;
  normalized_y = (scaled_y - cropOffset) / visibleHeight;
}
```

### Priority 3: Tune Detection Parameters

**If detection works but poorly:**

**Adjust Constants:**
- [ ] Relax area constraints: 3-50% instead of 5-40%
- [ ] Relax aspect ratio: ±20% instead of ±15%
- [ ] Lower score threshold: 0.3 instead of 0.5
- [ ] Adjust Canny thresholds based on testing

**Adjust Scoring Weights:**
```typescript
// Current weights:
areaScore * 0.3
aspectScore * 0.4
parallelScore * 0.2
angleScore * 0.1

// Consider increasing area weight (most important):
areaScore * 0.4
aspectScore * 0.3
parallelScore * 0.2
angleScore * 0.1
```

**Simplify Pipeline:**
- [ ] Remove adaptive preprocessing (may be hurting)
- [ ] Remove multi-pass (may be slow without benefit)
- [ ] Keep only validation + scoring

### Priority 4: Improve Logging

**Tasks:**
- [ ] Add validation rejection reasons to logs:
  ```typescript
  if (!validation.valid) {
    console.log(`[detectCard] Rejected: ${validation.reason}`);
  }
  ```
- [ ] Count rejections by reason:
  ```typescript
  // Track: "Too small: 45", "Bad aspect: 23", "Non-parallel: 12"
  ```
- [ ] Log histogram of candidate scores:
  ```typescript
  console.log(`[detectCard] Score distribution: ${scoreHistogram}`);
  ```

---

## Testing Checklist

### Basic Functionality
- [ ] App builds without errors ✅ (confirmed)
- [ ] App runs on iPhone ✅ (confirmed)
- [ ] Camera view loads
- [ ] Frame processor runs without crashes
- [ ] Console logs appear (needs Console.app)

### Detection Testing
- [ ] Point at card in good lighting
- [ ] Point at card in dim lighting
- [ ] Point at card at various distances
- [ ] Point at card at various angles
- [ ] Point at non-card objects (should reject)

### Coordinate Testing
- [ ] Cyan overlay appears
- [ ] Top-left corner aligns with card top-left
- [ ] Top-right corner aligns with card top-right
- [ ] Bottom-right corner aligns with card bottom-right
- [ ] Bottom-left corner aligns with card bottom-left
- [ ] Check for offset/shift in any direction

### Performance Testing
- [ ] Camera maintains 30 FPS
- [ ] No lag or stuttering
- [ ] Detection latency < 1 second
- [ ] Overlay doesn't flicker excessively

---

## Known Working Configuration (Phase 2)

For reference, Phase 2 settings that worked intermittently:

```typescript
// Phase 2 - Very loose constraints
MIN_AREA_RATIO = 0.015 (1.5%)
MAX_AREA_RATIO = 0.9 (90%)
ASPECT_RATIO_TOLERANCE = 0.30 (±30%)
// Aspect ratio check DISABLED
// Single-pass Canny (10, 50)
// No adaptive preprocessing
// No validation beyond area
// Simple largest-area selection
```

**Success Rate:** 10-20% of frames
**Detection Time:** 1-2 seconds

---

## Rollback Plan

If Phase 3 proves worse than Phase 2:

```bash
git checkout feature/phase1-dummy-overlay-visualization
git revert HEAD  # Revert Phase 3 commit
```

Then try incremental improvements:
1. Keep Phase 2 detection logic
2. Add ONLY aspect ratio validation (±20%)
3. Add ONLY area tightening (2-60%)
4. Test each change independently

---

## Next Steps

1. **Immediate:** Get logs working
   - Use Console.app on Mac
   - Filter for `detectCard`
   - Point camera at card
   - Share log output

2. **Debug detection:**
   - Check if contours are found
   - Check if candidates pass validation
   - Check candidate scores
   - Identify which stage fails

3. **Fix based on logs:**
   - If no contours: Adjust preprocessing
   - If candidates rejected: Relax constraints
   - If scores too low: Adjust scoring weights
   - If coordinates wrong: Fix transformation

4. **Iterate:**
   - Make ONE change at a time
   - Test thoroughly
   - Compare to baseline

---

## Files Modified

### `utils/cardDetectionProcessor.ts`
- Lines 12-20: Updated constants
- Lines 70-204: Added helper functions (validateCandidate, calculateCornerAngles, calculateAngleScore, adaptivePreprocess)
- Lines 206-298: Redesigned detectCard() with 4-stage pipeline
- Total additions: ~250 lines

### `app/camera-vision.tsx`
- Lines 37-45: Added coordinate logging to updateDetectedCorners
- Line 69: Pass frame dimensions to logging function
- Total additions: ~10 lines

### New Documentation Files
- `PHASE3_IMPLEMENTATION_SUMMARY.md` - Complete implementation guide
- `verify_coordinates.js` - Coordinate transformation verification script
- `PHASE3_STATUS.md` - This file

---

## Conclusion

**Phase 3 implementation is complete but NOT functional.**

The multi-stage adaptive detection pipeline is theoretically sound but may be:
- Too strict (filtering out valid cards)
- Too complex (introducing bugs)
- Wrong for our specific use case (different lighting/cards than expected)

**Recommendation:** Get logs working first, then debug systematically to identify which stage is failing. Consider reverting to Phase 2 + incremental improvements if Phase 3 proves worse.
