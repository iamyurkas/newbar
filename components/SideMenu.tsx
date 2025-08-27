import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';
// eslint-disable-next-line import/no-unresolved
import { useTheme } from 'react-native-paper';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const drawerWidth = screenWidth * 0.75;
  const translateX = useRef(new Animated.Value(-drawerWidth)).current;
  const [render, setRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setRender(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -drawerWidth,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setRender(false));
    }
  }, [visible, drawerWidth, translateX]);

  if (!render) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: colors.backdrop }]} onPress={onClose} />
      <Animated.View
        style={[
          styles.drawer,
          {
            width: drawerWidth,
            backgroundColor: colors.surface,
            transform: [{ translateX }],
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.onSurface }]}>Main Menu</Text>
        <Link href="/(tabs)/cocktails" asChild>
          <Pressable style={styles.menuItem} onPress={onClose}>
            <Text style={{ color: colors.onSurface }}>Cocktails</Text>
          </Pressable>
        </Link>
        <Link href="/(tabs)/shaker" asChild>
          <Pressable style={styles.menuItem} onPress={onClose}>
            <Text style={{ color: colors.onSurface }}>Shaker</Text>
          </Pressable>
        </Link>
        <Link href="/(tabs)/ingredients" asChild>
          <Pressable style={styles.menuItem} onPress={onClose}>
            <Text style={{ color: colors.onSurface }}>Ingredients</Text>
          </Pressable>
        </Link>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  menuItem: {
    paddingVertical: 12,
  },
});

