import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto-navigate to home after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TCG Card Grader</Text>
        <Text style={styles.subtitle}>Professional Card Grading Analysis</Text>
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e88e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e3f2fd',
    marginBottom: 32,
  },
  loader: {
    marginTop: 16,
  },
});

