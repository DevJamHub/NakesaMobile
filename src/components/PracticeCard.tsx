import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { practicePlace, practiceSubtitle, professionColor, professionIcon, titledName } from '@/features/practice/profession';
import type { PracticeSummary } from '@/types/domain';

import { AppText } from './ui/AppText';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';

type Props = { practice: PracticeSummary; onPress?: () => void };

export function PracticeCard({ practice, onPress }: Props) {
  const color = professionColor(practice.profession);
  const practitioner = titledName(practice.practitioner.full_name, practice.profession);
  return (
    <Card onPress={onPress} accessibilityLabel={`${practice.name}, ${practiceSubtitle(practice)}`}>
      <View style={styles.row}>
        <Avatar emoji={professionIcon(practice.profession)} color={color} size={52} />
        <View style={styles.body}>
          <AppText variant="h3" numberOfLines={2}>
            {practice.name}
          </AppText>
          <AppText variant="smallStrong" color={color} numberOfLines={1}>
            {practiceSubtitle(practice)}
          </AppText>
          {practitioner ? (
            <AppText variant="small" numberOfLines={1}>
              {practitioner}
            </AppText>
          ) : null}
          {practicePlace(practice) ? (
            <View style={styles.place}>
              <Ionicons name="location-outline" size={15} color={colors.textMuted} />
              <AppText variant="small" numberOfLines={1} style={styles.flex}>
                {practicePlace(practice)}
              </AppText>
            </View>
          ) : null}
          <View style={styles.badges}>
            <Badge label={practice.is_open ? 'Sedang buka' : 'Sedang tutup'} tone={practice.is_open ? 'success' : 'neutral'} dot />
            {!practice.booking_enabled ? <Badge label="Booking ditutup" tone="warning" /> : null}
          </View>
        </View>
        {onPress ? <Ionicons name="chevron-forward" size={20} color={colors.textFaint} /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  body: { flex: 1, gap: 3 },
  place: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  flex: { flex: 1 },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: 6, flexWrap: 'wrap' },
});
