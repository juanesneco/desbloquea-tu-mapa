// Fases screen - shows the 3 phases

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function FasesScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Las 3 Fases</Text>
        <Text style={styles.subtitle}>
          El camino de transformación personal
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Inconsciencia (Dormido)</Text>
          <Text style={styles.sectionText}>
            Vivimos en piloto automático, sin cuestionar nuestros patrones.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Consciencia (Despertar)</Text>
          <Text style={styles.sectionText}>
            Empezamos a observar nuestros pensamientos, emociones y comportamientos.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Creación (Maestría)</Text>
          <Text style={styles.sectionText}>
            Creamos conscientemente nuestra realidad desde nuestro poder auténtico.
          </Text>
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
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B2838',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7174',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1B2838',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#6B7174',
    lineHeight: 24,
  },
});

