import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PracticeCard } from '@/components/PracticeCard';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { InfoRow } from '@/components/ui/InfoRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ErrorState, LoadingState, NoticeBox } from '@/components/ui/States';
import { spacing } from '@/constants/theme';
import { cancelAppointment, getAppointment } from '@/features/appointment/appointment-service';
import { isUpcoming, statusDisplay } from '@/features/appointment/status';
import { appointmentWhatsApp } from '@/features/appointment/whatsapp';
import { useAccount } from '@/features/auth/AuthProvider';
import { titledName } from '@/features/practice/profession';
import { useAsync } from '@/hooks/useAsync';
import { friendlyError } from '@/lib/errors';
import { dateWIB, formatDate, shortTime } from '@/lib/format';
import { openLink } from '@/lib/links';

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const account = useAccount();
  const appointment = useAsync(() => getAppointment(id), id);
  const [asking, setAsking] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: 'success' | 'danger' } | null>(null);

  if (appointment.loading) return <LoadingState />;
  if (appointment.error && !appointment.data) return <ErrorState message={appointment.error} onRetry={appointment.reload} />;
  if (!appointment.data) return <ErrorState onRetry={appointment.reload} />;

  const a = appointment.data;
  const status = statusDisplay(a);
  const upcoming = isUpcoming(a);
  const time = a.startTime ? `${shortTime(a.startTime)}${a.endTime ? `–${shortTime(a.endTime)}` : ''} WIB` : 'Jam menyusul';
  const wa = appointmentWhatsApp(a, account.fullName, 'saya ingin menanyakan janji temu saya:');
  // Finished, cancelled or rejected: offer to book at the same practice again.
  const practice = a.practice;
  const canBookAgain = !upcoming && !!practice?.booking_enabled;

  const cancel = async () => {
    setCancelling(true);
    try {
      await cancelAppointment(a.id);
      appointment.setData(await getAppointment(a.id));
      setMessage({ text: 'Janji temu sudah dibatalkan.', tone: 'success' });
    } catch (e) {
      setMessage({ text: friendlyError(e, 'Janji temu belum bisa dibatalkan. Coba lagi.'), tone: 'danger' });
    } finally {
      setCancelling(false);
      setAsking(false);
    }
  };

  return (
    <Screen
      edges={['bottom']}
      onRefresh={appointment.refresh}
      refreshing={appointment.refreshing}
      footer={
        wa || a.canCancel || canBookAgain ? (
          <>
            {canBookAgain && practice ? (
              <PrimaryButton
                title="Buat janji lagi"
                icon="calendar"
                onPress={() => router.push({ pathname: '/booking/[practiceId]', params: { practiceId: practice.id } })}
              />
            ) : null}
            {wa ? (
              <PrimaryButton
                title="Hubungi praktik via WhatsApp"
                icon="logo-whatsapp"
                variant={canBookAgain ? 'secondary' : 'whatsapp'}
                onPress={() => openLink(wa)}
              />
            ) : null}
            {a.canCancel ? (
              <PrimaryButton title="Batalkan janji temu" icon="close-circle-outline" variant="danger" onPress={() => setAsking(true)} />
            ) : null}
          </>
        ) : undefined
      }>
      <View style={styles.status}>
        <Badge label={status.label} tone={status.tone} dot />
        <AppText>{status.explanation}</AppText>
      </View>

      {message ? <NoticeBox message={message.text} tone={message.tone} /> : null}
      {upcoming && !a.canCancel ? (
        <NoticeBox
          tone="info"
          message="Janji temu ini sudah tidak bisa dibatalkan lewat aplikasi. Hubungi praktik jika ada perubahan."
        />
      ) : null}

      <Card style={styles.card}>
        <InfoRow icon="calendar-outline" label="Tanggal">
          <AppText variant="bodyStrong">{formatDate(a.date)}</AppText>
        </InfoRow>
        <InfoRow icon="time-outline" label="Jam">
          <AppText variant="bodyStrong">{time}</AppText>
        </InfoRow>
        {a.service ? (
          <InfoRow icon="medkit-outline" label="Layanan">
            {a.service}
          </InfoRow>
        ) : null}
        {a.healthWorker?.full_name ? (
          <InfoRow icon="person-outline" label="Tenaga kesehatan">
            {titledName(a.healthWorker.full_name, a.healthWorker.profession)}
          </InfoRow>
        ) : null}
        {a.notes ? (
          <InfoRow icon="document-text-outline" label="Catatan Anda">
            {a.notes}
          </InfoRow>
        ) : null}
      </Card>

      {practice ? (
        <View>
          <SectionHeader title="Praktik" />
          <PracticeCard
            practice={practice}
            onPress={() => router.push({ pathname: '/practice/[id]', params: { id: practice.id } })}
          />
        </View>
      ) : null}

      <AppText variant="caption" center>
        Dibuat {formatDate(dateWIB(a.createdAt))}
      </AppText>

      <ConfirmDialog
        visible={asking}
        title="Batalkan janji temu?"
        message="Anda yakin ingin membatalkan janji temu ini?"
        cancelLabel="Tidak"
        confirmLabel="Ya, Batalkan"
        destructive
        loading={cancelling}
        onConfirm={cancel}
        onCancel={() => setAsking(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  status: { gap: spacing.sm },
  card: { gap: spacing.lg },
});
