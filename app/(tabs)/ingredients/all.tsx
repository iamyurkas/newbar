import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import IngredientList from '@/components/IngredientList';
// eslint-disable-next-line import/no-unresolved
import { useTheme } from 'react-native-paper';

export default function AllIngredientsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <ThemedView style={{ flex: 1 }}>
      <IngredientList />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/add-ingredient')}
      >
        <MaterialIcons name="add" size={24} color={colors.onPrimary} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
