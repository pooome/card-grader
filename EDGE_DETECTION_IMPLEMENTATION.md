# Edge Detection Implementation Summary

## Overview
Successfully implemented real-time card edge detection using OpenCV and VisionCamera to automatically detect and position lines on card edges.

## Implementation Status: ✅ COMPLETE

### What Was Implemented

#### 1. Dependencies Installed
- `react-native-vision-camera@^4.7.2` - Modern camera library with frame processor support
- `react-native-fast-opencv@^0.4.6` - OpenCV bindings for React Native
- `react-native-worklets-core@^1.6.2` - Required for frame processors
- `react-native-reanimated@^3.17.3` - Shared values and runOnJS support
- `vision-camera-resize-plugin@^3.2.0` - Frame resizing for better performance

#### 2. Configuration Updates
- **`babel.config.js`**: Added worklets and reanimated plugins
- **`app.json`**: Added VisionCamera plugin with camera and microphone permissions
- **Native Build**: Successfully ran `expo prebuild` and `pod install` to link native modules

#### 3. Core Detection Logic (`utils/cardDetectionProcessor.ts`)
Implemented OpenCV-based card detection with:
- Real-time rectangle detection using contour analysis
- Canny edge detection for finding card edges
- Aspect ratio filtering (TCG cards: 1.4 ± 15% tolerance)
- Corner ordering and normalization (0-1 coordinate range)
- `CornerSmoother` class for reducing detection jitter (5-frame averaging)

#### 4. Camera Screen Migration (`app/camera.tsx`)
Migrated from `expo-camera` to `react-native-vision-camera`:
- Replaced `CameraView` with VisionCamera's `Camera` component
- Implemented `useFrameProcessor` hook for real-time detection (throttled to every 5th frame)
- Integrated detection state with capture button (gated by level + card detection)
- Pass detected corners to analysis screen via router params

#### 5. Camera Overlay Enhancement (`components/CameraOverlay.tsx`)
Added visual feedback for detected cards:
- Bright cyan polygon showing detected card outline
- Corner markers (circles) at each detected corner
- Maintains existing level indicators and guidance rectangle
- Dual overlay system: guide rectangle (white dashed) + detection overlay (cyan solid)

#### 6. Analysis Screen Integration (`app/analysis.tsx`)
Auto-positioning boundaries from detected corners:
- Parse `detectedCardCorners` from route params
- Use corners to initialize boundaries if available
- Fall back to manual estimation if no detection data
- Maintains full manual adjustment capability via DraggableLines

#### 7. Corner-to-Boundaries Converter (`utils/cornerToBoundaries.ts`)
Utility to convert normalized corner coordinates to BorderBoundaries:
- Converts normalized (0-1) coordinates to pixel coordinates
- Calculates outer boundaries from detected card edges
- Estimates inner boundaries (assumes ~3.5% border width)
- Returns both BorderBoundaries and CardDimensions

## How It Works

### Real-Time Detection Flow
1. **Camera Frame** → Frame processor (runs on worklet thread every 5 frames)
2. **OpenCV Processing** → Grayscale → Gaussian Blur → Canny Edge → Find Contours
3. **Filter Contours** → Check for quadrilaterals with correct aspect ratio
4. **Score & Select** → Pick best candidate based on area and aspect ratio match
5. **Smooth Corners** → Average over last 5 frames to reduce jitter
6. **Update UI** → runOnJS to update React state with detected corners
7. **Visual Feedback** → CameraOverlay renders cyan polygon on detected card

### Capture Flow
1. User positions card in camera view
2. Real-time detection highlights card with cyan outline
3. Capture button enables when: device is level (optional) AND card detected
4. On capture, photo path + detected corners passed to analysis screen
5. Analysis screen auto-positions boundaries using detected corners
6. User can fine-tune with DraggableLines if needed

## Technical Details

