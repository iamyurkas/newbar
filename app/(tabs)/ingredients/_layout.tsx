import { withLayoutContext } from 'expo-router';
// eslint-disable-next-line import/no-unresolved
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';

const { Navigator } = createMaterialTopTabNavigator();

export const Tabs = withLayoutContext(Navigator);

export default function IngredientsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="all" options={{ title: 'All' }} />
      <Tabs.Screen name="my" options={{ title: 'My' }} />
      <Tabs.Screen name="shopping" options={{ title: 'Shopping' }} />
    </Tabs>
  );
}
