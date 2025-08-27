import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import IngredientList from '@/components/IngredientList';
import { AddButton } from '@/components/AddButton';

export default function AllIngredientsScreen() {
  const router = useRouter();
  return (
    <ThemedView style={{ flex: 1 }}>
      <IngredientList />
      <AddButton onPress={() => router.push('/ingredients/create')} />
    </ThemedView>
  );
}
