import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  Pressable,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../styles/theme';

type InputFieldProps = TextInputProps & {
  error?: string;
  isPassword?: boolean;
};

export default function InputField({
  error,
  isPassword = false,
  ...textInputProps
}: InputFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !isVisible}
          {...textInputProps}
        />

        {isPassword && (
          <Pressable
            onPress={() => setIsVisible((prev) => !prev)}
            style={styles.iconButton}
            hitSlop={8}
          >
            <Ionicons
              name={isVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: fontSize.md,
    color: colors.text,
  },
  iconButton: {
    paddingHorizontal: 14,
  },
  error: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    marginTop: -8,
  },
});