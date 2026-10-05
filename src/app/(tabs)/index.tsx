import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppointmentCard } from '@/components/AppointmentCard';
import { CategoryCard } from '@/components/CategoryCard';
import { PracticeCard } from '@/components/PracticeCard';
import { SearchBar } from '@/components/SearchBar';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { colors, spacing } from '@/constants/theme';
import { listAppointments } from '@/features/appointment/appointment-service';
import { isUpcoming } from '@/features/appointment/status';
import { useAccount } from '@/features/auth/AuthProvider';
import { listProfessions, searchPractices } from '@/features/practice/practice-service';
import { useAsync } from '@/hooks/useAsync';
import { greeting } from '@/lib/format';

export default function HomeScreen() {
  const account = useAccount();
  const city = account.city;

  const professions = useAsync(listProfessions, 'professions');
  const practices = useAsync(() => searchPractices({ city, limit: 5 }), `home:${city ?? ''}`);
  const appointments = useAsync(listAppointments, 'appointments');
  const next = appointments.data?.find(isUpcoming);

  // Keep "Janji temu berikutnya" current after booking or cancelling elsewhere.
  const { revalidate } = appointments;
  useFocusEffect(
    useCallback(() => {
      revalidate();
    }, [revalidate]),
  );

  const refresh = () => {
    professions.refresh();
    practices.refresh();
    appointments.refresh();
  };

  return (
    <Screen edges={['top']} onRefresh={refresh} refreshing={practices.refreshing}>
      <View style={styles.greeting}>
        <AppText variant="title">
          {greeting()}, {account.fullName.split(' ')[0]} 👋
        </AppText>
        <AppText color={colors.textMuted}>Apa yang Anda butuhkan hari ini?</AppText>
      </View>

      <SearchBar onPress={() => router.navigate({ pathname: '/explore', params: { focus: '1' } })} />

      <View>
        <SectionHeader title="Kategori" />
        {professions.loading ? (
          <LoadingState fill={false} />
        ) : professions.error ? (
          <ErrorState message={professions.error} onRetry={professions.reload} fill={false} />
        ) : (
          <View style={styles.grid}>
            {professions.data?.map((p) => (
              <CategoryCard
                key={p.key}
                profession={p}
                onPress={() => router.navigate({ pathname: '/explore', params: { profession: p.key } })}
              />
            ))}
          </View>
        )}
      </View>

      {next ? (
        <View>
          <SectionHeader title="Janji temu berikutnya" actionLabel="Lihat semua" onAction={() => router.navigate('/appointments')} />
          <AppointmentCard
            appointment={next}
            onPress={() => router.push({ pathname: '/appointment/[id]', params: { id: next.id } })}
          />
        </View>
      ) : null}

      <View>
        <SectionHeader
          title={city ? `Praktik di sekitar ${city}` : 'Praktik untuk Anda'}
          actionLabel="Lihat semua"
          onAction={() => router.navigate('/explore')}
        />
        {practices.loading ? (
          <LoadingState fill={false} />
        ) : practices.error ? (
          <ErrorState message={practices.error} onRetry={practices.reload} fill={false} />
        ) : practices.data?.length ? (
          <View style={styles.list}>
            {practices.data.map((p) => (
              <PracticeCard
                key={p.id}
                practice={p}
                onPress={() => router.push({ pathname: '/practice/[id]', params: { id: p.id } })}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="business-outline"
            title="Belum ada praktik"
            message="Praktik yang bergabung dengan Nakesa akan muncul di sini."
            fill={false}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: { gap: spacing.xs, marginTop: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  list: { gap: spacing.md },
});
