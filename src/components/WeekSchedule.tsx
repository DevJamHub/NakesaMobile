import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { weekSchedule } from '@/features/practice/profession';
import { dayOfWeek, todayWIB } from '@/lib/format';
import type { PracticeHour } from '@/types/domain';

import { AppText } from './ui/AppText';

/** Practice hours per day, Monday first; today is highlighted. */
export function WeekSchedule({ hours }: { hours: PracticeHour[] }) {
  if (!hours.length) return <AppText variant="small">Jam praktik belum diatur. Hubungi praktik untuk info jadwal.</AppText>;
  const today = dayOfWeek(todayWIB());
  return (
    <View style={styles.table}>
      {weekSchedule(hours).map((d) => {
        const isToday = d.day === today;
        return (
          <View key={d.day} style={[styles.row, isToday && styles.today]}>
            <AppText variant={isToday ? 'bodyStrong' : 'body'} color={isToday ? colors.primary : colors.text} style={styles.day}>
              {d.label}
              {isToday ? ' (hari ini)' : ''}
            </AppText>
            <AppText
              variant={isToday ? 'bodyStrong' : 'body'}
              color={d.sessions.length ? (isToday ? colors.primary : colors.text) : colors.textFaint}
              style={styles.sessions}>
              {d.sessions.length ? d.sessions.join('\n') : 'Tutup'}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { gap: 2 },
  row: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: spacing.sm, borderRadius: 8 },
  today: { backgroundColor: colors.primarySoft },
  day: { flex: 1 },
  sessions: { textAlign: 'right' },
});
