import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

import { AppText } from './AppText';

/** "—— atau ——" between two ways of doing the same thing (decorative for screen readers). */
export function OrDivider({ label = 'atau' }: { label?: string }) {
  return (
    <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.line} />
      <AppText variant="small">{label}</AppText>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
