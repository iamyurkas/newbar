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
        <Text style={[styles.name, { color: theme.colors.onSurface }]}> 
          {ingredient.name}
        </Text>
        {ingredient.photoUri ? (
          <Image
            source={{ uri: ingredient.photoUri }}
            style={styles.image}
          />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Text
              style={[styles.noImageText, { color: theme.colors.onSurfaceVariant }]}
            >
              No image
            </Text>
          </View>
        )}
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
          <View style={styles.baseSection}>
            <Text style={[styles.baseLabel, { color: theme.colors.onSurface }]}> 
              Base ingredient:
            </Text>
            <View style={styles.baseContainer}>
              {baseIngredient.photoUri ? (
                <Image
                  source={{ uri: baseIngredient.photoUri }}
                  style={styles.baseImage}
                />
              ) : (
                <View
                  style={[
                    styles.baseImage,
                    styles.baseImagePlaceholder,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                />
              )}
              <Text
                style={[styles.baseName, { color: theme.colors.onSurface }]}
              >
                {baseIngredient.name}
              </Text>
            </View>
          </View>
        )}
        {ingredient.description ? (
          <Text style={[styles.description, { color: theme.colors.onSurface }]}> 
            {ingredient.description}
          </Text>
        ) : null}
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
    marginTop: 16,
  },
  imagePlaceholder: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  noImageText: {
    fontSize: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
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
  baseSection: {
    marginTop: 24,
  },
  baseLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  baseImage: {
    width: BASE_IMAGE_SIZE,
    height: BASE_IMAGE_SIZE,
    borderRadius: 8,
    marginRight: 12,
  },
  baseImagePlaceholder: {
    borderRadius: 8,
  },
  baseName: {
    fontSize: 16,
  },
});
