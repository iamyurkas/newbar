import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// eslint-disable-next-line import/no-unresolved
import { useTheme } from 'react-native-paper';

interface GeneralMenuProps {
  onMenuPress?: () => void;
}

export default function GeneralMenu({ onMenuPress }: GeneralMenuProps) {
  const { colors } = useTheme();

  const tintColor = colors.primary;
  const iconColor = colors.onSurfaceVariant;
  const textColor = colors.onSurface;
  const backgroundColor = colors.background;

  return (
    <View style={[styles.container, { backgroundColor }]}> 
      <Pressable onPress={onMenuPress}>
        <MaterialIcons name="menu" size={24} color={tintColor} />
      </Pressable>
      <TextInput
        placeholder="Search"
        placeholderTextColor={iconColor}
        style={[styles.input, { borderColor: iconColor, color: textColor }]} 
      />
      <Pressable onPress={() => {}}>
        <MaterialIcons name="filter-list" size={24} color={tintColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
});

