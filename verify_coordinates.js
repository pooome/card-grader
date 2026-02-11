/**
 * Coordinate Transformation Verification Script
 *
 * This script helps verify the math behind coordinate transformations
 * from detection space to screen space.
 *
 * Usage: node verify_coordinates.js
 */

// Example dimensions (update these with actual values from logs)
const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1440;
const SCREEN_WIDTH = 393;
const SCREEN_HEIGHT = 852;
const RESIZE_WIDTH = 480;
const RESIZE_HEIGHT = 640;

// Example detected corner in resized space
const detectedCorner = { x: 240, y: 320 };

console.log('='.repeat(60));
console.log('COORDINATE TRANSFORMATION VERIFICATION');
console.log('='.repeat(60));

console.log('\n1. INPUT DIMENSIONS');
console.log('-'.repeat(60));
console.log(`Camera frame: ${FRAME_WIDTH}×${FRAME_HEIGHT} (aspect: ${(FRAME_HEIGHT/FRAME_WIDTH).toFixed(3)})`);
console.log(`Screen: ${SCREEN_WIDTH}×${SCREEN_HEIGHT} (aspect: ${(SCREEN_HEIGHT/SCREEN_WIDTH).toFixed(3)})`);
console.log(`Detection resize: ${RESIZE_WIDTH}×${RESIZE_HEIGHT}`);
console.log(`\nDetected corner in resized space: (${detectedCorner.x}, ${detectedCorner.y})`);

console.log('\n2. TRANSFORMATION STEPS');
console.log('-'.repeat(60));

// Step 1: Scale from resized to original frame
const scaleX = FRAME_WIDTH / RESIZE_WIDTH;
const scaleY = FRAME_HEIGHT / RESIZE_HEIGHT;
console.log(`\nStep 1: Scale back to original frame`);
console.log(`  scaleX = ${FRAME_WIDTH} / ${RESIZE_WIDTH} = ${scaleX.toFixed(3)}`);
console.log(`  scaleY = ${FRAME_HEIGHT} / ${RESIZE_HEIGHT} = ${scaleY.toFixed(3)}`);

const scaledX = detectedCorner.x * scaleX;
const scaledY = detectedCorner.y * scaleY;
console.log(`  Scaled corner: (${scaledX.toFixed(0)}, ${scaledY.toFixed(0)})`);

// Step 2: Normalize to 0-1 range
console.log(`\nStep 2: Normalize to 0-1 range`);
const normalizedX = scaledX / FRAME_WIDTH;
const normalizedY = scaledY / FRAME_HEIGHT;
console.log(`  normalized_x = ${scaledX.toFixed(0)} / ${FRAME_WIDTH} = ${normalizedX.toFixed(3)}`);
console.log(`  normalized_y = ${scaledY.toFixed(0)} / ${FRAME_HEIGHT} = ${normalizedY.toFixed(3)}`);
console.log(`  Normalized corner: (${normalizedX.toFixed(3)}, ${normalizedY.toFixed(3)})`);

// Step 3: Render on screen (current implementation)
console.log(`\nStep 3: Render on screen (current implementation)`);
const screenX = normalizedX * SCREEN_WIDTH;
const screenY = normalizedY * SCREEN_HEIGHT;
console.log(`  screen_x = ${normalizedX.toFixed(3)} × ${SCREEN_WIDTH} = ${screenX.toFixed(1)}`);
console.log(`  screen_y = ${normalizedY.toFixed(3)} × ${SCREEN_HEIGHT} = ${screenY.toFixed(1)}`);
console.log(`  Screen corner: (${screenX.toFixed(1)}, ${screenY.toFixed(1)})`);

console.log('\n3. ASPECT RATIO ANALYSIS');
console.log('-'.repeat(60));

const frameAspect = FRAME_HEIGHT / FRAME_WIDTH;
const screenAspect = SCREEN_HEIGHT / SCREEN_WIDTH;
const aspectDiff = Math.abs(frameAspect - screenAspect);
const aspectDiffPercent = (aspectDiff / frameAspect) * 100;

