import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { View } from 'react-native';

import SearchBar from '@/components/SearchBar';

const { Navigator } = createMaterialTopTabNavigator();

export const Tabs = withLayoutContext(Navigator);

export default function IngredientsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <SearchBar />
      <Tabs>
        <Tabs.Screen name="all" options={{ title: 'All' }} />
        <Tabs.Screen name="my" options={{ title: 'My' }} />
        <Tabs.Screen name="shopping" options={{ title: 'Shopping' }} />
      </Tabs>
    </View>
  );
}
