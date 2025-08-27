import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import IngredientHeader from '@/components/IngredientHeader';
import {
  getIngredientById,
  getBrandedIngredients,
  unlinkBaseIngredient,
  setIngredientInBar,
  setIngredientInShoppingList,
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

  const handleUnlinkBranded = (branded: Ingredient) => {
    Alert.alert(
      'Unlink',
      `Remove link for "${branded.name}" from this base ingredient?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            await unlinkBaseIngredient(branded.id);
            setBrandedIngredients((prev) =>
              prev.filter((b) => b.id !== branded.id)
            );
          },
        },
      ]
    );
  };

  const handleUnlinkBase = () => {
    if (ingredient && baseIngredient) {
      Alert.alert(
        'Unlink',
        `Remove link to base ingredient ${baseIngredient.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'OK',
            onPress: async () => {
              await unlinkBaseIngredient(ingredient.id);
              setIngredient({ ...ingredient, baseIngredientId: null });
              setBaseIngredient(null);
              setBrandedIngredients([]);
            },
          },
        ]
      );
    }
  };

  const handleToggleInBar = async () => {
    if (ingredient) {
      const newValue = !ingredient.inBar;
      await setIngredientInBar(ingredient.id, newValue);
      setIngredient({ ...ingredient, inBar: newValue });
    }
  };

  const handleToggleShoppingList = async () => {
    if (ingredient) {
      const newValue = !ingredient.inShoppingList;
      await setIngredientInShoppingList(ingredient.id, newValue);
      setIngredient({ ...ingredient, inShoppingList: newValue });
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
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={handleToggleShoppingList}>
            <MaterialIcons
              name={
                ingredient.inShoppingList ? 'shopping-cart' : 'add-shopping-cart'
              }
              size={24}
              color={
                ingredient.inShoppingList
                  ? theme.colors.primary
                  : theme.colors.onSurfaceVariant
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkboxIcon}
            onPress={handleToggleInBar}
          >
            <MaterialIcons
              name={
                ingredient.inBar ? 'check-circle' : 'radio-button-unchecked'
              }
              size={24}
              color={
                ingredient.inBar
                  ? theme.colors.primary
                  : theme.colors.onSurfaceVariant
              }
            />
          </TouchableOpacity>
        </View>
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
            <TouchableOpacity
              style={[styles.brandedRow, { borderColor: theme.colors.outline }]}
              onPress={() => router.push(`/ingredient/${baseIngredient.id}`)}
            >
              <View style={styles.baseContainer}>
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
              </View>
              <View style={styles.rowRight}>
                <TouchableOpacity
                  style={styles.unlinkButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleUnlinkBase();
                  }}
                >
                  <MaterialIcons name="link-off" size={20} color={theme.colors.error} />
                </TouchableOpacity>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                  style={styles.arrowIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
        {!ingredient.baseIngredientId && brandedIngredients.length > 0 && (
          <View style={styles.baseSection}>
            <Text style={[styles.baseLabel, { color: theme.colors.onSurface }]}>Branded ingredients:</Text>
            <View
              style={[styles.brandedBlock, { borderColor: theme.colors.outline }]}
            >
              {brandedIngredients.map((b, idx) => (
                <TouchableOpacity
                  key={b.id}
                  style={[
                    styles.brandedItemRow,
                    idx < brandedIngredients.length - 1 && {
                      borderBottomWidth: 1,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  onPress={() => router.push(`/ingredient/${b.id}`)}
                >
                  <View style={styles.baseContainer}>
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
                  </View>
                  <View style={styles.rowRight}>
                    <TouchableOpacity
                      style={styles.unlinkButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleUnlinkBranded(b);
                      }}
                    >
                      <MaterialIcons name="link-off" size={20} color={theme.colors.error} />
                    </TouchableOpacity>
                    <MaterialIcons
                      name="chevron-right"
                      size={20}
                      color={theme.colors.onSurfaceVariant}
                      style={styles.arrowIcon}
                    />
                  </View>
                </TouchableOpacity>
              ))}
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
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  brandedBlock: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  brandedItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginLeft: 4,
  },
  unlinkButton: {
    padding: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  checkboxIcon: {
    marginLeft: 16,
  },
});
