import React, { useState, useCallback, useEffect } from 'react';
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
  getAllIngredients,
  setIngredientInBar,
  type Ingredient,
} from '@/storage/ingredientsStorage';
import { getAllCocktails, type Cocktail } from '@/storage/cocktailsStorage';
import { type IngredientUsage } from '@/utils/ingredientUsage';
import { calculateIngredientUsageAsync } from '@/utils/calculateIngredientUsageAsync';
import {
  getIngredientsCache,
  setIngredientsCache,
} from '@/storage/ingredientsCache';
import IngredientRow from '@/components/IngredientRow';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function AllIngredientsScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [barIds, setBarIds] = useState<Set<number>>(new Set());
  const [usage, setUsage] = useState<Record<number, IngredientUsage>>({});
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(
    null
  );
  const router = useRouter();

  const computeUsage = useCallback(
    () => calculateIngredientUsageAsync(cocktails, barIds),
    [cocktails, barIds]
  );

  useEffect(() => {
    let active = true;
    InteractionManager.runAfterInteractions(() => {
      computeUsage().then((map) => {
        if (active) {
          setUsage(map);
        }
      });
    });
    return () => {
      active = false;
    };
  }, [computeUsage]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        const cached = getIngredientsCache('all');
        const cocktailsData = await getAllCocktails();
        setCocktails(cocktailsData);
        if (cached) {
          setIngredients(cached);
          setBarIds(
            new Set(cached.filter((i) => i.inBar).map((i) => i.id))
          );
          setLoading(false);
        } else {
          setLoading(true);
          const data = await getAllIngredients();
          if (isActive) {
            setIngredients(data);
            setBarIds(
              new Set(data.filter((i) => i.inBar).map((i) => i.id))
            );
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

  const toggleInBar = (id: number) => {
    const ingredient = ingredients.find((i) => i.id === id);
    if (!ingredient) {
      return;
    }
    const updated = !ingredient.inBar;
    const prevList = ingredients;
    const prevBarIds = new Set(barIds);
    const newList = ingredients.map((i) =>
      i.id === id ? { ...i, inBar: updated } : i
    );
    const newBarIds = new Set(barIds);
    if (updated) {
      newBarIds.add(id);
    } else {
      newBarIds.delete(id);
    }
    setIngredients(newList);
    setIngredientsCache('all', newList);
    setBarIds(newBarIds);
    setIngredientInBar(id, updated).catch(() => {
      setIngredients(prevList);
      setIngredientsCache('all', prevList);
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
      showMake={false}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
