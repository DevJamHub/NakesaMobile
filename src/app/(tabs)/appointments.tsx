import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentCard } from '@/components/AppointmentCard';
import { AppText } from '@/components/ui/AppText';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { colors, radius, spacing } from '@/constants/theme';
import { listAppointments } from '@/features/appointment/appointment-service';
import { isUpcoming } from '@/features/appointment/status';
import { useAsync } from '@/hooks/useAsync';
import { useRevalidateOnFocus } from '@/hooks/useRevalidateOnFocus';

type Tab = 'upcoming' | 'history';

export default function AppointmentsScreen() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const appointments = useAsync(listAppointments, 'appointments');

  // Refresh when coming back from booking, detail or cancel.
  useRevalidateOnFocus(appointments.revalidate);

  const all = appointments.data ?? [];
  // Upcoming: soonest first. History: most recent first.
  const upcoming = all.filter(isUpcoming);
  const shown = tab === 'upcoming' ? upcoming : all.filter((a) => !isUpcoming(a)).reverse();

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <View style={styles.top}>
        <AppText variant="title">Janji Temu</AppText>
        <View style={styles.segment} accessibilityRole="tablist">
          {(
            [
              ['upcoming', 'Akan Datang'],
              ['history', 'Riwayat'],
            ] as const
          ).map(([key, label]) => (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === key }}
              style={[styles.segmentItem, tab === key && styles.segmentActive]}>
              <AppText variant="smallStrong" color={tab === key ? colors.primary : colors.textMuted}>
                {key === 'upcoming' && upcoming.length ? `${label} (${upcoming.length})` : label}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>

      {appointments.loading ? (
        <LoadingState />
      ) : appointments.error && !appointments.data ? (
        <ErrorState message={appointments.error} onRetry={appointments.reload} />
      ) : (
        <FlatList
          data={shown}
          keyExtractor={(a) => a.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={appointments.refreshing}
              onRefresh={appointments.refresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            tab === 'upcoming' ? (
              <EmptyState
                icon="calendar-clear-outline"
                title="Belum ada janji temu"
                message="Cari praktik lalu pilih jadwal yang cocok untuk Anda."
                actionLabel="Cari praktik"
                onAction={() => router.navigate('/explore')}
              />
            ) : (
              <EmptyState
                icon="time-outline"
                title="Belum ada riwayat"
                message="Janji temu yang selesai atau dibatalkan akan muncul di sini."
              />
            )
          }
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              onPress={() => router.push({ pathname: '/appointment/[id]', params: { id: item.id } })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.md, paddingBottom: spacing.md },
  segment: { flexDirection: 'row', backgroundColor: colors.neutralSoft, borderRadius: radius.md, padding: 4 },
  segmentItem: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm },
  segmentActive: { backgroundColor: colors.surface },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md, flexGrow: 1 },
});
