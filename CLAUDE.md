# TCG Card Grader

## Project Purpose
React Native mobile app for grading Trading Card Game cards (Pokemon, MTG, Yu-Gi-Oh, Sports cards). Uses computer vision to detect card edges and provide professional grading assessments based on PSA, BGS, and CGC standards.

## Core Feature: Card Centering Analysis
**IMPORTANT**: The primary feature is automatic card centering detection - measuring how well-centered the printed image is on the physical card.

**Centering requires detecting TWO boundaries:**
1. **Physical card edges** (outer boundary) - 4 lines: top, bottom, left, right of card stock
2. **Printed border edges** (inner boundary) - 4 lines: top, bottom, left, right of artwork/border

**Critical calculation:**
- Vertical centering = Top margin vs Bottom margin (e.g., 55/45, 60/40)
- Horizontal centering = Left margin vs Right margin (e.g., 52/48, 70/30)
- Perfect 50/50 = Gem Mint eligible
- 70/30 or worse = Drops grade by 2-3 points

## Key Architecture Decisions

### Draggable Lines System
The app uses an 8-line draggable system (`components/DraggableLines.tsx`) for user adjustment:
- User can manually correct any misdetected boundaries
- Real-time calculations update as lines are dragged
- Touch gestures handled via React Native Gesture Handler
- Currently used for corner wear; adaptable for edge detection

### Grading Logic
**IMPORTANT**: Final grade = WORST of all factors (centering, corners, edges, surface)
- Located in `utils/grading.ts` and `constants/gradingStandards.ts`
- Supports asymmetric centering for BGS/CGC 9.5 grades (50/50 one way + 55/45 other)
- Pristine 10 uses 1% deviation tolerance (49/51 to 51/49) for practical measurement

## Development Commands

```bash
npm start              # Start Expo dev server
npm run ios           # iOS simulator
npm run android       # Android emulator
npx expo prebuild     # Generate native projects (required for OpenCV)
```

## Critical Dependencies

**Computer Vision:**
- `react-native-fast-opencv` - **CRITICAL** for edge detection and card boundary identification
- Requires development build (not Expo Go)
- No web support for OpenCV features

**Camera:**
- `expo-camera` - Standard camera
- `react-native-vision-camera` - Advanced camera with frame processing
- `vision-camera-resize-plugin` - Performance optimization

## Testing Instructions

**MUST test on physical devices:**
- Camera features don't work reliably in simulators
- iOS and Android have different camera behaviors
- Test with various card sizes, lighting conditions, and card types (holographic, borderless)

**Test centering edge cases:**
- Off-center cards (70/30, 80/20)
- Borderless cards (no inner boundary)
- Holographic/reflective surfaces
- Poor lighting conditions

## Platform-Specific Requirements

**iOS:**
- Camera permissions required in Info.plist
- Development build needed for OpenCV

**Android:**
- Camera permissions in AndroidManifest.xml
- Development build needed for OpenCV

**Web:**
- Limited camera support
- No OpenCV features available

## Non-Obvious Patterns

### Centering Calculations
Located in `utils/centeringCalculations.ts`:
```typescript
// Centering is calculated as deviation from perfect 50/50
// e.g., 55/45 = 5% deviation, 70/30 = 20% deviation
```

### Asymmetric Centering (BGS/CGC 9.5)
```typescript
// Special case: One direction must be 50/50, other can be 55/45
// Logic in utils/grading.ts checks both combinations:
// - Horizontal ≤ 1% AND Vertical ≤ 5%, OR
// - Vertical ≤ 1% AND Horizontal ≤ 5%
```

### Image Coordinate System
- React Native uses top-left origin (0,0)
- Coordinates are in device pixels
- Must account for image scaling when displaying on screen
- Draggable lines use percentage-based positioning for consistency

## Common Gotchas

1. **OpenCV requires native modules** - Must use development build, not Expo Go
2. **Camera frame processing is CPU intensive** - Resize frames before processing
3. **Reanimated animations** - Use worklets for 60fps performance during line dragging
4. **Type imports** - Always use `import type { ... }` for type-only imports
5. **Grading standards updated** - See `constants/gradingStandards.ts` for official PSA/BGS/CGC standards (scraped from official sources)

## Success Criteria

**MVP for centering feature:**
1. ✅ Auto-detect card edges (best effort)
2. ✅ Auto-detect printed border edges (best effort)
3. ✅ User can manually adjust all 8 boundary lines
4. ✅ Real-time centering calculations
5. ✅ Display top/bottom/left/right margins
6. ✅ Display vertical/horizontal centering ratios (e.g., "55/45")
7. ✅ Show predicted grade based on centering

## Code Style

- Use arrow functions for component definitions
- Extract complex calculations to utility files
- Keep components focused and single-purpose
- Comment complex algorithms (especially grading logic and centering calculations)
- Pure functions in `utils/` - no side effects
