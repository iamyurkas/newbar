import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { HapticTab } from '@/components/HapticTab';
import GeneralMenu from '@/components/GeneralMenu';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <GeneralMenu />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="cocktails"
          options={{
            title: 'Cocktails',
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="local-bar" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="shaker"
          options={{
            title: 'Shaker',
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="science" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ingredients"
          options={{
            title: 'Ingredients',
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="shopping-cart" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
