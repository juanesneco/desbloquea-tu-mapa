// Mapas screen - shows the 5 maps

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function MapasScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Los 5 Mapas</Text>
        <Text style={styles.subtitle}>
          Los territorios de autoconocimiento
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mental</Text>
          <Text style={styles.sectionText}>
            Pensamientos, creencias, código mental. Liberar la mente del ruido.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Físico</Text>
          <Text style={styles.sectionText}>
            Cuerpo, energía, presencia somática. Reconectar con el cuerpo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Familiar</Text>
          <Text style={styles.sectionText}>
            Relaciones, raíces, patrones heredados. Honrar las raíces.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financiero</Text>
          <Text style={styles.sectionText}>
            Valor, abundancia, propósito materializado. Transformar relación con dinero.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emocional</Text>
          <Text style={styles.sectionText}>
            Sentimientos, estados emocionales, inteligencia emocional. Reconocer y nombrar emociones.
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

