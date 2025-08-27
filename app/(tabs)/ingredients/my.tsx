import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  getIngredientsInBar,
  setIngredientInBar,
  type Ingredient,
} from '@/storage/ingredientsStorage';
import { getAllCocktails, type Cocktail } from '@/storage/cocktailsStorage';
import {
  calculateIngredientUsage,
  type IngredientUsage,
} from '@/utils/ingredientUsage';
import {
  getIngredientsCache,
  setIngredientsCache,
} from '@/storage/ingredientsCache';
import IngredientRow from '@/components/IngredientRow';

export default function MyIngredientsScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [usage, setUsage] = useState<Record<number, IngredientUsage>>({});
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        const cached = getIngredientsCache('my');
        const cocktailsData = await getAllCocktails();
        setCocktails(cocktailsData);
        if (cached) {
          setIngredients(cached);
          setUsage(
            calculateIngredientUsage(
              cocktailsData,
              new Set(cached.map((i) => i.id))
            )
          );
          setLoading(false);
        } else {
          setLoading(true);
          const data = await getIngredientsInBar();
          if (isActive) {
            setIngredients(data);
            setUsage(
              calculateIngredientUsage(
                cocktailsData,
                new Set(data.map((i) => i.id))
              )
            );
            setIngredientsCache('my', data);
            setLoading(false);
          }
        }
      };

      load();

      return () => {
        isActive = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#4DABF7" />
        <Text style={{ marginTop: 12 }}>Loading ingredients...</Text>
      </View>
    );
  }

  const toggleInBar = async (id: number) => {
    const ingredient = ingredients.find((i) => i.id === id);
    if (!ingredient) {
      return;
    }
    const updated = !ingredient.inBar;
    const newList = updated
      ? ingredients.map((i) => (i.id === id ? { ...i, inBar: updated } : i))
      : ingredients.filter((i) => i.id !== id);
    setIngredients(newList);
    await setIngredientInBar(id, updated);
    setIngredientsCache('my', newList);
    setUsage(
      calculateIngredientUsage(
        cocktails,
        new Set(newList.map((i) => i.id))
      )
    );
  };

  const renderItem = ({ item }: { item: Ingredient }) => (
    <IngredientRow
      id={item.id}
      name={item.name}
      photoUri={item.photoUri}
      tags={item.tags}
      usageCount={usage[item.id]?.count || 0}
      singleCocktailName={usage[item.id]?.singleName}
      showMake
      inBar={item.inBar}
      inShoppingList={item.inShoppingList}
      baseIngredientId={item.baseIngredientId}
      onPress={() => router.push(`/ingredient/${item.id}`)}
      onToggleInBar={toggleInBar}
    />
  );

  return (
    <FlatList
      data={ingredients}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ListEmptyComponent={() => (
        <View style={styles.centerContent}>
          <Text>Your bar is empty.</Text>
        </View>
      )}
      ListFooterComponent={() => <View style={{ height: 80 }} />}
    />
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

