import { Button } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function AllIngredientsScreen() {
  const router = useRouter();
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'space-between', padding: 16 }}>
      <ThemedText type="title">All Ingredients</ThemedText>
      <Button title="Add" onPress={() => router.push('/add-ingredient')} />
    </ThemedView>
  );
}
