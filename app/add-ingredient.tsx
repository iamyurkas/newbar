import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import * as ImagePicker from 'expo-image-picker';
// eslint-disable-next-line import/no-unresolved
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';

import { getAllTags, type IngredientTag } from '@/storage/ingredientTagsStorage';
import { INGREDIENT_TAGS } from '@/constants/IngredientTags';
import { addIngredient } from '@/storage/ingredientsStorage';

export default function AddIngredientScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(
    null
  );
  const [tags, setTags] = useState<IngredientTag[]>([]);
  const [availableTags, setAvailableTags] = useState<IngredientTag[]>([]);

  useEffect(() => {
    const loadTags = async () => {
      const custom = await getAllTags();
      setAvailableTags([...INGREDIENT_TAGS, ...custom]);
    };
    loadTags();
  }, []);

  const toggleTag = (tag: IngredientTag) => {
    if (tags.find((t) => t.id === tag.id)) {
      setTags(tags.filter((t) => t.id !== tag.id));
    } else {
      setTags([...tags, tag]);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow access to media library');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      const resize =
        asset.width && asset.height
          ? asset.width > asset.height
            ? { width: MAX_IMAGE_DIMENSION }
            : { height: MAX_IMAGE_DIMENSION }
          : { width: MAX_IMAGE_DIMENSION };
      const resized = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setPhotoUri(resized.uri);
      setImageSize({ width: resized.width, height: resized.height });
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Please enter a name for the ingredient.');
      return;
    }
    const id = Date.now();
    await addIngredient({ id, name: name.trim(), description, photoUri, tags });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          placeholder="e.g. Lemon juice"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Photo:</Text>
        <TouchableOpacity
          style={[styles.imageButton, imageSize && { width: imageSize.width, height: imageSize.height }]}
          onPress={pickImage}
        >
          {photoUri && imageSize ? (
            <Image
              source={{ uri: photoUri }}
              style={{ width: imageSize.width, height: imageSize.height, resizeMode: 'contain' }}
            />
          ) : (
            <Text style={styles.imagePlaceholder}>Tap to select image</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Tags:</Text>
        <View style={styles.tagContainer}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={[styles.tag, { backgroundColor: tag.color }]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={styles.tagText}>{tag.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Add Tag:</Text>
        <View style={styles.tagContainer}>
          {availableTags
            .filter((t) => !tags.some((tag) => tag.id === t.id))
            .map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[styles.tag, { backgroundColor: tag.color }]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={styles.tagText}>+ {tag.name}</Text>
              </TouchableOpacity>
            ))}
        </View>

        <Text style={styles.label}>Description:</Text>
        <TextInput
          placeholder="Optional description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 60 }]}
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Ingredient</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const MAX_IMAGE_DIMENSION = 150;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: 'white',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
  },
  imageButton: {
    marginTop: 8,
    width: MAX_IMAGE_DIMENSION,
    height: MAX_IMAGE_DIMENSION,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  imagePlaceholder: {
    color: '#777',
    textAlign: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  tagText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#4DABF7',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
