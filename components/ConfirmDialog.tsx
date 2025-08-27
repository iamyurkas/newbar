import React from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Dialog, Button, Text, useTheme } from 'react-native-paper';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'OK',
  cancelLabel,
}: ConfirmDialogProps) {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onCancel}
        style={[styles.dialog, { backgroundColor: theme.colors.background }]}
      >
        {title ? <Dialog.Title>{title}</Dialog.Title> : null}
        {message ? (
          <Dialog.Content>
            <Text>{message}</Text>
          </Dialog.Content>
        ) : null}
        <Dialog.Actions>
          {cancelLabel && onCancel ? (
            <Button
              mode="outlined"
              style={[styles.button, { borderColor: theme.colors.primary }]}
              buttonColor={theme.colors.background}
              textColor={theme.colors.primary}
              onPress={onCancel}
            >
              {cancelLabel}
            </Button>
          ) : null}
          <Button
            mode="contained"
            style={styles.button}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            onPress={onConfirm}
          >
            {confirmLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 8,
  },
  button: {
    borderRadius: 24,
  },
});

