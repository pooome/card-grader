import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert, Image, StatusBar, Text, Animated, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import Svg, { Rect, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import DraggableLines from '../components/DraggableLines';
import MultiCompanyGrades from '../components/MultiCompanyGrades';
import CenteringDisplay from '../components/CenteringDisplay';
import AnalysisHeader from '../components/AnalysisHeader';
import ZoomableImage, { ZoomableImageRef } from '../components/ZoomableImage';
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
  const zoomableImageRef = useRef<ZoomableImageRef>(null);
  const [imageUri, setImageUri] = useState<string | undefined>(params.imageUri as string | undefined);

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cardDimensions, setCardDimensions] = useState<CardDimensions | null>(null);
  const [boundaries, setBoundaries] = useState<BorderBoundaries | null>(null);
  const [gradingResults, setGradingResults] = useState<Record<string, GradingResult> | null>(null);
  const [centering, setCentering] = useState<CenteringMeasurements | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLinesDragging, setIsLinesDragging] = useState(false);
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [recentPhotos, setRecentPhotos] = useState<MediaLibrary.AssetInfo[]>([]);

  // Load recent photos for empty state gallery
  useEffect(() => {
    const loadRecentPhotos = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const media = await MediaLibrary.getAssetsAsync({
          first: 12,
          mediaType: 'photo',
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        });
        
        // Get full asset info with actual URIs for each photo
        const assetsWithInfo = await Promise.all(
          media.assets.map(async (asset) => {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
            return assetInfo;
          })
        );
        
        setRecentPhotos(assetsWithInfo);
      }
    };

    if (!imageUri) {
      loadRecentPhotos();
    }
  }, [imageUri]);

  useEffect(() => {
    if (imageUri) {
      // Get image dimensions
      Image.getSize(imageUri, (width, height) => {
        const aspectRatio = height / width;
        
        // Always use full screen width
        const displayWidth = screenWidth;
        let displayHeight = displayWidth * aspectRatio;
        
        // If image is too tall, crop it to fit (we'll use cover mode for this)
        if (displayHeight > AVAILABLE_IMAGE_HEIGHT) {
          displayHeight = AVAILABLE_IMAGE_HEIGHT;
        }
        
        setImageSize({ width: displayWidth, height: displayHeight });
        
        // Estimate card dimensions
        const estimatedDimensions = estimateCardDimensions(displayWidth, displayHeight);
        setCardDimensions(estimatedDimensions);
        
        // Initialize border boundaries
        const initialBoundaries = initializeBorderBoundaries(
          estimatedDimensions,
          displayWidth,
          displayHeight
        );
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

  const handleSelectPhoto = async (asset: MediaLibrary.AssetInfo) => {
    // Use localUri for iOS or uri for Android
    const imageUri = asset.localUri || asset.uri;
    setImageUri(imageUri);
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

  const handleZoomReset = () => {
    zoomableImageRef.current?.resetZoom();
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
              width={screenWidth * 0.49 + 42} 
              height={screenWidth * 0.49 * 1.4 + 42} 
              style={styles.cardPlaceholderSvg}
            >
              {/* Card outline with dotted lines */}
              <Rect
                x={21}
                y={21}
                width={screenWidth * 0.49}
                height={screenWidth * 0.49 * 1.4}
                fill="none"
                stroke="white"
                strokeWidth={2}
                strokeDasharray="10,10"
                rx={11}
                ry={11}
                opacity={0.3}
              />
              
              {/* 4 border lines: 14px inset from card edges, extending past the card */}
              {/* Top line - horizontal, 14px below top edge */}
              <Line 
                x1={0} 
                y1={35} 
                x2={screenWidth * 0.49 + 42} 
                y2={35} 
                stroke="white" 
                strokeWidth={1} 
                opacity={0.5} 
              />
              
              {/* Bottom line - horizontal, 14px above bottom edge */}
              <Line 
                x1={0} 
                y1={screenWidth * 0.49 * 1.4 + 7} 
                x2={screenWidth * 0.49 + 42} 
                y2={screenWidth * 0.49 * 1.4 + 7} 
                stroke="white" 
                strokeWidth={1} 
                opacity={0.5} 
              />
              
              {/* Left line - vertical, 14px right of left edge */}
              <Line 
                x1={35} 
                y1={0} 
                x2={35} 
                y2={screenWidth * 0.49 * 1.4 + 42} 
                stroke="white" 
                strokeWidth={1} 
                opacity={0.5} 
              />
              
              {/* Right line - vertical, 14px left of right edge */}
              <Line 
                x1={screenWidth * 0.49 + 7} 
                y1={0} 
                x2={screenWidth * 0.49 + 7} 
                y2={screenWidth * 0.49 * 1.4 + 42} 
                stroke="white" 
                strokeWidth={1} 
                opacity={0.5} 
              />
            </Svg>
          </View>
          
          <View style={styles.emptyStateTextContainer}>
            <Text style={styles.emptyStateTitle}>Scan / Upload Card</Text>
            <Text style={styles.emptyStateSubtitle}>
              To begin, add a card that you would like to grade
            </Text>
          </View>
          
          <View style={styles.emptyStateButtonsContainer}>
            <ShimmerButton onPress={handleCamera} icon="camera">
              Scan Card
            </ShimmerButton>

            <ShimmerButton onPress={handleGallery} icon="image">
              Browse All Photos
            </ShimmerButton>
          </View>

          {/* Recent Photos Gallery */}
          {recentPhotos.length > 0 && (
            <View style={styles.galleryContainer}>
              <Text style={styles.galleryTitle}>Recent Photos</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryScrollContent}
              >
                {recentPhotos.map((photo) => (
                  <TouchableOpacity
                    key={photo.id}
                    style={styles.galleryItem}
                    onPress={() => handleSelectPhoto(photo)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: photo.localUri || photo.uri }}
                      style={styles.galleryImage}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
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
              ref={zoomableImageRef}
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
          <ZoomControls zoomLevel={zoomLevel} onReset={handleZoomReset} />
          
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
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyStateButtonsContainer: {
    width: screenWidth * 0.65,
    gap: 16,
    alignItems: 'stretch',
  },
  galleryContainer: {
    marginTop: 20,
    width: '100%'
  },
  galleryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 20,
    letterSpacing: 0.5,
  },
  galleryScrollContent: {
    gap: 12,
    paddingRight: 20,
  },
  galleryItem: {
    width: 100,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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

