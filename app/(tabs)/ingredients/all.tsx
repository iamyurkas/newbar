import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  getAllIngredients,
  setIngredientInBar,
  type Ingredient,
} from '@/storage/ingredientsStorage';
import {
  getIngredientsCache,
  setIngredientsCache,
} from '@/storage/ingredientsCache';
import IngredientRow from '@/components/IngredientRow';

export default function AllIngredientsScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        const cached = getIngredientsCache('all');
        if (cached) {
          setIngredients(cached);
          setLoading(false);
        } else {
          setLoading(true);
          const data = await getAllIngredients();
          if (isActive) {
            setIngredients(data);
            setIngredientsCache('all', data);
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
      <View style={styles.loadingContainer}>
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
    const newList = ingredients.map((i) =>
      i.id === id ? { ...i, inBar: updated } : i
    );
    setIngredients(newList);
    await setIngredientInBar(id, updated);
    setIngredientsCache('all', newList);
  };

  const renderItem = ({ item }: { item: Ingredient }) => (
    <IngredientRow
      id={item.id}
      name={item.name}
      photoUri={item.photoUri}
      tags={item.tags}
      usageCount={0}
      showMake={false}
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
      ListFooterComponent={() => <View style={{ height: 80 }} />}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
