import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

const HEADER_HEIGHT = 28;

export default function AddIngredientHeader() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
        <MaterialIcons name="arrow-back" size={24} color={theme.colors.onSurface} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>Add ingredient</Text>
      <TouchableOpacity onPress={() => {}} style={styles.iconBtn}>
        <MaterialIcons name="edit" size={24} color={theme.colors.onSurface} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  iconBtn: {
    padding: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});

