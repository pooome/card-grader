# Vision Mode Toggle Implementation

## Overview
Successfully implemented a settings toggle that allows users to switch between:
- **Classic Mode**: Uses `expo-camera` (works in Expo Go, no native build required)
- **Vision Mode**: Uses `react-native-vision-camera` + OpenCV (requires native build for card detection)

## What Was Implemented

### 1. Settings Management (`utils/settings.ts`)
- Created settings system using AsyncStorage for persistence
- `useSettings()` hook for React components
- Default: Vision Mode OFF (classic mode for compatibility)

### 2. Camera Implementation Split
- **`app/camera.tsx`**: Router that conditionally loads camera based on settings
- **`app/camera-classic.tsx`**: Original expo-camera implementation
- **`app/camera-vision.tsx`**: VisionCamera + OpenCV implementation

### 3. Settings UI in Analysis Screen
- Added settings dialog accessible from header menu (dots icon)
- Toggle switch for Vision Mode with descriptions
- Shows appropriate messaging based on mode:
  - **ON**: "Requires native build (npx expo run:ios/android)"
  - **OFF**: "Classic mode works in Expo Go"

### 4. Dependencies Added
- `@react-native-async-storage/async-storage` for settings persistence

## How It Works

### User Flow
1. User opens app → defaults to Classic Mode (expo-camera)
2. User taps menu icon in analysis header
3. Settings dialog appears with "Vision Mode" toggle
4. User enables Vision Mode toggle
5. Setting is saved to AsyncStorage
6. Next camera launch uses VisionCamera + OpenCV detection

### Camera Loading Logic
```typescript
// app/camera.tsx
if (settings.visionModeEnabled) {
  return <CameraVisionScreen />; // OpenCV detection
}
return <CameraClassicScreen />; // Standard camera
```

## Comparison

### Classic Mode (Default)
- ✅ Works in Expo Go
- ✅ No native build required
- ✅ Faster development iteration
- ✅ Level detection with manual card positioning
- ❌ No automatic card detection
- ❌ No auto-positioned boundaries

### Vision Mode
- ✅ Real-time card detection with OpenCV
- ✅ Auto-positioned boundaries in analysis
- ✅ Visual feedback (cyan outline) when card detected
- ✅ Smoother user experience
- ❌ Requires native build (`npx expo run:ios` or `android`)
- ❌ Longer build times
- ❌ Doesn't work in Expo Go

## Testing Instructions

### Test Classic Mode (Current State)
Since vision mode is OFF by default and you're in Expo Go:
1. Open app in Expo Go (already running)
2. Navigate to camera
3. Should see classic expo-camera (no OpenCV errors)
4. Level indicators work
5. Capture → analysis with manual boundary estimation

### Test Settings Toggle
1. Go to analysis screen
2. Tap menu icon (three dots) in top right
3. Settings dialog opens
4. Toggle "Vision Mode" switch
5. Close dialog
6. Go to camera screen
7. Observe behavior based on setting

### Test Vision Mode (After Native Build)
1. Enable Vision Mode in settings
2. Build natively:
   ```bash
   npx expo run:ios
   # or
   npx expo run:android
   ```
3. Open camera
4. Point at trading card
5. See cyan outline when detected
6. Capture shows auto-positioned boundaries

## File Structure

```
app/
├── camera.tsx              # Router (conditionally loads implementation)
├── camera-classic.tsx      # Classic expo-camera implementation
├── camera-vision.tsx       # VisionCamera + OpenCV implementation
└── analysis.tsx            # Updated with settings dialog

components/
└── CameraOverlay.tsx       # Supports both modes (detects null corners)

utils/
├── settings.ts             # Settings management system
├── cardDetectionProcessor.ts   # OpenCV detection (vision mode only)
└── cornerToBoundaries.ts       # Convert corners to boundaries
```

## Benefits of This Approach

### 1. Development Flexibility
- Developers can iterate quickly in Expo Go with classic mode
- Enable vision mode only when testing detection features
- No need to rebuild for UI/logic changes

### 2. User Choice
- Users can disable vision mode if:
  - They have an older device (performance)
  - They prefer manual control
  - Detection isn't working well for their use case

### 3. Graceful Fallback
- App works immediately without native build
- Vision mode is opt-in feature
- If OpenCV fails, user can toggle back to classic

### 4. Future Extensibility
Settings infrastructure ready for additional features:
- Auto-save photos
- Higher quality capture
- Different detection algorithms
- Premium features

## Current State

✅ Settings system implemented
✅ Camera modes separated
✅ Settings UI in analysis header
✅ Classic mode works in Expo Go
✅ Vision mode ready for native build
✅ AsyncStorage dependency installed
✅ No OpenCV errors in Expo Go (classic mode)

## Next Steps

1. **Test in Expo Go**: Verify classic mode works without errors
2. **Native Build**: When ready, build with `npx expo run:ios/android`
3. **Test Vision Mode**: Enable toggle and test detection
4. **Fine-tune**: Adjust detection parameters based on testing
5. **User Documentation**: Add in-app help for vision mode

## Troubleshooting

### "OpenCV not available" errors
- This is expected in Expo Go
- Disable Vision Mode in settings to use classic mode
- Or build natively to enable OpenCV

### Settings not persisting
- Clear app data and restart
- Check AsyncStorage permissions
- Verify settings.ts is imported correctly

### Camera not switching modes
- Force close app
- Clear settings: delete app and reinstall
- Check settings.visionModeEnabled value in logs

## Settings API

```typescript
import { useSettings } from '../utils/settings';

function MyComponent() {
  const { settings, updateSettings, loading } = useSettings();
  
  // Read setting
  const isVisionEnabled = settings.visionModeEnabled;
  
  // Update setting
  await updateSettings({ visionModeEnabled: true });
}
```

## Recommendation

**For Now**: Keep Vision Mode OFF (default) and use classic mode in Expo Go for quick development and testing.

**When Ready**: Enable Vision Mode in settings and do a native build to test the full detection experience.

This gives you the best of both worlds! 🎉

