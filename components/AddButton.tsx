import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

type AddButtonProps = {
  onPress: () => void;
};

export function AddButton({ onPress }: AddButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor: theme.colors.primaryContainer }]}
    >
      <Text style={[styles.plus, { color: theme.colors.tertiary }]}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  plus: {
    fontSize: 36,
    lineHeight: 40,
  },
});
