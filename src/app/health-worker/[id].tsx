import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PracticeCard } from '@/components/PracticeCard';
import { ServiceCard } from '@/components/ServiceCard';
import { WeekSchedule } from '@/components/WeekSchedule';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ErrorState, LoadingState } from '@/components/ui/States';
import { spacing } from '@/constants/theme';
import { getHealthWorker } from '@/features/practice/practice-service';
import { healthWorkerName, professionColor } from '@/features/practice/profession';
import { useAsync } from '@/hooks/useAsync';

export default function HealthWorkerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: worker, loading, error, reload, refresh, refreshing } = useAsync(() => getHealthWorker(id), id);

  if (loading) return <LoadingState />;
  if (error || !worker) return <ErrorState message={error} onRetry={reload} />;

  const name = healthWorkerName(worker);
  const main = worker.practices[0];
  const specialty = worker.practices.find((p) => p.practitioner.id === worker.id)?.specialty;
  const canBook = !!main && main.booking_enabled && main.hours.length > 0;

  return (
    <Screen
      edges={['bottom']}
      onRefresh={refresh}
      refreshing={refreshing}
      footer={
        main ? (
          <PrimaryButton
            title={`Buat janji dengan ${name.split(' ').slice(0, 2).join(' ')}`}
            icon="calendar"
            disabled={!canBook}
            onPress={() =>
              router.push({
                pathname: '/booking/[practiceId]',
                params: { practiceId: main.id, healthWorkerId: worker.id, healthWorkerName: name },
              })
            }
          />
        ) : null
      }>
      <View style={styles.hero}>
        <Avatar name={worker.full_name} uri={worker.avatar_url} color={professionColor(worker.profession)} size={88} />
        <AppText variant="title" center>
          {name}
        </AppText>
        <AppText variant="bodyStrong" color={professionColor(worker.profession)} center>
          {[worker.profession?.label ?? 'Tenaga kesehatan', specialty].filter(Boolean).join(' · ')}
        </AppText>
      </View>

      <View>
        <SectionHeader title={worker.practices.length > 1 ? 'Praktik' : 'Tempat praktik'} />
        <View style={styles.list}>
          {worker.practices.map((p) => (
            <PracticeCard
              key={p.id}
              practice={p}
              onPress={() => router.push({ pathname: '/practice/[id]', params: { id: p.id } })}
            />
          ))}
        </View>
      </View>

      {main ? (
        <>
          <View>
            <SectionHeader title="Jadwal praktik" />
            <Card>
              <WeekSchedule hours={main.hours} />
            </Card>
          </View>
          <View>
            <SectionHeader title="Layanan" />
            <View style={styles.list}>
              {main.services.map((s) => (
                <ServiceCard key={s.id ?? s.name} service={s} />
              ))}
            </View>
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm },
  list: { gap: spacing.md },
});
