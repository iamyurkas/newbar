import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';

const DATA = [
  {
    id: '1',
    name: 'Absinthe',
    cocktails: 6,
    color: '#4CAF50',
  },
  {
    id: '2',
    name: 'Absolut Citron',
    cocktails: 11,
    color: '#FFC107',
  },
  {
    id: '3',
    name: 'Absolut Vodka',
    cocktails: 11,
    color: '#03A9F4',
  },
];

export default function IngredientList() {
  return (
    <FlatList
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={styles.image}
          />
          <View style={{ flex: 1 }}>
            <ThemedText>{item.name}</ThemedText>
            <ThemedText type="default" style={styles.subtitle}>
              {item.cocktails} cocktails
            </ThemedText>
          </View>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <View style={styles.circle} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  subtitle: {
    color: '#888',
    fontSize: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#999',
  },
});
