import React from 'react';
import { withLayoutContext } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { Navigator } = createNativeStackNavigator();

export const Stack = withLayoutContext(Navigator);

export default function CreateIngredientLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ title: 'Add Ingredient' }} />
      <Stack.Screen
        name="ingredient-details"
        options={{ title: 'Ingredient Details' }}
      />
      <Stack.Screen name="edit-ingredient" options={{ title: 'Edit Ingredient' }} />
    </Stack>
  );
}
