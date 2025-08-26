import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useThemeColor } from '@/hooks/useThemeColor';

export default function SearchBar() {
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');

  return (
    <View style={[styles.container, { backgroundColor: background, borderColor: text }]}> 
      <MaterialIcons name="search" size={20} color={text} />
      <TextInput
        placeholder="Search"
        placeholderTextColor={text}
        style={[styles.input, { color: text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 8,
  },
  input: {
    flex: 1,
    marginLeft: 4,
  },
});
