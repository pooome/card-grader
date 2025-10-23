import { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Alert, Image, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DraggableLines from '../components/DraggableLines';
import MultiCompanyGrades from '../components/MultiCompanyGrades';
import CenteringDisplay from '../components/CenteringDisplay';
import AnalysisHeader from '../components/AnalysisHeader';
import ZoomableImage from '../components/ZoomableImage';
import ZoomControls from '../components/ZoomControls';
import { BorderBoundaries, CardDimensions, CenteringMeasurements } from '../types/measurements';
import { GradingResult } from '../types/grading';
import { estimateCardDimensions } from '../utils/imageProcessing';
import { initializeBorderBoundaries, calculateBorderWear } from '../utils/cornerCalculations';
import { calculateAllGrades } from '../utils/grading';
import { calculateCentering } from '../utils/centeringCalculations';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const IMAGE_WIDTH = screenWidth;
// Reserve space for score display (~66px) and instructions (~30px) = ~96px
const AVAILABLE_IMAGE_HEIGHT = screenHeight - 96;

export default function AnalysisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const imageUri = params.imageUri as string;

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cardDimensions, setCardDimensions] = useState<CardDimensions | null>(null);
  const [boundaries, setBoundaries] = useState<BorderBoundaries | null>(null);
  const [gradingResults, setGradingResults] = useState<Record<string, GradingResult> | null>(null);
  const [centering, setCentering] = useState<CenteringMeasurements | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLinesDragging, setIsLinesDragging] = useState(false);

  useEffect(() => {
    if (imageUri) {
      // Get image dimensions
      Image.getSize(imageUri, (width, height) => {
        const aspectRatio = height / width;
        let displayHeight = IMAGE_WIDTH * aspectRatio;
        let displayWidth = IMAGE_WIDTH;
        
        // If image is too tall, constrain by height instead
        if (displayHeight > AVAILABLE_IMAGE_HEIGHT) {
          displayHeight = AVAILABLE_IMAGE_HEIGHT;
          displayWidth = displayHeight / aspectRatio;
        }
        
        setImageSize({ width: displayWidth, height: displayHeight });
        
        // Estimate card dimensions
        const estimatedDimensions = estimateCardDimensions(displayWidth, displayHeight);
        setCardDimensions(estimatedDimensions);
        
        // Initialize border boundaries
        const initialBoundaries = initializeBorderBoundaries(estimatedDimensions);
        setBoundaries(initialBoundaries);
        
        // Calculate initial grades and centering
        calculateAndSetGrades(initialBoundaries, estimatedDimensions);
      });
    }
  }, [imageUri]);

  const calculateAndSetGrades = (
    currentBoundaries: BorderBoundaries,
    currentDimensions: CardDimensions
  ) => {
    const borderWearPercent = calculateBorderWear(currentBoundaries, currentDimensions);
    const allResults = calculateAllGrades(borderWearPercent);
    setGradingResults(allResults);
    
    const centeringData = calculateCentering(currentBoundaries, currentDimensions);
    setCentering(centeringData);
  };

  const handleBoundariesChange = (newBoundaries: BorderBoundaries) => {
    setBoundaries(newBoundaries);
    if (cardDimensions) {
      calculateAndSetGrades(newBoundaries, cardDimensions);
    }
  };

  const handleTransformChange = (scale: number, translateX: number, translateY: number) => {
    setZoomLevel(scale);
  };

  const handleFavorite = () => {
    Alert.alert('Favorite', 'Added to favorites');
  };

  const handleGallery = () => {
    router.replace('/home');
  };

  const handleCamera = () => {
    router.back();
  };

  const handleMenu = () => {
    Alert.alert('Menu', 'Additional options');
  };

  if (!imageUri || !imageSize.width || !cardDimensions || !boundaries || !gradingResults || !centering) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Navigation Header - Pinned to top */}
      <SafeAreaView edges={['top']} style={styles.headerContainer}>
        <AnalysisHeader
          onFavorite={handleFavorite}
          onGallery={handleGallery}
          onCamera={handleCamera}
          onMenu={handleMenu}
        />
      </SafeAreaView>

      {/* Multi-Company Grades */}
      <MultiCompanyGrades
        psaResult={gradingResults.PSA}
        bgsResult={gradingResults.BGS}
        cgcResult={gradingResults.CGC}
      />

      {/* Centering Display */}
      <CenteringDisplay centering={centering} />

      {/* Zoomable Image with Draggable Lines */}
      <View style={styles.imageWrapper}>
        <ZoomableImage
          imageUri={imageUri}
          imageWidth={imageSize.width}
          imageHeight={imageSize.height}
          onTransformChange={handleTransformChange}
          isLinesDragging={isLinesDragging}
        >
          <DraggableLines
            boundaries={boundaries}
            cardDimensions={cardDimensions}
            imageWidth={imageSize.width}
            imageHeight={imageSize.height}
            onBoundariesChange={handleBoundariesChange}
            onDraggingChange={setIsLinesDragging}
          />
        </ZoomableImage>
      </View>

      {/* Zoom Level Indicator */}
      <SafeAreaView edges={['bottom']} style={styles.zoomControlsContainer}>
        <ZoomControls zoomLevel={zoomLevel} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    backgroundColor: '#000',
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: '#000',
    margin: 0,
    padding: 0,
  },
  zoomControlsContainer: {
    backgroundColor: 'transparent',
  },
});

