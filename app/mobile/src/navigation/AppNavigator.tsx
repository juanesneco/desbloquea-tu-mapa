// Navigation with tabs: Fases, Mapas, Upload, and Gallery

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import FasesScreen from '../screens/FasesScreen';
import MapasScreen from '../screens/MapasScreen';
import UploadScreen from '../screens/UploadScreen';
import GalleryScreen from '../screens/GalleryScreen';
import { useAuthContext } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { signOut, user } = useAuthContext();
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#1B2838',
          tabBarInactiveTintColor: '#6B7174',
          headerStyle: {
            backgroundColor: '#E8E6E3',
          },
          headerTintColor: '#1B2838',
          headerRight: () => (
            <TouchableOpacity
              onPress={signOut}
              style={{ marginRight: 16 }}
              accessibilityRole="button"
            >
              <Text style={{ color: '#1B2838', fontWeight: '600' }}>Salir</Text>
            </TouchableOpacity>
          ),
          headerTitleStyle: { fontWeight: '700' },
          headerTitle: user?.email || 'Desbloquea tu Mapa',
        }}
      >
        <Tab.Screen 
          name="Fases" 
          component={FasesScreen}
          options={{
            title: 'Fases',
            tabBarLabel: 'Fases',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="layers-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Mapas" 
          component={MapasScreen}
          options={{
            title: 'Mapas',
            tabBarLabel: 'Mapas',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Upload" 
          component={UploadScreen}
          options={{
            title: 'Subir Imagen',
            tabBarLabel: 'Subir',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Gallery" 
          component={GalleryScreen}
          options={{
            title: 'Galería',
            tabBarLabel: 'Galería',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="images-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
