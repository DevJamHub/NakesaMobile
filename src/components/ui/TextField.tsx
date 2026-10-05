import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fontSize, radius } from '@/constants/theme';

import { AppText } from './AppText';

type Props = TextInputProps & {
  label: string;
  error?: string | null;
  hint?: string;
  /** Adds a "Lihat / Sembunyikan" button for passwords. */
  password?: boolean;
  optional?: boolean;
};

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, error, hint, password, optional, style, multiline, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  return (
    <View style={styles.wrap}>
      <AppText variant="smallStrong" color={colors.text}>
        {label}
        {optional ? <Text style={styles.optional}> (opsional)</Text> : null}
      </AppText>
      <View
        style={[
          styles.box,
          multiline && styles.boxMultiline,
          focused && styles.boxFocused,
          error ? styles.boxError : null,
        ]}>
        <TextInput
          ref={ref}
          style={[styles.input, multiline && styles.inputMultiline, style]}
          placeholderTextColor={colors.textFaint}
          secureTextEntry={password && hidden}
          multiline={multiline}
          accessibilityLabel={label}
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
        />
        {password ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Lihat kata sandi' : 'Sembunyikan kata sandi'}
            style={styles.toggle}>
            <Text style={styles.toggleText}>{hidden ? 'Lihat' : 'Sembunyikan'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="small" color={colors.danger}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption">{hint}</AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  optional: { fontWeight: '400', color: colors.textMuted },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  boxMultiline: { alignItems: 'flex-start', minHeight: 96 },
  boxFocused: { borderColor: colors.primary },
  boxError: { borderColor: colors.danger },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: fontSize.body, color: colors.text },
  inputMultiline: { minHeight: 92, textAlignVertical: 'top' },
  toggle: { paddingHorizontal: 14, paddingVertical: 10 },
  toggleText: { color: colors.primary, fontWeight: '600', fontSize: fontSize.small },
});
