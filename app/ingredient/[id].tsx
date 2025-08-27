import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import IngredientHeader from '@/components/IngredientHeader';
import {
  getIngredientById,
  getBrandedIngredients,
  unlinkBaseIngredient,
  type Ingredient,
} from '@/storage/ingredientsStorage';

export default function IngredientViewScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [baseIngredient, setBaseIngredient] = useState<Ingredient | null>(null);
  const [brandedIngredients, setBrandedIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    const load = async () => {
      if (typeof id === 'string') {
        const ing = await getIngredientById(Number(id));
        setIngredient(ing);
        if (ing?.baseIngredientId) {
          const base = await getIngredientById(ing.baseIngredientId);
          setBaseIngredient(base);
          setBrandedIngredients([]);
        } else if (ing) {
          const branded = await getBrandedIngredients(ing.id);
          setBrandedIngredients(branded);
          setBaseIngredient(null);
        }
      }
    };
    load();
  }, [id]);

  const handleUnlinkBranded = async (brandedId: number) => {
    await unlinkBaseIngredient(brandedId);
    setBrandedIngredients((prev) => prev.filter((b) => b.id !== brandedId));
  };

  const handleUnlinkBase = async () => {
    if (ingredient) {
      await unlinkBaseIngredient(ingredient.id);
      setIngredient({ ...ingredient, baseIngredientId: null });
      setBaseIngredient(null);
      setBrandedIngredients([]);
    }
  };

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
        contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.name, { color: theme.colors.onSurface }]}>{ingredient.name}</Text>
        {ingredient.photoUri ? (
          <Image
            source={{ uri: ingredient.photoUri }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View
            style={[styles.imagePlaceholder, { backgroundColor: theme.colors.placeholder }]}
          >
            <Text style={[styles.noImageText, { color: theme.colors.onSurfaceVariant }]}>No image</Text>
          </View>
        )}
        {ingredient.tags.length > 0 && (
          <View style={styles.tagContainer}>
            {ingredient.tags.map((tag) => (
              <View key={tag.id} style={[styles.tag, { backgroundColor: tag.color }]}>
                <Text style={styles.tagText}>{tag.name}</Text>
              </View>
            ))}
          </View>
        )}
        {ingredient.baseIngredientId && baseIngredient && (
          <View style={styles.baseSection}>
            <Text style={[styles.baseLabel, { color: theme.colors.onSurface }]}>Base ingredient:</Text>
            <View style={styles.brandedRow}>
              <TouchableOpacity
                style={styles.baseContainer}
                onPress={() => router.push(`/ingredient/${baseIngredient.id}`)}
              >
                {baseIngredient.photoUri ? (
                  <Image
                    source={{ uri: baseIngredient.photoUri }}
                    style={styles.baseImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View
                    style={[
                      styles.baseImage,
                      styles.baseImagePlaceholder,
                      { backgroundColor: theme.colors.placeholder },
                    ]}
                  />
                )}
                <Text style={[styles.baseName, { color: theme.colors.onSurface }]}> 
                  {baseIngredient.name}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.unlinkButton} onPress={handleUnlinkBase}>
                <MaterialIcons name="link-off" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {!ingredient.baseIngredientId && (
          <View style={styles.baseSection}>
            <Text style={[styles.baseLabel, { color: theme.colors.onSurface }]}>Branded ingredients:</Text>
            {brandedIngredients.map((b) => (
              <View key={b.id} style={styles.brandedRow}>
                <TouchableOpacity
                  style={styles.baseContainer}
                  onPress={() => router.push(`/ingredient/${b.id}`)}
                >
                  {b.photoUri ? (
                    <Image
                      source={{ uri: b.photoUri }}
                      style={styles.baseImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={[
                        styles.baseImage,
                        styles.baseImagePlaceholder,
                        { backgroundColor: theme.colors.placeholder },
                      ]}
                    />
                  )}
                  <Text style={[styles.baseName, { color: theme.colors.onSurface }]}> 
                    {b.name}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.unlinkButton}
                  onPress={() => handleUnlinkBranded(b.id)}
                >
                  <MaterialIcons name="link-off" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
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
    fontWeight: 'bold',
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
  brandedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  unlinkButton: {
    padding: 8,
  },
});
