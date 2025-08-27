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
import IngredientRow from '@/components/IngredientRow';

export default function MyIngredientsScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        setLoading(true);
        const data = await getIngredientsInBar();
        if (isActive) {
          setIngredients(data);
          setLoading(false);
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
    await setIngredientInBar(id, updated);
    setIngredients((prev) =>
      updated
        ? prev.map((i) => (i.id === id ? { ...i, inBar: updated } : i))
        : prev.filter((i) => i.id !== id)
    );
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