### Performance Optimizations
- **Frame Throttling**: Detection runs every 5 frames (~6 FPS on 30 FPS camera)
- **Corner Smoothing**: 5-frame averaging reduces jitter and false positives
- **Worklet Thread**: OpenCV processing on separate thread, doesn't block UI

### Detection Parameters
- **Target Aspect Ratio**: 1.4 (TCG card standard)
- **Tolerance**: ±15% (handles perspective distortion)
- **Min Area**: 10% of frame (card must be close enough)
- **Max Area**: 90% of frame (prevents full-screen false positives)

### Error Handling
- Graceful fallback if OpenCV not available
- Handles cases where no card is detected
- Falls back to manual estimation in analysis if no corners provided
- Console warnings for debugging

## Files Created/Modified

### New Files
- `utils/cardDetectionProcessor.ts` - Core OpenCV detection logic
- `utils/cornerToBoundaries.ts` - Coordinate conversion utility
- `EDGE_DETECTION_IMPLEMENTATION.md` - This document

### Modified Files
- `package.json` - Added dependencies
- `package-lock.json` - Locked dependency versions
- `babel.config.js` - Added worklets plugins
- `app.json` - Added VisionCamera plugin and permissions
- `app/camera.tsx` - Migrated to VisionCamera with detection
- `components/CameraOverlay.tsx` - Added detection visualization
- `app/analysis.tsx` - Added auto-positioning from corners

### Generated (by expo prebuild)
- `ios/` - Native iOS project with CocoaPods
- `android/` - Native Android project

## Testing Checklist

- [ ] Test camera permissions on first launch
- [ ] Test card detection with various backgrounds
- [ ] Test detection with different lighting conditions
- [ ] Test detection with card at various angles (perspective)
- [ ] Test capture and navigate to analysis
- [ ] Test auto-positioned boundaries in analysis screen
- [ ] Test manual adjustment of auto-positioned boundaries
- [ ] Test level indicator toggle still works
- [ ] Test fallback when no card detected (manual estimation)
- [ ] Test on both iOS and Android devices

## Next Steps

1. **Build and Test**: Run `npx expo run:ios` or `npx expo run:android` to build with native code
2. **Fine-tune Parameters**: Adjust detection thresholds based on real-world testing
3. **Performance Monitoring**: Check frame processing time on older devices
4. **User Feedback**: Add haptic feedback when card is first detected
5. **Edge Cases**: Handle multiple cards, partial cards, reflective surfaces

## Known Limitations

1. **Requires Good Lighting**: Detection accuracy depends on clear edges
2. **Flat Surface Preferred**: Curved or bent cards may not detect well
3. **Contrast Required**: Card must contrast with background
4. **Frame Rate**: Detection throttled to maintain 30 FPS camera preview

## Troubleshooting

### OpenCV Not Available
- Check that pod install completed successfully
- Verify FastOpenCV-iOS is in ios/Pods
- Check console for "OpenCV not available" warnings

### Frame Processor Not Running
- Verify babel config includes worklets plugin
- Check that frame processor has 'worklet' directive
- Ensure VisionCamera has frameProcessorFps enabled

### No Card Detected
- Increase area ratio tolerance in cardDetectionProcessor.ts
- Adjust Canny edge detection thresholds (currently 50, 150)
- Check console for contour count and aspect ratios

### Build Errors
- Clean build: `cd ios && xcodebuild clean`
- Reinstall pods: `cd ios && pod install`
- Clear metro cache: `npx expo start -c`

## Resources

- [VisionCamera Docs](https://react-native-vision-camera.com/)
- [FastOpenCV Guide](https://github.com/lukaszkurantdev/react-native-fast-opencv)
- [OpenCV Contour Detection](https://docs.opencv.org/4.x/d4/d73/tutorial_py_contours_begin.html)
- [TCG Card Dimensions](https://www.pokemon.com/us/pokemon-tcg/about-the-tcg) - Standard 2.5" x 3.5"

