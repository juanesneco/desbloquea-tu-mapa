// Gallery screen - displays all uploaded images from Supabase Storage

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { listUploadedImages, deleteImageByUrl } from '../lib/supabase';
import { useAuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 48) / 2; // 2 columns with padding

export default function GalleryScreen() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const { isContributor } = useAuthContext();

  const loadImages = async () => {
    try {
      const imageUrls = await listUploadedImages();
      setImages(imageUrls);
    } catch (error: any) {
      console.error('Error loading images:', error);
      Alert.alert('Error', error.message || 'No se pudieron cargar las imágenes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadImages();
  };

  const confirmDelete = (imageUrl: string) => {
    Alert.alert(
      'Eliminar imagen',
      'Esta acción eliminará el archivo en Supabase Storage (y el registro público si existe). ¿Deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleDelete(imageUrl),
        },
      ]
    );
  };

  const handleDelete = async (imageUrl: string) => {
    try {
      setDeletingUrl(imageUrl);
      await deleteImageByUrl(imageUrl);
      await loadImages();
      Alert.alert('Eliminada', 'La imagen se eliminó correctamente.');
    } catch (error: any) {
      console.error('Error deleting image:', error);
      Alert.alert('Error', error.message || 'No se pudo eliminar la imagen');
    } finally {
      setDeletingUrl(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B2838" />
          <Text style={styles.loadingText}>Cargando imágenes...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>Galería</Text>
        <Text style={styles.subtitle}>
          {images.length === 0
            ? 'No hay imágenes subidas aún. Sube tu primera imagen en la pestaña "Subir".'
            : `${images.length} imagen${images.length !== 1 ? 'es' : ''} subida${images.length !== 1 ? 's' : ''}`}
        </Text>

        {images.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📷</Text>
            <Text style={styles.emptyMessage}>
              Aún no has subido ninguna imagen
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {images.map((imageUrl, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {isContributor && (
                  <TouchableOpacity
                    style={styles.deleteChip}
                    onPress={() => confirmDelete(imageUrl)}
                    disabled={deletingUrl === imageUrl}
                  >
                    {deletingUrl === imageUrl ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.deleteChipText}>Eliminar</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ))}
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
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7174',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B2838',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7174',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteChip: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  deleteChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyMessage: {
    fontSize: 18,
    color: '#6B7174',
    textAlign: 'center',
  },
});
