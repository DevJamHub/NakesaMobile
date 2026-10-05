import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { HealthWorkerCard } from '@/components/HealthWorkerCard';
import { ServiceCard } from '@/components/ServiceCard';
import { WeekSchedule } from '@/components/WeekSchedule';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { InfoRow } from '@/components/ui/InfoRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ErrorState, LoadingState } from '@/components/ui/States';
import { spacing } from '@/constants/theme';
import { getPractice } from '@/features/practice/practice-service';
import { practiceSubtitle, professionColor, professionIcon } from '@/features/practice/profession';
import { useAsync } from '@/hooks/useAsync';
import { mapsLink, telLink, waLink } from '@/lib/format';
import { openLink } from '@/lib/links';

export default function PracticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: practice, loading, error, reload, refresh, refreshing } = useAsync(() => getPractice(id), id);

  if (loading) return <LoadingState />;
  if (error || !practice) return <ErrorState message={error} onRetry={reload} />;

  const color = professionColor(practice.profession);
  const canBook = practice.booking_enabled && practice.hours.length > 0;
  const bookingNote = !practice.booking_enabled
    ? 'Booking online sedang ditutup. Hubungi praktik langsung.'
    : !practice.hours.length
      ? 'Praktik belum mengatur jam praktik. Hubungi praktik langsung.'
      : null;
  const place = [practice.address, practice.city, practice.province].filter(Boolean).join(', ');
  const phone = practice.phone;
  const maps = mapsLink(practice);

  return (
    <Screen
      edges={['bottom']}
      onRefresh={refresh}
      refreshing={refreshing}
      footer={
        <>
          {bookingNote ? (
            <AppText variant="small" center>
              {bookingNote}
            </AppText>
          ) : null}
          <PrimaryButton
            title="Buat Janji Temu"
            icon="calendar"
            disabled={!canBook}
            onPress={() => router.push({ pathname: '/booking/[practiceId]', params: { practiceId: practice.id } })}
          />
        </>
      }>
      <View style={styles.hero}>
        <Avatar emoji={professionIcon(practice.profession)} color={color} size={76} />
        <AppText variant="title" center>
          {practice.name}
        </AppText>
        <AppText variant="bodyStrong" color={color} center>
          {practiceSubtitle(practice)}
        </AppText>
        <Badge label={practice.is_open ? 'Sedang buka' : 'Sedang tutup'} tone={practice.is_open ? 'success' : 'neutral'} dot />
      </View>

      {place || phone || maps ? (
        <Card style={styles.card}>
          {place ? (
            <InfoRow icon="location-outline" label="Alamat">
              {place}
            </InfoRow>
          ) : null}
          {phone ? (
            <InfoRow icon="call-outline" label="Telepon / WhatsApp">
              {phone}
            </InfoRow>
          ) : null}
          {phone || maps ? (
            <View style={styles.actions}>
              {phone ? (
                <PrimaryButton
                  title="Telepon"
                  icon="call-outline"
                  variant="secondary"
                  compact
                  style={styles.action}
                  onPress={() => openLink(telLink(phone))}
                />
              ) : null}
              {maps ? (
                <PrimaryButton
                  title="Buka peta"
                  icon="map-outline"
                  variant="secondary"
                  compact
                  style={styles.action}
                  onPress={() => openLink(maps)}
                />
              ) : null}
            </View>
          ) : null}
          {phone ? (
            <PrimaryButton
              title="Tanya via WhatsApp"
              icon="logo-whatsapp"
              variant="whatsapp"
              compact
              onPress={() => openLink(waLink(phone, `Halo ${practice.name}, saya ingin bertanya.`))}
            />
          ) : null}
        </Card>
      ) : null}

      {practice.description ? (
        <View>
          <SectionHeader title="Tentang praktik" />
          <AppText>{practice.description}</AppText>
        </View>
      ) : null}

      <View>
        <SectionHeader title="Jam praktik" />
        <Card>
          <WeekSchedule hours={practice.hours} />
        </Card>
      </View>

      <View>
        <SectionHeader title="Layanan" />
        <View style={styles.list}>
          {practice.services.length ? (
            practice.services.map((s) => <ServiceCard key={s.id ?? s.name} service={s} />)
          ) : (
            <AppText variant="small">Praktik belum menambahkan layanan.</AppText>
          )}
        </View>
      </View>

      {practice.health_workers.length ? (
        <View>
          <SectionHeader title="Tenaga kesehatan" />
          <View style={styles.list}>
            {practice.health_workers.map((hw) => (
              <HealthWorkerCard
                key={hw.id}
                worker={hw}
                onPress={() => router.push({ pathname: '/health-worker/[id]', params: { id: hw.id } })}
              />
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm },
  card: { gap: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.sm },
  action: { flex: 1 },
  list: { gap: spacing.md },
});
