import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Link } from 'expo-router';

interface GeneralMenuProps {
  visible: boolean;
  onClose: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_WIDTH = SCREEN_WIDTH * 0.75;

export default function GeneralMenu({ visible, onClose }: GeneralMenuProps) {
  const theme = useTheme();
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const [alert, setAlert] = React.useState<{ title: string; message: string } | null>(
    null
  );

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, slideAnim]);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: theme.colors.backdrop,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        },
        menu: {
          height: '100%',
          backgroundColor: theme.colors.background,
          paddingTop: 48,
          paddingHorizontal: 16,
        },
        title: {
          fontSize: 20,
          fontWeight: '600',
          marginBottom: 16,
          color: theme.colors.onSurface,
        },
        linkRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 14,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.outline,
        },
        linkIcon: { marginRight: 8 },
        itemTitle: {
          fontSize: 16,
          color: theme.colors.onSurface,
        },
      }),
    [theme]
  );

  const handleIngredientTags = () => {
    onClose();
    setAlert({ title: 'Ingredient tags', message: 'Tag editor not implemented' });
  };

  const handleCocktailTags = () => {
    onClose();
    setAlert({ title: 'Cocktail tags', message: 'Tag editor not implemented' });
  };

  const handleExportPhotos = () => {
    onClose();
    setAlert({ title: 'Export photos', message: 'Photo export not implemented' });
  };

  const handleExportData = () => {
    onClose();
    setAlert({ title: 'Export data', message: 'Data export not implemented' });
  };

  const handleImportData = () => {
    onClose();
    setAlert({ title: 'Import data', message: 'Data import not implemented' });
  };

  return (
    <>
      <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <Animated.View
            style={[
              styles.menu,
              { width: MENU_WIDTH, transform: [{ translateX: slideAnim }] },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <ScrollView style={{ marginTop: -32 }}>
            <Text style={styles.title}>Main Menu</Text>

            <Link href="/(tabs)/cocktails" asChild>
              <TouchableOpacity
                style={styles.linkRow}
                onPress={onClose}
              >
                <MaterialIcons
                  name="menu-book"
                  size={22}
                  color={theme.colors.primary}
                  style={styles.linkIcon}
                />
                <Text style={styles.itemTitle}>Cocktails</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/(tabs)/shaker" asChild>
              <TouchableOpacity
                style={styles.linkRow}
                onPress={onClose}
              >
                <MaterialIcons
                  name="science"
                  size={22}
                  color={theme.colors.primary}
                  style={styles.linkIcon}
                />
                <Text style={styles.itemTitle}>Shaker</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/(tabs)/ingredients" asChild>
              <TouchableOpacity
                style={styles.linkRow}
                onPress={onClose}
              >
                <MaterialIcons
                  name="kitchen"
                  size={22}
                  color={theme.colors.primary}
                  style={styles.linkIcon}
                />
                <Text style={styles.itemTitle}>Ingredients</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity style={styles.linkRow} onPress={handleIngredientTags}>
              <MaterialIcons
                name="label"
                size={22}
                color={theme.colors.primary}
                style={styles.linkIcon}
              />
              <Text style={styles.itemTitle}>Ingredient tags</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRow} onPress={handleCocktailTags}>
              <MaterialIcons
                name="sell"
                size={22}
                color={theme.colors.primary}
                style={styles.linkIcon}
              />
              <Text style={styles.itemTitle}>Cocktail tags</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRow} onPress={handleExportPhotos}>
              <MaterialIcons
                name="photo-library"
                size={22}
                color={theme.colors.primary}
                style={styles.linkIcon}
              />
              <Text style={styles.itemTitle}>Export photos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRow} onPress={handleExportData}>
              <MaterialIcons
                name="file-download"
                size={22}
                color={theme.colors.primary}
                style={styles.linkIcon}
              />
              <Text style={styles.itemTitle}>Export data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRow} onPress={handleImportData}>
              <MaterialIcons
                name="file-upload"
                size={22}
                color={theme.colors.primary}
                style={styles.linkIcon}
              />
              <Text style={styles.itemTitle}>Import data</Text>
            </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Modal>
      <ConfirmDialog
        visible={alert !== null}
        title={alert?.title ?? ''}
        message={alert?.message ?? ''}
        onConfirm={() => setAlert(null)}
      />
    </>
  );
}

