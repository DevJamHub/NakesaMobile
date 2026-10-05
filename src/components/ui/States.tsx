// Loading, empty and error states used on every screen.
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

import { AppText } from './AppText';
import { PrimaryButton } from './PrimaryButton';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function LoadingState({ message = 'Memuat…', fill = true }: { message?: string; fill?: boolean }) {
  return (
    <View style={[styles.box, fill && styles.fill]} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText variant="small" center>
        {message}
      </AppText>
    </View>
  );
}

type EmptyProps = {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  fill?: boolean;
};

export function EmptyState({ icon = 'leaf-outline', title, message, actionLabel, onAction, fill = true }: EmptyProps) {
  return (
    <View style={[styles.box, fill && styles.fill]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={30} color={colors.primary} />
      </View>
      <AppText variant="h3" center>
        {title}
      </AppText>
      {message ? (
        <AppText variant="small" center style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <PrimaryButton title={actionLabel} onPress={onAction} variant="secondary" compact style={styles.action} />
      ) : null}
    </View>
  );
}

type ErrorProps = { message?: string | null; onRetry?: () => void; fill?: boolean };

export function ErrorState({ message, onRetry, fill = true }: ErrorProps) {
  return (
    <View style={[styles.box, fill && styles.fill]} accessibilityLiveRegion="polite">
      <View style={[styles.iconCircle, { backgroundColor: colors.dangerSoft }]}>
        <Ionicons name="cloud-offline-outline" size={30} color={colors.danger} />
      </View>
      <AppText variant="h3" center>
        Terjadi kesalahan.
      </AppText>
      <AppText variant="small" center style={styles.message}>
        {message ?? 'Coba lagi.'}
      </AppText>
      {onRetry ? (
        <PrimaryButton title="Coba lagi" icon="refresh" onPress={onRetry} variant="secondary" compact style={styles.action} />
      ) : null}
    </View>
  );
}

/** A small inline message box, e.g. above a form. */
export function NoticeBox({ message, tone = 'danger' }: { message: string; tone?: 'danger' | 'info' | 'success' }) {
  const palette = {
    danger: { fg: colors.danger, bg: colors.dangerSoft, icon: 'alert-circle' as const },
    info: { fg: colors.info, bg: colors.infoSoft, icon: 'information-circle' as const },
    success: { fg: colors.success, bg: colors.successSoft, icon: 'checkmark-circle' as const },
  }[tone];
  return (
    <View style={[styles.notice, { backgroundColor: palette.bg }]} accessibilityRole="alert">
      <Ionicons name={palette.icon} size={20} color={palette.fg} />
      <AppText variant="small" color={palette.fg} style={styles.noticeText}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  fill: { flex: 1, minHeight: 260 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  message: { maxWidth: 300 },
  action: { marginTop: spacing.sm },
  notice: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderRadius: 12, alignItems: 'flex-start' },
  noticeText: { flex: 1 },
});
