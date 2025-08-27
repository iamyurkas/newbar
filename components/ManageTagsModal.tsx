import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { Modal, Portal, Text, Button, TextInput, Chip, useTheme } from 'react-native-paper';

interface ManageTagsModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function ManageTagsModal({ visible, onDismiss }: ManageTagsModalProps) {
  const { colors } = useTheme();
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    const value = tag.trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
    }
    setTag('');
  };

  const handleRemoveTag = (value: string) => {
    setTags(tags.filter((t) => t !== value));
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}> 
        <Text variant="titleMedium" style={styles.title}>
          Manage Ingredients Tags
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            mode="outlined"
            placeholder="New tag"
            value={tag}
            onChangeText={setTag}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAddTag} style={styles.addButton}>
            Add
          </Button>
        </View>
        <View style={styles.tagsContainer}>
          {tags.map((t) => (
            <Chip key={t} onClose={() => handleRemoveTag(t)} style={styles.chip}>
              {t}
            </Chip>
          ))}
        </View>
        <Button onPress={onDismiss} style={styles.closeButton}>
          Close
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  chip: {
    margin: 4,
  },
  closeButton: {
    marginTop: 16,
  },
});
