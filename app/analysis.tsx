import { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableLines from '../components/DraggableLines';
import PSAScoreDisplay from '../components/PSAScoreDisplay';
import CornerAnalysis from '../components/CornerAnalysis';
import { CornerBoundaries, CardDimensions } from '../types/measurements';
import { GradingResult, GradingCompany } from '../types/grading';
import { estimateCardDimensions } from '../utils/imageProcessing';
import { initializeCornerBoundaries, calculateCornerWearPercentages } from '../utils/cornerCalculations';
import { calculateGrade } from '../utils/psaGrading';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_WIDTH = screenWidth;

export default function AnalysisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const imageUri = params.imageUri as string;

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cardDimensions, setCardDimensions] = useState<CardDimensions | null>(null);
  const [boundaries, setBoundaries] = useState<CornerBoundaries | null>(null);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<GradingCompany>('PSA');

  useEffect(() => {
    if (imageUri) {
      // Get image dimensions
      Image.getSize(imageUri, (width, height) => {
        const aspectRatio = height / width;
        const displayHeight = IMAGE_WIDTH * aspectRatio;
        
        setImageSize({ width: IMAGE_WIDTH, height: displayHeight });
        
        // Estimate card dimensions
        const estimatedDimensions = estimateCardDimensions(IMAGE_WIDTH, displayHeight);
        setCardDimensions(estimatedDimensions);
        
        // Initialize corner boundaries
        const initialBoundaries = initializeCornerBoundaries(estimatedDimensions);
        setBoundaries(initialBoundaries);
        
        // Calculate initial grade
        calculateAndSetGrade(initialBoundaries, estimatedDimensions, selectedCompany);
      });
    }
  }, [imageUri]);

  const calculateAndSetGrade = (
    currentBoundaries: CornerBoundaries,
    currentDimensions: CardDimensions,
    company: GradingCompany
  ) => {
    const cornerWear = calculateCornerWearPercentages(currentBoundaries, currentDimensions);
    const result = calculateGrade(cornerWear, company);
    setGradingResult(result);
  };

  const handleBoundariesChange = (newBoundaries: CornerBoundaries) => {
    setBoundaries(newBoundaries);
    if (cardDimensions) {
      calculateAndSetGrade(newBoundaries, cardDimensions, selectedCompany);
    }
  };

  const handleRetake = () => {
    router.back();
  };

  const handleUploadNew = () => {
    router.replace('/home');
  };

  const handleSaveResult = () => {
    // In a full implementation, this would save to local storage or cloud
    Alert.alert(
      'Grade Saved',
      `Your card has been graded as PSA ${gradingResult?.score} - ${gradingResult?.gradeName}`,
      [{ text: 'OK' }]
    );
  };

  if (!imageUri || !imageSize.width || !cardDimensions || !boundaries || !gradingResult) {
    return (
      <View style={styles.loadingContainer}>
        <Button mode="contained" onPress={() => router.back()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Score Display */}
        <PSAScoreDisplay result={gradingResult} />

        {/* Instructions and Legend */}
        <CornerAnalysis boundaries={boundaries} />

        {/* Image with Draggable Lines */}
        <View style={[styles.imageContainer, { height: imageSize.height }]}>
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, { width: imageSize.width, height: imageSize.height }]}
            resizeMode="contain"
          />
          <DraggableLines
            boundaries={boundaries}
            cardDimensions={cardDimensions}
            imageWidth={imageSize.width}
            imageHeight={imageSize.height}
            onBoundariesChange={handleBoundariesChange}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSaveResult}
            style={styles.button}
            icon="content-save"
          >
            Save Result
          </Button>
          <Button
            mode="outlined"
            onPress={handleRetake}
            style={styles.button}
            icon="camera"
          >
            Retake Photo
          </Button>
          <Button
            mode="outlined"
            onPress={handleUploadNew}
            style={styles.button}
            icon="image"
          >
            Upload New
          </Button>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  imageContainer: {
    width: IMAGE_WIDTH,
    backgroundColor: '#000',
    position: 'relative',
    marginBottom: 16,
  },
  image: {
    position: 'absolute',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  button: {
    marginVertical: 4,
  },
});

