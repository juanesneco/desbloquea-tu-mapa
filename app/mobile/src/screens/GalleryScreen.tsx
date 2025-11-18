// Simple gallery screen

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Galería</Text>
        <Text style={styles.text}>
          Las imágenes aparecerán aquí.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E6E3',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B2838',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#6B7174',
  },
});
