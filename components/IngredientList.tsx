import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
// eslint-disable-next-line import/no-unresolved
import { useTheme } from 'react-native-paper';

export default function IngredientList() {
  const { colors } = useTheme();
  const data = [
    {
      id: '1',
      name: 'Absinthe',
      cocktails: 6,
      color: colors.primary,
    },
    {
      id: '2',
      name: 'Absolut Citron',
      cocktails: 11,
      color: colors.secondary,
    },
    {
      id: '3',
      name: 'Absolut Vodka',
      cocktails: 11,
      color: colors.tertiary,
    },
  ];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={styles.image}
          />
          <View style={{ flex: 1 }}>
            <ThemedText>{item.name}</ThemedText>
            <ThemedText
              type="default"
              style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
            >
              {item.cocktails} cocktails
            </ThemedText>
          </View>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <View style={[styles.circle, { borderColor: colors.outline }]} />
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
  },
});
