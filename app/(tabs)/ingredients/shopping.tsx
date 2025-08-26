import { ThemedView } from '@/components/ThemedView';
import IngredientList from '@/components/IngredientList';
import { AddButton } from '@/components/AddButton';
import { useRouter } from 'expo-router';

export default function ShoppingIngredientsScreen() {
  const router = useRouter();
  return (
    <ThemedView style={{ flex: 1 }}>
      <IngredientList />
      <AddButton onPress={() => router.push('/add-ingredient')} />
    </ThemedView>
  );
}
