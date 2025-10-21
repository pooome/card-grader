# TCG Card Grader

A professional React Native mobile application for grading Trading Card Game (TCG) cards based on corner wear analysis. Built with Expo and TypeScript.

## Features

- 📷 **Camera Integration**: Take photos directly in-app with guided crosshairs
- 📤 **Photo Upload**: Select existing photos from your device
- 🎯 **Corner Analysis**: Interactive draggable lines to mark corner wear boundaries
- 📊 **PSA Grading**: Automatic grade calculation based on PSA standards
- 🏢 **Multiple Standards**: Support for PSA, BGS, and CGC grading standards (extensible)
- 📱 **Cross-Platform**: Works on both iOS and Android

## Tech Stack

- **Framework**: React Native with Expo SDK 54+
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: React Native Paper (Material Design)
- **Camera**: Expo Camera
- **Image Processing**: Expo Image Manipulator + Expo Image Picker
- **Computer Vision**: opencv.js (for future automatic detection)
- **Gestures**: React Native Gesture Handler
- **Graphics**: React Native SVG

## Project Structure

```
auto-grader/
├── app/                        # Expo Router screens
│   ├── _layout.tsx            # Root layout with navigation
│   ├── index.tsx              # Splash screen
│   ├── home.tsx               # Main screen with camera/upload options
│   ├── camera.tsx             # Camera view with crosshairs
│   └── analysis.tsx           # Analysis screen with draggable lines
├── components/                 # Reusable components
│   ├── CameraOverlay.tsx      # Crosshairs overlay for camera
│   ├── DraggableLines.tsx     # 8 draggable corner measurement lines
│   ├── CornerAnalysis.tsx     # Corner measurement display
│   └── PSAScoreDisplay.tsx    # PSA score and details display
├── utils/                      # Utility functions
│   ├── cornerCalculations.ts  # Corner percentage calculations
│   ├── psaGrading.ts          # PSA grading logic
│   └── imageProcessing.ts     # Image manipulation utilities
├── types/                      # TypeScript type definitions
│   ├── grading.ts             # Grading system types
│   └── measurements.ts        # Measurement types
└── constants/                  # App constants
    └── gradingStandards.ts    # PSA/BGS/CGC standards
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Physical device with Expo Go app (optional)

### Installation

1. Clone the repository:
```bash
cd auto-grader
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web (limited functionality)
npm run web
```

### Running on a Physical Device

1. Install the Expo Go app from the App Store (iOS) or Play Store (Android)
2. Run `npm start` on your development machine
3. Scan the QR code with your device's camera (iOS) or the Expo Go app (Android)

## How It Works

### 1. Capture or Upload
- **Camera Mode**: Open the camera and position your card within the crosshair guides
- **Upload Mode**: Select an existing photo from your device's gallery

### 2. Corner Analysis
The app displays your card image with 8 draggable lines (2 per corner):
- **Red Lines**: Top-left corner
- **Blue Lines**: Top-right corner
- **Orange Lines**: Bottom-left corner
- **Green Lines**: Bottom-right corner

Each corner has:
- One horizontal line marking where corner wear begins vertically
- One vertical line marking where corner wear begins horizontally

### 3. Grade Calculation
The app calculates:
- Corner wear percentage for each corner (based on line positions)
- Maximum wear percentage across all corners
- PSA grade based on the maximum wear

### PSA Grading Standards

| Grade | Name | Max Corner Wear |
|-------|------|-----------------|
| 10 | Gem Mint | <1% |
| 9 | Mint | 1-2% |
| 8 | NM-MT | 2-5% |
| 7 | Near Mint | 5-10% |
| 6 | EX-MT | 10-15% |
| 5 | Excellent | 15-25% |
| 4 | VG-EX | 25-35% |
| 3 | Very Good | 35-50% |
| 2 | Good | 50-70% |
| 1 | Poor | 70-100% |

## Future Enhancements

- [ ] Implement automatic corner detection using OpenCV.js
- [ ] Add edge detection for automatic card boundary identification
- [ ] Store grading history locally
- [ ] Export results as PDF reports
- [ ] Add surface analysis for scratches and imperfections
- [ ] Implement centering analysis
- [ ] Add authentication and cloud storage
- [ ] Compare against database of known card values

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- PSA grading standards based on professional card grading criteria
- Built with Expo and React Native
- UI components from React Native Paper

