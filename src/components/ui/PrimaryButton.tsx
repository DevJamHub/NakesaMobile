import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fontSize, radius } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'whatsapp' | 'google';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  disabled?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

const VARIANTS: Record<Variant, { bg: string; pressed: string; fg: string; border?: string }> = {
  primary: { bg: colors.primary, pressed: colors.primaryPressed, fg: '#FFFFFF' },
  secondary: { bg: colors.surface, pressed: colors.primarySoft, fg: colors.primary, border: colors.primary },
  ghost: { bg: 'transparent', pressed: colors.primarySoft, fg: colors.primary },
  danger: { bg: colors.surface, pressed: colors.dangerSoft, fg: colors.danger, border: colors.danger },
  whatsapp: { bg: colors.whatsapp, pressed: '#17804A', fg: '#FFFFFF' },
  google: { bg: colors.surface, pressed: colors.neutralSoft, fg: colors.text, border: colors.border },
};

export function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  compact,
  style,
  accessibilityHint,
}: Props) {
  const v = VARIANTS[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        { backgroundColor: pressed ? v.pressed : v.bg },
        v.border ? { borderWidth: 1.5, borderColor: v.border } : null,
        disabled && !loading && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={compact ? 18 : 20} color={v.fg} /> : null}
          <Text style={[styles.label, compact && styles.labelCompact, { color: v.fg }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radius.md,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: { minHeight: 42, paddingHorizontal: 14, borderRadius: radius.sm },
  disabled: { opacity: 0.45 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: fontSize.body, fontWeight: '700' },
  labelCompact: { fontSize: fontSize.small },
});