console.log(`Frame aspect ratio: ${frameAspect.toFixed(3)} (${FRAME_WIDTH}:${FRAME_HEIGHT})`);
console.log(`Screen aspect ratio: ${screenAspect.toFixed(3)} (${SCREEN_WIDTH}:${SCREEN_HEIGHT})`);
console.log(`Difference: ${aspectDiff.toFixed(3)} (${aspectDiffPercent.toFixed(1)}%)`);

if (aspectDiffPercent < 5) {
  console.log('\n✅ Aspect ratios MATCH - coordinates should align correctly!');
} else {
  console.log('\n⚠️  Aspect ratios DIFFER - overlay may be misaligned!');
  console.log('   Camera preview is likely cropped to fit screen.');

  // Calculate crop dimensions
  console.log('\n4. CROP CORRECTION NEEDED');
  console.log('-'.repeat(60));

  if (frameAspect < screenAspect) {
    // Frame is wider than screen - horizontal crop
    console.log('Camera frame is WIDER than screen (landscape vs portrait)');
    console.log('Preview crops LEFT and RIGHT edges of frame');

    const visibleWidth = FRAME_HEIGHT / screenAspect;
    const cropLeft = (FRAME_WIDTH - visibleWidth) / 2;
    const cropRight = cropLeft;

    console.log(`\nVisible frame width: ${visibleWidth.toFixed(0)} pixels`);
    console.log(`Cropped from left: ${cropLeft.toFixed(0)} pixels`);
    console.log(`Cropped from right: ${cropRight.toFixed(0)} pixels`);

    // Corrected normalization
    const correctedX = (scaledX - cropLeft) / visibleWidth;
    const correctedScreenX = correctedX * SCREEN_WIDTH;

    console.log(`\nCorrected normalization:`);
    console.log(`  corrected_x = (${scaledX.toFixed(0)} - ${cropLeft.toFixed(0)}) / ${visibleWidth.toFixed(0)} = ${correctedX.toFixed(3)}`);
    console.log(`  corrected_screen_x = ${correctedX.toFixed(3)} × ${SCREEN_WIDTH} = ${correctedScreenX.toFixed(1)}`);
    console.log(`\nOffset: ${(screenX - correctedScreenX).toFixed(1)} pixels horizontally`);

  } else {
    // Frame is taller than screen - vertical crop
    console.log('Camera frame is TALLER than screen (portrait vs landscape)');
    console.log('Preview crops TOP and BOTTOM edges of frame');

    const visibleHeight = FRAME_WIDTH * screenAspect;
    const cropTop = (FRAME_HEIGHT - visibleHeight) / 2;
    const cropBottom = cropTop;

    console.log(`\nVisible frame height: ${visibleHeight.toFixed(0)} pixels`);
    console.log(`Cropped from top: ${cropTop.toFixed(0)} pixels`);
    console.log(`Cropped from bottom: ${cropBottom.toFixed(0)} pixels`);

    // Corrected normalization
    const correctedY = (scaledY - cropTop) / visibleHeight;
    const correctedScreenY = correctedY * SCREEN_HEIGHT;

    console.log(`\nCorrected normalization:`);
    console.log(`  corrected_y = (${scaledY.toFixed(0)} - ${cropTop.toFixed(0)}) / ${visibleHeight.toFixed(0)} = ${correctedY.toFixed(3)}`);
    console.log(`  corrected_screen_y = ${correctedY.toFixed(3)} × ${SCREEN_HEIGHT} = ${correctedScreenY.toFixed(1)}`);
    console.log(`\nOffset: ${(screenY - correctedScreenY).toFixed(1)} pixels vertically`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('TO USE THIS SCRIPT WITH YOUR ACTUAL VALUES:');
console.log('='.repeat(60));
console.log('1. Look at the logs for "[Camera] Frame dimensions: W×H"');
console.log('2. Look at the logs for "[Camera] Screen dimensions: W×H"');
console.log('3. Look at logs for "[detectCard] Candidate: resized=(X,Y)"');
console.log('4. Update the constants at the top of this file');
console.log('5. Run: node verify_coordinates.js');
console.log('='.repeat(60) + '\n');
