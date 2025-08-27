import React from 'react';
import { View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { withLayoutContext } from 'expo-router';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const { Navigator } = createBottomTabNavigator();

export const Tabs = withLayoutContext(Navigator);

export default function IngredientsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#4DABF7',
          tabBarInactiveTintColor: '#888',
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof MaterialIcons.glyphMap;
            if (route.name === 'all') iconName = 'list';
            else if (route.name === 'my') iconName = 'check-circle';
            else if (route.name === 'shopping') iconName = 'shopping-cart';
            else iconName = 'add-circle-outline';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="all" options={{ title: 'All' }} />
        <Tabs.Screen name="my" options={{ title: 'My' }} />
        <Tabs.Screen name="shopping" options={{ title: 'Shopping' }} />
        <Tabs.Screen
          name="create"
          options={{ title: 'Create' }}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('create', { screen: 'index' });
            },
          })}
        />
      </Tabs>
    </View>
  );
}
