import { withLayoutContext, useRouter } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { View } from 'react-native';

import { AddButton } from '@/components/AddButton';

const { Navigator } = createMaterialTopTabNavigator();

export const Tabs = withLayoutContext(Navigator);

export default function CocktailsLayout() {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <Tabs>
        <Tabs.Screen name="all" options={{ title: 'All' }} />
        <Tabs.Screen name="my" options={{ title: 'My' }} />
        <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
      </Tabs>
      <AddButton onPress={() => router.push('/add-cocktail')} />
    </View>
  );
}
