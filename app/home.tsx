import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const router = useRouter();

  const handleTakePhoto = () => {
    router.push('/camera');
  };

  const handleUploadPhoto = async () => {
    // Request permission to access photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload photos.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      // Navigate to analysis screen with the selected image
      router.push({
        pathname: '/analysis',
        params: { imageUri: result.assets[0].uri },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.welcomeText}>
          Welcome to TCG Card Grader
        </Text>
        <Text variant="bodyLarge" style={styles.descriptionText}>
          Analyze your trading cards with professional-grade corner wear detection
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleTakePhoto}
            style={styles.button}
            contentStyle={styles.buttonContent}
            icon="camera"
          >
            Take Photo
          </Button>

          <Button
            mode="contained"
            onPress={handleUploadPhoto}
            style={styles.button}
            contentStyle={styles.buttonContent}
            icon="image"
          >
            Upload Photo
          </Button>
        </View>

        <View style={styles.infoContainer}>
          <Text variant="titleSmall" style={styles.infoTitle}>
            How it works:
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            1. Take or upload a photo of your card
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            2. Adjust corner wear markers
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            3. Get your PSA grade estimate
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#1e88e5',
    fontWeight: 'bold',
  },
  descriptionText: {
    textAlign: 'center',
    marginBottom: 48,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 48,
  },
  button: {
    marginVertical: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1565c0',
  },
  infoText: {
    marginVertical: 4,
    color: '#333',
  },
});

