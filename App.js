import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as fal from '@fal-ai/serverless-client';

fal.config({
  credentials: 'ff3a5b06-5389-492c-a206-c71078d35466:51427b9d77185294f2a7a877cbecccab',
});

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await fal.subscribe('fal-ai/lora', {
        input: {
          model_name: 'stabilityai/stable-diffusion-xl-base-1.0',
          prompt: prompt,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      if (result.images && result.images.length > 0) {
        setGeneratedImage(result.images[0].url);
      } else {
        setError('No image generated');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Error generating image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Any Image Generator</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPrompt}
          value={prompt}
          placeholder="Enter your prompt here"
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={generateImage} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Generating...' : 'Generate Image'}</Text>
        </TouchableOpacity>
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {generatedImage && (
          <Image source={{ uri: generatedImage }} style={styles.image} resizeMode="contain" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default App;