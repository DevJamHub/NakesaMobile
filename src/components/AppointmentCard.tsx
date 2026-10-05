import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { statusDisplay } from '@/features/appointment/status';
import { professionColor, professionIcon } from '@/features/practice/profession';
import { friendlyDate, shortTime } from '@/lib/format';
import type { Appointment } from '@/types/domain';

import { AppText } from './ui/AppText';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';

export function AppointmentCard({ appointment, onPress }: { appointment: Appointment; onPress?: () => void }) {
  const status = statusDisplay(appointment);
  const time = appointment.startTime
    ? `${shortTime(appointment.startTime)}${appointment.endTime ? `–${shortTime(appointment.endTime)}` : ''}`
    : 'Jam menyusul';
  const practice = appointment.practice;
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`Janji temu ${practice?.name ?? ''}, ${friendlyDate(appointment.date)} jam ${time}, ${status.label}`}>
      <View style={styles.top}>
        <Avatar emoji={professionIcon(practice?.profession)} color={professionColor(practice?.profession)} size={44} />
        <View style={styles.body}>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {practice?.name ?? 'Praktik'}
          </AppText>
          <AppText variant="small" numberOfLines={1}>
            {appointment.service ?? practice?.profession?.label ?? 'Janji temu'}
          </AppText>
        </View>
        {onPress ? <Ionicons name="chevron-forward" size={20} color={colors.textFaint} /> : null}
      </View>
      <View style={styles.when}>
        <View style={styles.whenItem}>
          <Ionicons name="calendar-outline" size={16} color={colors.primary} />
          <AppText variant="smallStrong" color={colors.text}>
            {friendlyDate(appointment.date)}
          </AppText>
        </View>
        <View style={styles.whenItem}>
          <Ionicons name="time-outline" size={16} color={colors.primary} />
          <AppText variant="smallStrong" color={colors.text}>
            {time}
          </AppText>
        </View>
      </View>
      <Badge label={status.label} tone={status.tone} dot />
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  body: { flex: 1, gap: 2 },
  when: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginVertical: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 10,
  },
  whenItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
