import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import IngredientHeader from '@/components/IngredientHeader';
import ConfirmDialog from '@/components/ConfirmDialog';

import {
  getBaseIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
  getBrandedIngredients,
  unlinkBaseIngredient,
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
  const [brandedIngredients, setBrandedIngredients] = useState<Ingredient[]>([]);
  const [baseSearch, setBaseSearch] = useState('');
  const [baseModalVisible, setBaseModalVisible] = useState(false);
  const searchRef = useRef<TextInput>(null);
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
      let ing: Ingredient | null = null;
      if (typeof id === 'string') {
        ing = await getIngredientById(Number(id));
      }
      const bases = await getBaseIngredients();
      setBaseIngredients(bases.filter((b) => b.id !== ing?.id));
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
          setBrandedIngredients([]);
        } else {
          const branded = await getBrandedIngredients(ing.id);
          setBrandedIngredients(branded);
          setBaseIngredient(null);
        }
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (baseModalVisible) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [baseModalVisible]);

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

  const handleUnlinkBranded = (branded: Ingredient) => {
    setDialog({
      title: 'Unlink',
      message: `Remove link for "${branded.name}" from this base ingredient?`,
      confirmLabel: 'Unlink',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        await unlinkBaseIngredient(branded.id);
        setBrandedIngredients((prev) =>
          prev.filter((b) => b.id !== branded.id)
        );
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
            style={[
              styles.imageButton,
              {
                backgroundColor: photoUri
                  ? theme.colors.surface
                  : theme.colors.placeholder,
              },
            ]}
            onPress={pickImage}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.image} />
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

          {brandedIngredients.length > 0 ? (
            <>
              <Text
                style={[styles.baseLabel, { color: theme.colors.onSurface }]}
              >
                Branded ingredients:
              </Text>
              <View
                style={[styles.brandedBlock, { borderColor: theme.colors.outline }]}
              >
                {brandedIngredients.map((b, idx) => (
                  <TouchableOpacity
                    key={b.id}
                    style={[
                      styles.brandedItemRow,
                      idx < brandedIngredients.length - 1 && {
                        borderBottomWidth: 1,
                        borderColor: theme.colors.outline,
                      },
                    ]}
                    onPress={() => router.push(`/ingredient/${b.id}`)}
                  >
                    <View style={styles.baseContainer}>
                      {b.photoUri ? (
                        <Image
                          source={{ uri: b.photoUri }}
                          style={styles.baseImage}
                          resizeMode="contain"
                        />
                      ) : (
                        <View
                          style={[
                            styles.baseImage,
                            styles.baseImagePlaceholder,
                            { backgroundColor: theme.colors.placeholder },
                          ]}
                        />
                      )}
                      <Text
                        style={[styles.baseName, { color: theme.colors.onSurface }]}
                      >
                        {b.name}
                      </Text>
                    </View>
                    <View style={styles.rowRight}>
                      <TouchableOpacity
                        style={styles.unlinkButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleUnlinkBranded(b);
                        }}
                      >
                        <MaterialIcons
                          name="link-off"
                          size={20}
                          color={theme.colors.error}
                        />
                      </TouchableOpacity>
                      <MaterialIcons
                        name="chevron-right"
                        size={20}
                        color={theme.colors.onSurfaceVariant}
                        style={styles.arrowIcon}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <>
              <Text
                style={[styles.label, { color: theme.colors.onSurface }]}
              >
                Base Ingredient:
              </Text>
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
                        resizeMode="contain"
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
            </>
          )}

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
      </KeyboardAvoidingView>

      <Modal
        visible={baseModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBaseModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setBaseModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: theme.colors.background },
                ]}
              >
                <TextInput
                  ref={searchRef}
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
                  placeholderTextColor={theme.colors.placeholder}
                />
                <ScrollView
                  style={{ marginTop: 16 }}
                  keyboardShouldPersistTaps="handled"
                >
                  {baseIngredients
                    .filter((b) =>
                      b.name.toLowerCase().includes(baseSearch.toLowerCase())
                    )
                    .map((b) => (
                      <TouchableOpacity
                        key={b.id}
                        style={styles.baseItem}
                        onPress={() => {
                          Keyboard.dismiss();
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
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  baseLabel: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandedBlock: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  brandedItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginLeft: 4,
  },
  unlinkButton: {
    padding: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    flex: 1,
    marginHorizontal: '10%',
    marginTop: 50,
    marginBottom: 10,
    padding: 24,
    borderRadius: 8,
  },
});

