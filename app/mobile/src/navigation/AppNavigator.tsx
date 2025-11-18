// Simple navigation with 2 tabs: Fases and Mapas
// TO REMOVE NAVIGATION: Comment out AppNavigator import in App.tsx and uncomment the simple version

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FasesScreen from '../screens/FasesScreen';
import MapasScreen from '../screens/MapasScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Fases" 
          component={FasesScreen}
          options={{
            title: 'Fases',
            tabBarLabel: 'Fases',
          }}
        />
        <Tab.Screen 
          name="Mapas" 
          component={MapasScreen}
          options={{
            title: 'Mapas',
            tabBarLabel: 'Mapas',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
