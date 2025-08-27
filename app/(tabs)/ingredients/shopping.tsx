import { ThemedView } from '@/components/ThemedView';
import IngredientList from '@/components/IngredientList';

export default function ShoppingIngredientsScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <IngredientList />
    </ThemedView>
  );
}
