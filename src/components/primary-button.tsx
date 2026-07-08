import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { colors, spacing, fontSize } from '../styles/theme';

type PrimaryButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: 'filled' | 'outline';
  disabled?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  variant = 'filled',
  disabled = false,
}: PrimaryButtonProps) {
  const isOutline = variant === 'outline';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isOutline ? styles.outlineButton : styles.filledButton,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={isOutline ? styles.outlineText : styles.filledText}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  filledButton: {
    backgroundColor: colors.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  filledText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  outlineText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
