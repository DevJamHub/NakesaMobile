// Step 4 of booking: check everything, add an optional note, create the appointment.
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { InfoRow } from '@/components/ui/InfoRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { ErrorState, LoadingState, NoticeBox } from '@/components/ui/States';
import { TextField } from '@/components/ui/TextField';
import { spacing } from '@/constants/theme';
import { bookAppointment } from '@/features/appointment/appointment-service';
import { useAccount } from '@/features/auth/AuthProvider';
import { getPractice } from '@/features/practice/practice-service';
import { practicePlace } from '@/features/practice/profession';
import { useAsync } from '@/hooks/useAsync';
import { friendlyError } from '@/lib/errors';
import { durationLabel, formatDate, priceLabel, shortTime } from '@/lib/format';

type Params = {
  practiceId: string;
  date: string;
  time: string;
  endTime: string;
  serviceId: string;
  serviceName: string;
  healthWorkerId: string;
  healthWorkerName: string;
};

export default function ConfirmBookingScreen() {
  const params = useLocalSearchParams<Params>();
  const account = useAccount();
  const practice = useAsync(() => getPractice(params.practiceId), params.practiceId);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [slotTaken, setSlotTaken] = useState(false);
  const [busy, setBusy] = useState(false);

  if (practice.loading) return <LoadingState />;
  if (practice.error || !practice.data) return <ErrorState message={practice.error} onRetry={practice.reload} />;

  const p = practice.data;
  const service = p.services.find((s) => (params.serviceId ? s.id === params.serviceId : s.name === params.serviceName));

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const id = await bookAppointment({
        practiceId: params.practiceId,
        date: params.date,
        time: params.time,
        serviceId: params.serviceId || null,
        serviceName: params.serviceName || null,
        healthWorkerId: params.healthWorkerId || null,
        notes,
      });
      // Replace, so "back" can never send the same booking twice.
      router.replace({ pathname: '/booking/success', params: { id } });
    } catch (e) {
      const message = friendlyError(e, 'Janji temu belum bisa dibuat. Coba lagi.');
      setError(message);
      setSlotTaken(message.includes('tidak tersedia'));
      setBusy(false);
    }
  };

  return (
    <Screen
      edges={['bottom']}
      footer={
        slotTaken ? (
          <PrimaryButton title="Pilih jam lain" onPress={() => router.back()} />
        ) : (
          <PrimaryButton title="Buat Janji Temu" icon="checkmark-circle" onPress={submit} loading={busy} />
        )
      }>
      <AppText variant="h2">Periksa kembali janji temu Anda</AppText>
      {error ? <NoticeBox message={error} /> : null}

      <Card style={styles.card}>
        <InfoRow icon="business-outline" label="Praktik">
          <AppText variant="bodyStrong">{p.name}</AppText>
          {practicePlace(p) ? <AppText variant="small">{practicePlace(p)}</AppText> : null}
        </InfoRow>
        {params.serviceName ? (
          <InfoRow icon="medkit-outline" label="Layanan">
            <AppText variant="bodyStrong">{params.serviceName}</AppText>
            {service ? (
              <AppText variant="small">
                {priceLabel(service.price)}
                {service.id ? ` · ${durationLabel(service.duration_minutes)}` : ''}
              </AppText>
            ) : null}
          </InfoRow>
        ) : null}
        <InfoRow icon="calendar-outline" label="Tanggal">
          <AppText variant="bodyStrong">{formatDate(params.date)}</AppText>
        </InfoRow>
        <InfoRow icon="time-outline" label="Jam">
          <AppText variant="bodyStrong">
            {shortTime(params.time)}–{shortTime(params.endTime)} WIB
          </AppText>
        </InfoRow>
        {params.healthWorkerName ? (
          <InfoRow icon="person-outline" label="Tenaga kesehatan">
            {params.healthWorkerName}
          </InfoRow>
        ) : null}
      </Card>

      <Card style={styles.card}>
        <AppText variant="smallStrong">Data yang dikirim ke praktik</AppText>
        <InfoRow icon="person-circle-outline" label="Nama">
          {account.fullName}
        </InfoRow>
        <InfoRow icon="call-outline" label="Nomor HP">
          {account.phone ?? '-'}
        </InfoRow>
        {!account.phone ? (
          <NoticeBox message="Nomor HP belum diisi. Isi dulu di Profil → Ubah profil." />
        ) : null}
      </Card>

      <View>
        <TextField
          label="Catatan untuk praktik"
          value={notes}
          onChangeText={setNotes}
          multiline
          maxLength={500}
          optional
          placeholder="Misal: keluhan singkat atau permintaan khusus"
          hint="Cukup tulis yang perlu diketahui praktik sebelum Anda datang."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
});
