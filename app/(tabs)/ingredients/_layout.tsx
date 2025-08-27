import { withLayoutContext, useRouter } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { AddButton } from '@/components/AddButton';


const { Navigator } = createMaterialTopTabNavigator();

export const Tabs = withLayoutContext(Navigator);

export default function IngredientsLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs screenOptions={{ tabBarStyle: { backgroundColor: colors.surface } }}>
        <Tabs.Screen name="all" options={{ title: 'All' }} />
        <Tabs.Screen name="my" options={{ title: 'My' }} />
        <Tabs.Screen name="shopping" options={{ title: 'Shopping' }} />
      </Tabs>
      <AddButton onPress={() => router.push('/add-ingredient')} />
    </View>
  );
}
