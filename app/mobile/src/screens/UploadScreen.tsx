// Upload screen (contributor only)

import React, { useEffect, useState } from 'react';
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
import {
  uploadImage,
  saveImageMetadata,
  fetchImages,
  deleteImageRecord,
} from '../lib/supabase';
import { ImageData } from '../types';
import { useAuthContext } from '../context/AuthContext';

const mediaTypeImages =
  (ImagePicker as any)?.MediaType?.Images ?? ImagePicker.MediaTypeOptions.Images;

const pickerMediaTypes = (ImagePicker as any)?.MediaType
  ? ([mediaTypeImages] as any)
  : ImagePicker.MediaTypeOptions.Images;

const isValidUuid = (value?: string | null): value is string =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export default function UploadScreen() {
  const { user, isContributor } = useAuthContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Temporarily disabled for testing upload only
  // const [result, setResult] = useState<ImageData | null>(null);

  const loadImages = async () => {
    try {
      setLoadingImages(true);
      const data = await fetchImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  if (!isContributor) {
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
    try {
      // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Necesitamos acceso a tu galería para subir imágenes');
      return;
    }

      // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: pickerMediaTypes,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      } else if (result.canceled) {
        console.log('User canceled image picker');
      }
    } catch (error: any) {
      console.error('Error picking image:', error);
      Alert.alert('Error', error.message || 'Error al seleccionar la imagen');
    }
  };

  const takePhoto = async () => {
    try {
      // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Necesitamos acceso a tu cámara para tomar fotos');
      return;
    }

      // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: pickerMediaTypes,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      } else if (result.canceled) {
        console.log('User canceled camera');
      }
    } catch (error: any) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', error.message || 'Error al tomar la foto');
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !user) return;

    try {
      setUploading(true);

      // Step 1: Upload image to Supabase Storage (AI analysis disabled for testing)
      // Extract mimeType from the selected image if available
      // Note: ImagePicker result should have mimeType, but we'll handle it gracefully
      const fileUrl = await uploadImage(selectedImage);

      // Step 2: Save placeholder metadata so the image appears in the database
      const validUserId = isValidUuid(user?.id) ? user?.id : undefined;
      await saveImageMetadata({
        file_url: fileUrl,
        title: `Imagen móvil ${new Date().toLocaleString()}`,
        description: 'Subida desde la app móvil (pendiente análisis).',
        tags: [],
        fase_id: null,
        sub_etapa_id: null,
        mapa_id: null,
        ...(validUserId ? { user_id: validUserId } : {}),
      });

      // Success - show the uploaded image URL
      Alert.alert(
        '✅ Upload Exitoso', 
        `Imagen subida correctamente y guardada en la base de datos.\n\nURL: ${fileUrl}`,
        [{ text: 'OK' }]
      );

      // Clear the selected image after successful upload
      setSelectedImage(null);
      await loadImages();
      // setResult(null);

      // TODO: Re-enable AI analysis and database save once upload is confirmed working
      // Step 2: Analyze with AI (DISABLED FOR TESTING)
      // setAnalyzing(true);
      // const analysis = await analyzeImage(fileUrl);
      //
      // Step 3: Save to database (DISABLED FOR TESTING)
      // const imageData = await saveImageMetadata({
      //   file_url: fileUrl,
      //   title: analysis.title,
      //   description: analysis.description,
      //   tags: analysis.tags,
      //   fase_id: analysis.fase_id,
      //   sub_etapa_id: analysis.sub_etapa_id,
      //   mapa_id: analysis.mapa_id,
      //   user_id: user.id,
      // });
      // setResult(imageData);
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.message || 'Error al subir la imagen a Supabase');
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
          Sube una imagen para probar la funcionalidad de almacenamiento en Supabase. (Análisis de IA deshabilitado temporalmente)
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
                  {uploading ? 'Subiendo...' : 'Subir a Supabase'}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => {
                setSelectedImage(null);
                // setResult(null);
              }}
            >
              <Text style={styles.secondaryButtonText}>Elegir Otra</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Temporarily disabled - result display for AI analysis */}
        {/* {result && (
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
        )} */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus imágenes en Supabase</Text>
          {loadingImages ? (
            <ActivityIndicator color="#1B2838" />
          ) : images.length === 0 ? (
            <Text style={styles.emptyState}>
              Aún no hay registros en la tabla pública. Sube una imagen para comenzar.
            </Text>
          ) : (
            images.map((image) => (
              <View key={image.id} style={styles.imageCard}>
                <Image source={{ uri: image.file_url }} style={styles.imageCardImage} />
                <View style={styles.imageInfo}>
                  <Text style={styles.imageTitle}>
                    {image.title || 'Imagen sin título'}
                  </Text>
                  <Text style={styles.imageMeta}>
                    {new Date(image.created_at).toLocaleString()}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      Alert.alert(
                        'Eliminar imagen',
                        'Esta acción borrará el archivo en Storage y el registro en la base de datos. ¿Deseas continuar?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          {
                            text: 'Eliminar',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                setDeletingId(image.id);
                                await deleteImageRecord(image.id, image.file_url);
                                await loadImages();
                                Alert.alert('Eliminada', 'La imagen se eliminó correctamente.');
                              } catch (error: any) {
                                console.error('Delete error:', error);
                                Alert.alert('Error', error.message || 'No se pudo eliminar la imagen.');
                              } finally {
                                setDeletingId(null);
                              }
                            },
                          },
                        ],
                      );
                    }}
                    disabled={deletingId === image.id}
                  >
                    {deletingId === image.id ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.deleteButtonText}>Eliminar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
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
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B2838',
    marginBottom: 16,
  },
  emptyState: {
    fontSize: 15,
    color: '#6B7174',
    lineHeight: 20,
  },
  imageCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  imageCardImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 12,
  },
  imageInfo: {
    flex: 1,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B2838',
  },
  imageMeta: {
    fontSize: 13,
    color: '#6B7174',
    marginBottom: 8,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#B3261E',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
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
