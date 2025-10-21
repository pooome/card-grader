# Quick Start Guide

## Running the App

### 1. Start the Development Server

```bash
npm start
```

This will start the Expo development server and show you a QR code.

### 2. Run on Your Device

#### Option A: Using Expo Go (Easiest)

1. Install **Expo Go** from:
   - [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)
   - [Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code:
   - **iOS**: Use your camera app
   - **Android**: Use the Expo Go app

#### Option B: Using a Simulator/Emulator

**iOS Simulator (macOS only):**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

Make sure you have Android Studio or Xcode installed.

## App Flow

### 1. Splash Screen
- The app opens with a splash screen
- Automatically navigates to the home screen after 2 seconds

### 2. Home Screen
Two options:
- **Take Photo**: Opens camera with crosshair guides
- **Upload Photo**: Select from your photo library

### 3. Camera Screen (if taking photo)
- Position your TCG card within the crosshair guides
- Keep the camera directly above the card (avoid angles)
- Tap the white capture button to take the photo

### 4. Analysis Screen
This is where the magic happens!

**What you'll see:**
- Your card image
- 8 colored lines overlaying the corners:
  - 🔴 Red = Top Left corner
  - 🔵 Blue = Top Right corner
  - 🟠 Orange = Bottom Left corner
  - 🟢 Green = Bottom Right corner

**How to use:**
1. Each corner has 2 lines (one horizontal, one vertical)
2. Drag these lines to mark where the corner wear starts
3. The PSA score updates in real-time as you adjust the lines
4. Fine-tune until the lines accurately mark the corner wear

**The score card shows:**
- Overall PSA grade (1-10)
- Grade name (e.g., "Gem Mint")
- Individual corner wear percentages
- Maximum wear percentage (this determines your grade)

### 5. Save or Retake
- **Save Result**: Saves your grading result (currently shows an alert)
- **Retake Photo**: Go back to camera
- **Upload New**: Return to home screen

## Tips for Best Results

1. **Lighting**: Use good, even lighting when photographing cards
2. **Angle**: Keep the camera directly above the card (90-degree angle)
3. **Focus**: Make sure the card corners are in focus
4. **Background**: Use a contrasting background color
5. **Positioning**: Try to fill most of the frame with the card

## Understanding PSA Grades

| Grade | Name | Max Corner Wear | Description |
|-------|------|-----------------|-------------|
| 10 | Gem Mint | <1% | Virtually perfect |
| 9 | Mint | 1-2% | Super high-end |
| 8 | NM-MT | 2-5% | Near Mint to Mint |
| 7 | Near Mint | 5-10% | Slight surface wear |
| 6 | EX-MT | 10-15% | Minor corner wear |
| 5 | Excellent | 15-25% | Slightly rounded corners |
| 4 | VG-EX | 25-35% | Noticeable corner wear |
| 3 | Very Good | 35-50% | Obvious corner wear |
| 2 | Good | 50-70% | Heavily worn |
| 1 | Poor | 70-100% | Significant damage |

## Troubleshooting

### Camera not working
- Make sure you granted camera permissions
- Go to Settings > [App Name] > Camera and enable it

### Photo library not accessible
- Grant photo library permissions
- Go to Settings > [App Name] > Photos and enable it

### App crashes or won't start
```bash
# Clear the cache
npm start -- --clear

# Or reinstall dependencies
rm -rf node_modules
npm install
npm start
```

### Lines won't drag
- Make sure you're tapping on the circular handles on the lines
- Try tapping and holding before dragging

## Next Steps

Once you're comfortable with the basic flow, you can:
- Try grading multiple cards to compare conditions
- Test the accuracy against professional grading services
- Experiment with different lighting and angles

## Need Help?

If you encounter any issues or have questions, please check the main README.md for more detailed information.

