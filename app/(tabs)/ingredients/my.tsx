import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
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
import ConfirmDialog from '@/components/ConfirmDialog';

export default function MyIngredientsScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [barIds, setBarIds] = useState<Set<number>>(new Set());
  const [usage, setUsage] = useState<Record<number, IngredientUsage>>({});
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(
    null
  );
  const router = useRouter();

  const computeUsage = useMemo(
    () => () => calculateIngredientUsage(cocktails, barIds),
    [cocktails, barIds]
  );

  useEffect(() => {
    let active = true;
    InteractionManager.runAfterInteractions(() => {
      if (active) {
        setUsage(computeUsage());
      }
    });
    return () => {
      active = false;
    };
  }, [computeUsage]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        const cached = getIngredientsCache('my');
        const cocktailsData = await getAllCocktails();
        setCocktails(cocktailsData);
        if (cached) {
          setIngredients(cached);
          setBarIds(new Set(cached.map((i) => i.id)));
          setLoading(false);
        } else {
          setLoading(true);
          const data = await getIngredientsInBar();
          if (isActive) {
            setIngredients(data);
            setBarIds(new Set(data.map((i) => i.id)));
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

  const toggleInBar = (id: number) => {
    const ingredient = ingredients.find((i) => i.id === id);
    if (!ingredient) {
      return;
    }
    const updated = !ingredient.inBar;
    const prevList = ingredients;
    const prevBarIds = new Set(barIds);
    const newList = updated
      ? ingredients.map((i) => (i.id === id ? { ...i, inBar: updated } : i))
      : ingredients.filter((i) => i.id !== id);
    const newBarIds = new Set(barIds);
    if (updated) {
      newBarIds.add(id);
    } else {
      newBarIds.delete(id);
    }
    setIngredients(newList);
    setIngredientsCache('my', newList);
    setBarIds(newBarIds);
    setIngredientInBar(id, updated).catch(() => {
      setIngredients(prevList);
      setIngredientsCache('my', prevList);
      setBarIds(prevBarIds);
      setAlert({
        title: 'Error',
        message: 'Failed to update ingredient in bar.',
      });
    });
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
    <>
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
      <ConfirmDialog
        visible={alert !== null}
        title={alert?.title ?? ''}
        message={alert?.message ?? ''}
        onConfirm={() => setAlert(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

