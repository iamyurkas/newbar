import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AddButton } from '@/components/AddButton';

export default function FavoriteCocktailsScreen() {
  const router = useRouter();
  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">Favorite Cocktails</ThemedText>
      <AddButton onPress={() => router.push('/add-cocktail')} />
    </ThemedView>
  );
}
