import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { NoticeBox } from '@/components/ui/States';
import { colors, spacing } from '@/constants/theme';
import { resendConfirmation } from '@/features/auth/auth-service';
import { friendlyError } from '@/lib/errors';

export default function CheckEmailScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [message, setMessage] = useState<{ text: string; tone: 'success' | 'danger' } | null>(null);
  const [busy, setBusy] = useState(false);

  const resend = async () => {
    if (!email) return;
    setBusy(true);
    try {
      await resendConfirmation(email);
      setMessage({ text: 'Email konfirmasi sudah dikirim ulang.', tone: 'success' });
    } catch (e) {
      setMessage({ text: friendlyError(e), tone: 'danger' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      edges={['bottom']}
      contentStyle={styles.content}
      footer={<PrimaryButton title="Ke halaman masuk" onPress={() => router.replace('/login')} />}>
      <View style={styles.icon}>
        <Ionicons name="mail-unread-outline" size={40} color={colors.primary} />
      </View>
      <AppText variant="title" center>
        Cek email Anda
      </AppText>
      <AppText center color={colors.textMuted}>
        Kami mengirim link konfirmasi ke{'\n'}
        <AppText variant="bodyStrong">{email ?? 'email Anda'}</AppText>
      </AppText>
      <AppText center color={colors.textMuted}>
        Buka link itu dari HP ini. Setelah itu Anda langsung masuk ke Nakesa Patient. Tidak ada email? Cek folder Spam.
      </AppText>
      {message ? <NoticeBox message={message.text} tone={message.tone} /> : null}
      {email ? <PrimaryButton title="Kirim ulang email" variant="ghost" onPress={resend} loading={busy} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', alignItems: 'stretch' },
  icon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
});
