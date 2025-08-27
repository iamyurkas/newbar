import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function IngredientDetailsScreen() {
  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <ThemedText type="title">Ingredient Details</ThemedText>
    </ThemedView>
  );
}
