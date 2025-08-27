import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function FavoriteCocktailsScreen() {
  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">Favorite Cocktails</ThemedText>
    </ThemedView>
  );
}
