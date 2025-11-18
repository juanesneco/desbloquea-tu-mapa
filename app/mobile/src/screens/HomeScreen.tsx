// Simple home screen

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Desbloquea Tu Mapa</Text>
        <Text style={styles.subtitle}>
          La vida es un juego consciente. Aprende a ver el mapa, entender las reglas, y jugar desde tu poder auténtico.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Las 3 Fases</Text>
          <Text style={styles.sectionText}>
            1. Inconsciencia (Dormido){'\n'}
            2. Consciencia (Despertar){'\n'}
            3. Creación (Maestría)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Los 5 Mapas</Text>
          <Text style={styles.sectionText}>
            • Mental{'\n'}
            • Físico{'\n'}
            • Familiar{'\n'}
            • Financiero{'\n'}
            • Emocional
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
