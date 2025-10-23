import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert, Image, StatusBar, Text, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Rect, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import DraggableLines from '../components/DraggableLines';
import MultiCompanyGrades from '../components/MultiCompanyGrades';
import CenteringDisplay from '../components/CenteringDisplay';
import AnalysisHeader from '../components/AnalysisHeader';
import ZoomableImage from '../components/ZoomableImage';
import ZoomControls from '../components/ZoomControls';
import CardSideToggle from '../components/CardSideToggle';
import { BorderBoundaries, CardDimensions, CenteringMeasurements } from '../types/measurements';
import { GradingResult } from '../types/grading';
import { estimateCardDimensions } from '../utils/imageProcessing';
import { initializeBorderBoundaries } from '../utils/cornerCalculations';
import { calculateAllGrades } from '../utils/grading';
import { calculateCentering } from '../utils/centeringCalculations';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Estimate space taken by UI elements
const HEADER_HEIGHT = 90; // SafeAreaView top + AnalysisHeader
const GRADES_HEIGHT = 60; // MultiCompanyGrades
const CENTERING_HEIGHT = 50; // CenteringDisplay
const ZOOM_CONTROLS_HEIGHT = 80; // ZoomControls + SafeAreaView bottom
const AVAILABLE_IMAGE_HEIGHT = screenHeight - HEADER_HEIGHT - GRADES_HEIGHT - CENTERING_HEIGHT - ZOOM_CONTROLS_HEIGHT;

// Shimmer Button Component
function ShimmerButton({ children, onPress, icon }: { children: string; onPress: () => void; icon: string }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 7000,
        useNativeDriver: true,
      })
    );
    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth],
  });

  return (
    <View style={styles.shimmerButtonContainer}>
      <Button
        mode="contained"
        onPress={onPress}
        style={styles.emptyStateButton}
        contentStyle={styles.emptyStateButtonContent}
        labelStyle={styles.emptyStateButtonLabel}
        icon={icon}
        buttonColor="transparent"
      >
        {children}
      </Button>
      <View style={styles.shimmerGradientContainer} pointerEvents="none">
        <Animated.View style={[styles.shimmerAnimatedView, { transform: [{ translateX }] }]}>
          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.2)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmerGradient}
          />
        </Animated.View>
      </View>
    </View>
  );
}

