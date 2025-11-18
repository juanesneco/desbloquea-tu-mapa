// Upload screen (contributor only)

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// Temporarily disable auth
// import { useAuth } from '../hooks/useAuth';
import { uploadImage, analyzeImage, saveImageMetadata } from '../lib/supabase';
import { ImageData } from '../types';

export default function UploadScreen() {
  // Temporarily disable auth check
  // const { user, isContributor } = useAuth();
  const user = { id: 'temp-user-id' };
  const isContributor = true; // Allow upload for now
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ImageData | null>(null);

  if (false) { // Temporarily allow all
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Solo los contribuidores pueden subir imágenes.
        </Text>
        <Text style={styles.errorSubtext}>
          Contacta a un administrador para obtener permisos de contribuidor.
        </Text>
      </View>
    );
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Necesitamos acceso a tu galería para subir imágenes');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Necesitamos acceso a tu cámara para tomar fotos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !user) return;

    try {
      setUploading(true);

      // Step 1: Upload image
      const fileName = `image-${Date.now()}.jpg`;
      const fileUrl = await uploadImage(selectedImage, fileName);

      // Step 2: Analyze with AI
      setAnalyzing(true);
      const analysis = await analyzeImage(fileUrl);

      // Step 3: Save to database
      const imageData = await saveImageMetadata({
        file_url: fileUrl,
        title: analysis.title,
        description: analysis.description,
        tags: analysis.tags,
        fase_id: analysis.fase_id,
        sub_etapa_id: analysis.sub_etapa_id,
        mapa_id: analysis.mapa_id,
        user_id: user.id,
      });

      setResult(imageData);
      Alert.alert('Éxito', 'Imagen analizada y guardada correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al procesar la imagen');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Subir Imagen</Text>
        <Text style={styles.subtitle}>
          Sube una imagen para que la IA la analice y la clasifique según la filosofía de Desbloquea Tu Mapa.
        </Text>

        {!selectedImage ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>Elegir de Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}>Tomar Foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <TouchableOpacity
              style={[styles.button, styles.uploadButton]}
              onPress={handleUpload}
              disabled={uploading || analyzing}
            >
              {uploading || analyzing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {analyzing ? 'Analizando...' : 'Subir y Analizar'}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => {
                setSelectedImage(null);
                setResult(null);
              }}
            >
              <Text style={styles.secondaryButtonText}>Elegir Otra</Text>
            </TouchableOpacity>
          </>
        )}

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Análisis Completado</Text>
            <Text style={styles.resultLabel}>Título:</Text>
            <Text style={styles.resultText}>{result.title}</Text>
            <Text style={styles.resultLabel}>Fase:</Text>
            <Text style={styles.resultText}>{result.fase?.nombre}</Text>
            <Text style={styles.resultLabel}>Sub-etapa:</Text>
            <Text style={styles.resultText}>
              {result.sub_etapa?.codigo} - {result.sub_etapa?.nombre}
            </Text>
            <Text style={styles.resultLabel}>Mapa:</Text>
            <Text style={styles.resultText}>{result.mapa?.nombre}</Text>
            <Text style={styles.resultLabel}>Descripción:</Text>
            <Text style={styles.resultText}>{result.description}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E6E3',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B2838',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7174',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: '#1B2838',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    marginTop: 16,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1B2838',
  },
  secondaryButtonText: {
    color: '#1B2838',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B2838',
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7174',
    marginTop: 12,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 16,
    color: '#1B2838',
    lineHeight: 22,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B2838',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6B7174',
    textAlign: 'center',
  },
});

