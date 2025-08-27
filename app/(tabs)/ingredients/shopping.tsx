import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  getShoppingListIngredients,
  setIngredientInShoppingList,
  type Ingredient,
} from '@/storage/ingredientsStorage';
import {
  getIngredientsCache,
  setIngredientsCache,
} from '@/storage/ingredientsCache';
import IngredientRow from '@/components/IngredientRow';

export default function ShoppingIngredientsScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        const cached = getIngredientsCache('shopping');
        if (cached) {
          setIngredients(cached);
          setLoading(false);
        } else {
          setLoading(true);
          const data = await getShoppingListIngredients();
          if (isActive) {
            setIngredients(data);
            setIngredientsCache('shopping', data);
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

  const handleRemove = async (id: number) => {
    const newList = ingredients.filter((i) => i.id !== id);
    setIngredients(newList);
    await setIngredientInShoppingList(id, false);
    setIngredientsCache('shopping', newList);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DABF7" />
        <Text style={{ marginTop: 12 }}>Loading ingredients...</Text>
      </View>
    );
  }

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
      onRemove={handleRemove}
    />
  );

  return (
    <FlatList
      data={ingredients}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ListEmptyComponent={() => (
        <View style={styles.loadingContainer}>
          <Text>Your shopping list is empty.</Text>
        </View>
      )}
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

