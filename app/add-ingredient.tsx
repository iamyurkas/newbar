import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Stack, useRouter } from 'expo-router';
import { useTheme } from 'react-native-paper';
import IngredientHeader from '@/components/IngredientHeader';

import {
  addIngredient,
  getBaseIngredients,
  type Ingredient,
} from '@/storage/ingredientsStorage';
import { getAllTags, type IngredientTag } from '@/storage/ingredientTagsStorage';

export default function AddIngredientScreen() {
  const router = useRouter();
  const theme = useTheme();
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
      const tagsFromDb = await getAllTags();
      setAvailableTags(tagsFromDb);
      const otherTag = tagsFromDb.find((t) => t.name === 'other');
      if (otherTag) {
        setTags([otherTag]);
      }
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
    <>
      <Stack.Screen
        options={{ header: () => <IngredientHeader title="Add ingredient" /> }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Name:</Text>
        <TextInput
          placeholder="e.g. Lemon juice"
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            {
              height: INPUT_HEIGHT,
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
            },
          ]}
          placeholderTextColor={theme.colors.placeholder}
        />

        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Photo:</Text>
        <TouchableOpacity
          style={[styles.imageButton, { backgroundColor: photoUri ? theme.colors.surface : theme.colors.placeholder }]}
          onPress={pickImage}
        >
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <Text
              style={[styles.imagePlaceholder, { color: theme.colors.onSurfaceVariant }]}
            >
              Tap to select image
            </Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Tags:</Text>
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

        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Add Tag:</Text>
        <View style={styles.tagContainer}>
          {availableTags
            .filter((t) => !tags.some((tag) => tag.id === t.id))
            .map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[styles.tag, { backgroundColor: tag.color }]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={styles.tagText}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
        </View>

        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Base Ingredient:</Text>
        <TouchableOpacity
          style={[
            styles.input,
            {
              height: INPUT_HEIGHT,
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface,
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}
          onPress={() => setBaseModalVisible(true)}
        >
          {baseIngredient ? (
            <View style={styles.baseFieldContent}>
              {baseIngredient.photoUri ? (
                <Image
                  source={{ uri: baseIngredient.photoUri }}
                  style={styles.baseFieldImage}
                />
              ) : (
                <View
                  style={[
                    styles.baseFieldImage,
                    styles.baseImagePlaceholder,
                    { backgroundColor: theme.colors.placeholder },
                  ]}
                />
              )}
              <Text style={{ color: theme.colors.onBackground }}>
                {baseIngredient.name}
              </Text>
            </View>
          ) : (
            <Text style={{ color: theme.colors.placeholder }}>
              Base ingredient (optional)
            </Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Description:</Text>
        <TextInput
          placeholder="Optional description"
          value={description}
          onChangeText={setDescription}
          style={[
            styles.input,
            {
              height: INPUT_HEIGHT * 2,
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
            },
          ]}
          placeholderTextColor={theme.colors.placeholder}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveText, { color: theme.colors.onPrimary }]}>Save Ingredient</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={baseModalVisible} animationType="slide">
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <TextInput
            placeholder="Search"
            value={baseSearch}
            onChangeText={setBaseSearch}
            style={[
              styles.input,
              {
                borderColor: theme.colors.outline,
                backgroundColor: theme.colors.surface,
                color: theme.colors.onSurface,
              },
            ]}
            placeholderTextColor={theme.colors.placeholder}
          />
          <ScrollView style={{ marginTop: 16 }}>
            <TouchableOpacity
              style={styles.baseItem}
              onPress={() => {
                setBaseIngredient(null);
                setBaseModalVisible(false);
              }}
            >
              <View
                style={[
                  styles.baseImage,
                  styles.baseImagePlaceholder,
                  { backgroundColor: theme.colors.placeholder },
                ]}
              />
              <Text style={[styles.baseName, { color: theme.colors.onSurface }]}>None</Text>
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
                      style={[
                        styles.baseImage,
                        styles.baseImagePlaceholder,
                        { backgroundColor: theme.colors.placeholder },
                      ]}
                    />
                  )}
                  <Text style={[styles.baseName, { color: theme.colors.onSurface }]}>
                    {b.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
          <TouchableOpacity
            style={[
              styles.saveButton,
              { marginTop: 16, backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setBaseModalVisible(false)}
          >
            <Text style={[styles.saveText, { color: theme.colors.onPrimary }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
    </>
  );
}

const IMAGE_SIZE = 150;
const BASE_IMAGE_SIZE = 40;
const BASE_FIELD_IMAGE_SIZE = 36;
const INPUT_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
  },
  imageButton: {
    marginTop: 8,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    textAlign: 'center',
    paddingHorizontal: 10,
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
  baseImagePlaceholder: {},
  baseName: {
    fontSize: 16,
  },
  baseFieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  baseFieldImage: {
    width: BASE_FIELD_IMAGE_SIZE,
    height: BASE_FIELD_IMAGE_SIZE,
    borderRadius: 8,
    marginRight: 8,
  },
  saveButton: {
    marginTop: 24,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  saveText: {
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 24,
  },
});
