import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, StyleSheet, View } from 'react-native';

import { AppointmentCard } from '@/components/AppointmentCard';
import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { ErrorState, LoadingState } from '@/components/ui/States';
import { colors, spacing } from '@/constants/theme';
import { getAppointment } from '@/features/appointment/appointment-service';
import { appointmentWhatsApp } from '@/features/appointment/whatsapp';
import { useAccount } from '@/features/auth/AuthProvider';
import { useAsync } from '@/hooks/useAsync';

export default function BookingSuccessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const account = useAccount();
  const appointment = useAsync(() => getAppointment(id), id);

  const goTo = (path: '/appointments' | '/') => {
    router.dismissAll();
    router.navigate(path);
  };

  if (appointment.loading) return <LoadingState />;
  if (appointment.error || !appointment.data) {
    return (
      <Screen footer={<PrimaryButton title="Lihat janji temu saya" onPress={() => goTo('/appointments')} />}>
        <ErrorState message={appointment.error} onRetry={appointment.reload} />
      </Screen>
    );
  }

  const a = appointment.data;
  const wa = appointmentWhatsApp(a, account.fullName, 'saya sudah membuat janji temu lewat Nakesa Patient:');

  return (
    <Screen
      footer={
        <>
          {wa ? (
            <PrimaryButton title="Kabari praktik via WhatsApp" icon="logo-whatsapp" variant="whatsapp" onPress={() => Linking.openURL(wa)} />
          ) : null}
          <PrimaryButton title="Lihat janji temu saya" variant={wa ? 'secondary' : 'primary'} onPress={() => goTo('/appointments')} />
          <PrimaryButton title="Kembali ke beranda" variant="ghost" onPress={() => goTo('/')} />
        </>
      }>
      <View style={styles.hero}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={48} color="#FFFFFF" />
        </View>
        <AppText variant="title" center>
          Janji temu dibuat!
        </AppText>
        <AppText center color={colors.textMuted}>
          Praktik akan mengonfirmasi janji temu Anda. Status terbaru selalu ada di menu Janji Temu.
        </AppText>
      </View>
      <AppointmentCard appointment={a} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.xl },
  check: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
