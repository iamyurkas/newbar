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
      style={[styles.button, { backgroundColor: theme.colors.tertiary }]}
    >
      <Text style={[styles.plus, { color: theme.colors.onPrimary }]}>+</Text>
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
  },
  plus: {
    fontSize: 40,
    lineHeight: 40,
  },
});
