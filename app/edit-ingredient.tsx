import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
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

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from 'react-native-paper';
import IngredientHeader from '@/components/IngredientHeader';
import ConfirmDialog from '@/components/ConfirmDialog';

import {
  getBaseIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
  type Ingredient,
} from '@/storage/ingredientsStorage';
import { getAllTags, type IngredientTag } from '@/storage/ingredientTagsStorage';

export default function EditIngredientScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [tags, setTags] = useState<IngredientTag[]>([]);
  const [availableTags, setAvailableTags] = useState<IngredientTag[]>([]);
  const [baseIngredient, setBaseIngredient] = useState<Ingredient | null>(null);
  const [baseIngredients, setBaseIngredients] = useState<Ingredient[]>([]);
  const [baseSearch, setBaseSearch] = useState('');
  const [baseModalVisible, setBaseModalVisible] = useState(false);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(
    null
  );
  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);
  const [inBar, setInBar] = useState(false);
  const [inShoppingList, setInShoppingList] = useState(false);

  useEffect(() => {
    const load = async () => {
      const tagsFromDb = await getAllTags();
      setAvailableTags(tagsFromDb);
      const bases = await getBaseIngredients();
      setBaseIngredients(bases);
      if (typeof id === 'string') {
        const ing = await getIngredientById(Number(id));
        if (ing) {
          setName(ing.name);
          setDescription(ing.description ?? '');
          setPhotoUri(ing.photoUri ?? null);
          setTags(ing.tags);
          setInBar(ing.inBar ?? false);
          setInShoppingList(ing.inShoppingList ?? false);
          if (ing.baseIngredientId) {
            const base = bases.find((b) => b.id === ing.baseIngredientId);
            setBaseIngredient(base ?? null);
          }
        }
      }
    };
    load();
  }, [id]);

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
      setAlert({
        title: 'Permission required',
        message: 'Allow access to media library',
      });
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
      setAlert({ title: '', message: 'Please enter a name for the ingredient.' });
      return;
    }
    if (typeof id === 'string') {
      await updateIngredient({
        id: Number(id),
        name: name.trim(),
        description,
        photoUri,
        tags,
        baseIngredientId: baseIngredient?.id,
        inBar,
        inShoppingList,
      });
      router.replace(`/ingredient/${id}`);
    }
  };

  const confirmDelete = () => {
    setDialog({
      title: 'Delete',
      message: 'Delete this ingredient?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        if (typeof id === 'string') {
          await deleteIngredient(Number(id));
          router.replace('/ingredients/all');
        }
      },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <IngredientHeader title="Edit ingredient" onDelete={confirmDelete} />
          ),
        }}
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
                borderColor: theme.colors.outline,
                color: theme.colors.onSurface,
                backgroundColor: theme.colors.surface,
              },
            ]}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Description:</Text>
          <TextInput
            placeholder="Optional"
            value={description}
            onChangeText={setDescription}
            style={[
              styles.input,
              {
                borderColor: theme.colors.outline,
                color: theme.colors.onSurface,
                backgroundColor: theme.colors.surface,
              },
            ]}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
          <TouchableOpacity
            style={[styles.imageButton, { backgroundColor: theme.colors.surface }]}
            onPress={pickImage}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.image} />
            ) : (
              <Text
                style={[styles.imagePlaceholder, { color: theme.colors.onSurfaceVariant }]}
              >
                Pick image
              </Text>
            )}
          </TouchableOpacity>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Tags:</Text>
          <View style={styles.tagContainer}>
            {availableTags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tag,
                  {
                    backgroundColor: tags.find((t) => t.id === tag.id)
                      ? theme.colors.primary
                      : theme.colors.surfaceVariant,
                  },
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text
                  style={[
                    styles.tagText,
                    {
                      color: tags.find((t) => t.id === tag.id)
                        ? theme.colors.onPrimary
                        : theme.colors.onSurface,
                    },
                  ]}
                >
                  {tag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Base ingredient:</Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                borderColor: theme.colors.outline,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.colors.surface,
              },
            ]}
            onPress={() => setBaseModalVisible(true)}
          >
            {baseIngredient?.photoUri ? (
              <Image
                source={{ uri: baseIngredient.photoUri }}
                style={styles.baseFieldImage}
              />
            ) : baseIngredient ? (
              <View
                style={[
                  styles.baseFieldImage,
                  { backgroundColor: theme.colors.placeholder },
                ]}
              />
            ) : null}
            <Text
              style={[
                styles.baseName,
                {
                  color: baseIngredient
                    ? theme.colors.onSurface
                    : theme.colors.onSurfaceVariant,
                },
              ]}
            >
              {baseIngredient ? baseIngredient.name : 'Select base'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { marginTop: 24, backgroundColor: theme.colors.primary },
            ]}
            onPress={handleSave}
          >
            <Text style={[styles.saveText, { color: theme.colors.onPrimary }]}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={baseModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setBaseModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}
        >
          <TextInput
            placeholder="Search"
            value={baseSearch}
            onChangeText={setBaseSearch}
            style={[
              styles.input,
              {
                borderColor: theme.colors.outline,
                color: theme.colors.onSurface,
                backgroundColor: theme.colors.surface,
              },
            ]}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
          <ScrollView>
            {baseIngredients
              .filter((b) => b.name.toLowerCase().includes(baseSearch.toLowerCase()))
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

      <ConfirmDialog
        visible={!!alert}
        title={alert?.title ?? ''}
        message={alert?.message ?? ''}
        onConfirm={() => setAlert(null)}
      />
      <ConfirmDialog
        visible={!!dialog}
        title={dialog?.title ?? ''}
        message={dialog?.message ?? ''}
        confirmLabel={dialog?.confirmLabel}
        cancelLabel={dialog?.cancelLabel}
        onConfirm={() => {
          dialog?.onConfirm();
          setDialog(null);
        }}
        onCancel={() => setDialog(null)}
      />
    </>
  );
}

const IMAGE_SIZE = 150;
const BASE_IMAGE_SIZE = 40;
const BASE_FIELD_IMAGE_SIZE = 36;

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

