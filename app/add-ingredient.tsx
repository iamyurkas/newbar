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
  Modal,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import * as ImagePicker from 'expo-image-picker';

import { useRouter } from 'expo-router';

import { getAllTags, type IngredientTag } from '@/storage/ingredientTagsStorage';
import { INGREDIENT_TAGS } from '@/constants/IngredientTags';
import {
  addIngredient,
  getBaseIngredients,
  type Ingredient,
} from '@/storage/ingredientsStorage';

export default function AddIngredientScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [tags, setTags] = useState<IngredientTag[]>([]);
  const [availableTags, setAvailableTags] = useState<IngredientTag[]>([]);
  const [baseIngredient, setBaseIngredient] = useState<Ingredient | null>(null);
  const [baseIngredients, setBaseIngredients] = useState<Ingredient[]>([]);
  const [baseSearch, setBaseSearch] = useState('');
  const [baseModalVisible, setBaseModalVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      const custom = await getAllTags();
      setAvailableTags([...INGREDIENT_TAGS, ...custom]);
      const bases = await getBaseIngredients();
      setBaseIngredients(bases);
    };
    load();
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Please enter a name for the ingredient.');
      return;
    }
    const id = Date.now();
    await addIngredient({
      id,
      name: name.trim(),
      description,
      photoUri,
      tags,
      baseIngredientId: baseIngredient?.id,
    });
    router.replace('/ingredients/all');
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
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.image} />
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

        <Text style={styles.label}>Base Ingredient:</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setBaseModalVisible(true)}
        >
          <Text>
            {baseIngredient ? baseIngredient.name : 'Optional'}
          </Text>
        </TouchableOpacity>

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

      <Modal visible={baseModalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 24, backgroundColor: 'white' }}>
          <TextInput
            placeholder="Search"
            value={baseSearch}
            onChangeText={setBaseSearch}
            style={styles.input}
          />
          <ScrollView style={{ marginTop: 16 }}>
            <TouchableOpacity
              style={styles.baseItem}
              onPress={() => {
                setBaseIngredient(null);
                setBaseModalVisible(false);
              }}
            >
              <View style={[styles.baseImage, styles.baseImagePlaceholder]} />
              <Text style={styles.baseName}>None</Text>
            </TouchableOpacity>

            {baseIngredients
              .filter((b) =>
                b.name.toLowerCase().includes(baseSearch.toLowerCase())
              )
              .map((b) => (
                <TouchableOpacity
                  key={b.id}
                  style={styles.baseItem}
                  onPress={() => {
                    setBaseIngredient(b);
                    setBaseModalVisible(false);
                  }}
                >
                  {b.photoUri ? (
                    <Image source={{ uri: b.photoUri }} style={styles.baseImage} />
                  ) : (
                    <View
                      style={[styles.baseImage, styles.baseImagePlaceholder]}
                    />
                  )}
                  <Text style={styles.baseName}>{b.name}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
          <TouchableOpacity
            style={[styles.saveButton, { marginTop: 16 }]}
            onPress={() => setBaseModalVisible(false)}
          >
            <Text style={styles.saveText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const IMAGE_SIZE = 120;
const BASE_IMAGE_SIZE = 40;

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
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    resizeMode: 'cover',
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
  baseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  baseImage: {
    width: BASE_IMAGE_SIZE,
    height: BASE_IMAGE_SIZE,
    borderRadius: 8,
    marginRight: 12,
  },
  baseImagePlaceholder: {
    backgroundColor: '#eee',
  },
  baseName: {
    fontSize: 16,
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
