import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius } from '@/constants/theme';
import type { Profession } from '@/types/domain';

import { AppText } from './ui/AppText';

export function CategoryCard({ profession, onPress }: { profession: Profession; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Cari ${profession.label}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Text style={[styles.icon, { backgroundColor: `${profession.color}1A` }]}>{profession.icon}</Text>
      <AppText variant="smallStrong" center numberOfLines={2} style={styles.label}>
        {profession.label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '23%',
    flexGrow: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { backgroundColor: colors.primarySoft },
  icon: {
    fontSize: 24,
    width: 48,
    height: 48,
    lineHeight: 48,
    textAlign: 'center',
    borderRadius: 24,
    overflow: 'hidden',
  },
  label: { fontSize: 13, lineHeight: 17 },
});
