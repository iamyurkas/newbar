import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import IngredientHeader from '@/components/IngredientHeader';
import { getIngredientById, type Ingredient } from '@/storage/ingredientsStorage';

export default function IngredientViewScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [baseIngredient, setBaseIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    const load = async () => {
      if (typeof id === 'string') {
        const ing = await getIngredientById(Number(id));
        setIngredient(ing);
        if (ing?.baseIngredientId) {
          const base = await getIngredientById(ing.baseIngredientId);
          setBaseIngredient(base);
        }
      }
    };
    load();
  }, [id]);

  if (!ingredient) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}> 
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <IngredientHeader
              title="Edit ingredient"
              onEdit={() => router.push(`/add-ingredient?id=${ingredient.id}`)}
            />
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {ingredient.photoUri && (
          <Image
            source={{ uri: ingredient.photoUri }}
            style={[styles.image]}
          />
        )}
        <Text style={[styles.name, { color: theme.colors.onSurface }]}> 
          {ingredient.name}
        </Text>
        {ingredient.description ? (
          <Text style={[styles.description, { color: theme.colors.onSurface }]}> 
            {ingredient.description}
          </Text>
        ) : null}
        {ingredient.tags.length > 0 && (
          <View style={styles.tagContainer}>
            {ingredient.tags.map((tag) => (
              <View
                key={tag.id}
                style={[styles.tag, { backgroundColor: tag.color }]}
              >
                <Text style={styles.tagText}>{tag.name}</Text>
              </View>
            ))}
          </View>
        )}
        {baseIngredient && (
          <View style={styles.baseContainer}>
            {baseIngredient.photoUri && (
              <Image
                source={{ uri: baseIngredient.photoUri }}
                style={styles.baseImage}
              />
            )}
            <Text style={[styles.baseName, { color: theme.colors.onSurface }]}>
              {baseIngredient.name}
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const IMAGE_SIZE = 150;
const BASE_IMAGE_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  tagText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  baseImage: {
    width: BASE_IMAGE_SIZE,
    height: BASE_IMAGE_SIZE,
    borderRadius: 8,
    marginRight: 12,
  },
  baseName: {
    fontSize: 16,
  },
});
