import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

import { AppText } from './AppText';

type Props = { icon: ComponentProps<typeof Ionicons>['name']; label?: string; children: ReactNode };

/** Icon + text line, e.g. 📍 address or 🕐 time. */
export function InfoRow({ icon, label, children }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.text}>
        {label ? <AppText variant="caption">{label}</AppText> : null}
        {typeof children === 'string' ? <AppText>{children}</AppText> : children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, justifyContent: 'center', minHeight: 34 },
});
