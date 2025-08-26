import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';

const { Navigator } = createMaterialTopTabNavigator();

export const Tabs = withLayoutContext(Navigator);

export default function CocktailsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="all" options={{ title: 'All' }} />
      <Tabs.Screen name="my" options={{ title: 'My' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
    </Tabs>
  );
}
