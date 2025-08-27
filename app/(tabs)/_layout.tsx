import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Platform, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { HapticTab } from '@/components/HapticTab';
import HeaderWithSearch from '@/components/HeaderWithSearch';
import GeneralMenu from '@/components/GeneralMenu';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const { colors } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HeaderWithSearch
        onMenu={() => setMenuOpen(true)}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: { backgroundColor: colors.surface },
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
      <GeneralMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
