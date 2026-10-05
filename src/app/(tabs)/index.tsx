import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppointmentCard } from '@/components/AppointmentCard';
import { CategoryCard } from '@/components/CategoryCard';
import { PracticeCard } from '@/components/PracticeCard';
import { SearchBar } from '@/components/SearchBar';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { colors, spacing } from '@/constants/theme';
import { listAppointments } from '@/features/appointment/appointment-service';
import { isUpcoming } from '@/features/appointment/status';
import { useAccount } from '@/features/auth/AuthProvider';
import { listProfessions, searchPractices } from '@/features/practice/practice-service';
import { isInCity } from '@/features/practice/profession';
import { useAsync } from '@/hooks/useAsync';
import { useRevalidateOnFocus } from '@/hooks/useRevalidateOnFocus';
import { firstName, greeting } from '@/lib/format';

export default function HomeScreen() {
  const account = useAccount();
  const city = account.city;
  const name = firstName(account.fullName);

  const professions = useAsync(listProfessions, 'professions');
  const practices = useAsync(() => searchPractices({ city, limit: 5 }), `home:${city ?? ''}`);
  const appointments = useAsync(listAppointments, 'appointments');
  const next = appointments.data?.find(isUpcoming);
  // Practices in the patient's city come first; only say "near you" when there are some.
  const nearby = !!city && !!practices.data?.some((p) => isInCity(p, city));

  // Keep "Janji temu berikutnya" current after booking or cancelling elsewhere.
  useRevalidateOnFocus(appointments.revalidate);

  const refresh = () => {
    professions.refresh();
    practices.refresh();
    appointments.refresh();
  };

  // `at` / `focus` change on every tap, so Search reacts even when it is already open.
  const openSearch = () => router.navigate({ pathname: '/explore', params: { focus: String(Date.now()) } });
  const openCategory = (profession: string) =>
    router.navigate({ pathname: '/explore', params: { profession, at: String(Date.now()) } });

  return (
    <Screen edges={['top']} onRefresh={refresh} refreshing={practices.refreshing}>
      <View style={styles.greeting}>
        <AppText variant="title">
          {greeting()}
          {name ? `, ${name}` : ''} 👋
        </AppText>
        <AppText color={colors.textMuted}>Apa yang Anda butuhkan hari ini?</AppText>
      </View>

      <SearchBar onPress={openSearch} />

      <View>
        <SectionHeader title="Kategori" />
        {professions.loading ? (
          <LoadingState fill={false} />
        ) : professions.error ? (
          <ErrorState message={professions.error} onRetry={professions.reload} fill={false} />
        ) : (
          <View style={styles.grid}>
            {professions.data?.map((p) => (
              <CategoryCard key={p.key} profession={p} onPress={() => openCategory(p.key)} />
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
          title={nearby ? `Praktik di sekitar ${city}` : 'Praktik untuk Anda'}
          actionLabel="Lihat semua"
          onAction={() => router.navigate('/explore')}
        />
        {!city ? (
          <Card onPress={() => router.push('/profile/edit')} accessibilityLabel="Isi kota Anda di profil" style={styles.hint}>
            <Ionicons name="location-outline" size={22} color={colors.primary} />
            <AppText variant="small" style={styles.flex}>
              Isi kota Anda di profil agar praktik di sekitar Anda tampil lebih dulu.
            </AppText>
            <Ionicons name="chevron-forward" size={20} color={colors.textFaint} />
          </Card>
        ) : null}
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
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },
  flex: { flex: 1 },
});