export default function AnalysisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string | undefined>(params.imageUri as string | undefined);

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cardDimensions, setCardDimensions] = useState<CardDimensions | null>(null);
  const [boundaries, setBoundaries] = useState<BorderBoundaries | null>(null);
  const [gradingResults, setGradingResults] = useState<Record<string, GradingResult> | null>(null);
  const [centering, setCentering] = useState<CenteringMeasurements | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLinesDragging, setIsLinesDragging] = useState(false);
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');

  useEffect(() => {
    if (imageUri) {
      // Get image dimensions
      Image.getSize(imageUri, (width, height) => {
        const aspectRatio = height / width;
        
        // Calculate dimensions to fit within available space
        let displayWidth = screenWidth;
        let displayHeight = displayWidth * aspectRatio;
        
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
    // Calculate centering data
    const centeringData = calculateCentering(currentBoundaries, currentDimensions);
    setCentering(centeringData);
    
    // Calculate grades based on centering and selected card side
    const allResults = calculateAllGrades(centeringData, cardSide);
    setGradingResults(allResults);
  };

  // Recalculate grades when card side changes
  useEffect(() => {
    if (boundaries && cardDimensions) {
      calculateAndSetGrades(boundaries, cardDimensions);
    }
  }, [cardSide]);

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

  const handleGallery = async () => {
    // Request permission to access photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload photos.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCamera = () => {
    router.push('/camera');
  };

  const handleMenu = () => {
    Alert.alert('Menu', 'Additional options');
  };

  // Show empty state with buttons when no image is loaded
  const showEmptyState = !imageUri || !imageSize.width || !cardDimensions || !boundaries || !gradingResults || !centering;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Navigation Header - Only show when image is loaded */}
      {!showEmptyState && (
        <SafeAreaView edges={['top']} style={styles.headerContainer}>
          <AnalysisHeader
            onFavorite={handleFavorite}
            onGallery={handleGallery}
            onCamera={handleCamera}
            onMenu={handleMenu}
          />
        </SafeAreaView>
      )}

      {showEmptyState ? (
        /* Empty state - Show buttons to get started */
        <View style={styles.emptyStateContainer}>
          <View style={styles.cardPlaceholderContainer}>
            <Svg 
              width={screenWidth * 0.7 + 60} 
              height={screenWidth * 0.7 * 1.4 + 60} 
              style={styles.cardPlaceholderSvg}
            >
              {/* Card outline with dotted lines */}
              <Rect
                x={30}
                y={30}
                width={screenWidth * 0.7}
                height={screenWidth * 0.7 * 1.4}
                fill="none"
                stroke="white"
                strokeWidth={2}
                strokeDasharray="10,10"
                rx={16}
                ry={16}
                opacity={0.3}
              />
              
              {/* 4 border lines: 20px inset from card edges, extending past the card */}
              {/* Top line - horizontal, 20px below top edge */}
              <Line 
                x1={0} 
                y1={50} 
                x2={screenWidth * 0.7 + 60} 
                y2={50} 
                stroke="white" 
                strokeWidth={1} 
                opacity={0.5} 
              />
              
              {/* Bottom line - horizontal, 20px above bottom edge */}
              <Line 
                x1={0} 
                y1={screenWidth * 0.7 * 1.4 + 10} 
                x2={screenWidth * 0.7 + 60} 
                y2={screenWidth * 0.7 * 1.4 + 10} 
                stroke="white" 
                strokeWidth={1} 
                opacity={0.5} 
              />
              
              {/* Left line - vertical, 20px right of left edge */}
              <Line 
                x1={50} 
                y1={0} 
                x2={50} 
                y2={screenWidth * 0.7 * 1.4 + 60} 
                stroke="white" 
                strokeWidth={1} 
                opacity={0.5} 
              />
              
              {/* Right line - vertical, 20px left of right edge */}
              <Line 
                x1={screenWidth * 0.7 + 10} 
                y1={0} 
                x2={screenWidth * 0.7 + 10} 
                y2={screenWidth * 0.7 * 1.4 + 60} 
                stroke="white" 
                strokeWidth={1} 
                opacity={0.5} 
              />
            </Svg>
          </View>
          
          <View style={styles.emptyStateTextContainer}>
            <Text style={styles.emptyStateTitle}>Scan / Upload Card</Text>
            <Text style={styles.emptyStateSubtitle}>
              To begin, scan or upload a card that you would like to grade
            </Text>
          </View>
          
          <View style={styles.emptyStateButtonsContainer}>
            <ShimmerButton onPress={handleCamera} icon="camera">
              Scan Card
            </ShimmerButton>

            <ShimmerButton onPress={handleGallery} icon="image">
              Upload Photo
            </ShimmerButton>
          </View>
        </View>
      ) : (
        /* Image loaded state - Show analysis */
        <>
          {/* Multi-Company Grades */}
          <MultiCompanyGrades
            psaResult={gradingResults.PSA}
            bgsResult={gradingResults.BGS}
            cgcResult={gradingResults.CGC}
            cardSide={cardSide}
          />

          {/* Centering Display */}
          <CenteringDisplay centering={centering} />

          {/* Zoomable Image with Draggable Lines */}
          <View style={styles.imageWrapper}>
            <ZoomableImage
              imageUri={imageUri!}
              imageWidth={imageSize.width}
              imageHeight={imageSize.height}
              onTransformChange={handleTransformChange}
              isLinesDragging={isLinesDragging}
            >
              <DraggableLines
                boundaries={boundaries!}
                cardDimensions={cardDimensions!}
                imageWidth={imageSize.width}
                imageHeight={imageSize.height}
                onBoundariesChange={handleBoundariesChange}
                onDraggingChange={setIsLinesDragging}
                scale={zoomLevel}
              />
            </ZoomableImage>
          </View>

          {/* Zoom Level Indicator */}
          <ZoomControls zoomLevel={zoomLevel} />
          
          {/* Card Side Toggle */}
          <CardSideToggle 
            cardSide={cardSide}
            onToggle={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
          />
        </>
      )}
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  cardPlaceholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPlaceholderSvg: {
    // SVG positioned normally
  },
  emptyStateTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 15,
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyStateButtonsContainer: {
    width: screenWidth * 0.65,
    gap: 16,
    alignItems: 'stretch',
  },
  shimmerButtonContainer: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#555555',
  },
  shimmerGradientContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 20,
  },
  shimmerAnimatedView: {
    width: screenWidth,
    height: '100%',
  },
  shimmerGradient: {
    flex: 1,
    width: '100%',
  },
  emptyStateButton: {
    borderRadius: 20,
    elevation: 0,
  },
  emptyStateButtonContent: {
    paddingVertical: 0,
    paddingHorizontal: 20,
  },
  emptyStateButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: '#FFFFFF',
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

