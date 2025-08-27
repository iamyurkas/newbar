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
      <Dialog visible={visible} onDismiss={onCancel} style={styles.dialog}>
        {title ? <Dialog.Title>{title}</Dialog.Title> : null}
        {message ? (
          <Dialog.Content>
            <Text>{message}</Text>
          </Dialog.Content>
        ) : null}
        <Dialog.Actions>
          {cancelLabel && onCancel ? (
            <Button textColor={theme.colors.onSurfaceVariant} onPress={onCancel}>
              {cancelLabel}
            </Button>
          ) : null}
          <Button textColor={theme.colors.primary} onPress={onConfirm}>
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
});

