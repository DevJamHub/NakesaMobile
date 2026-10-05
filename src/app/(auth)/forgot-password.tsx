import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { NoticeBox } from '@/components/ui/States';
import { TextField } from '@/components/ui/TextField';
import { colors, spacing } from '@/constants/theme';
import { sendPasswordReset } from '@/features/auth/auth-service';
import { friendlyError } from '@/lib/errors';
import { isValidEmail } from '@/lib/format';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!isValidEmail(email)) return setError('Format email belum benar.');
    setError(null);
    setBusy(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen edges={['bottom']}>
      <View style={styles.header}>
        <AppText variant="title">Lupa kata sandi</AppText>
        <AppText color={colors.textMuted}>
          Masukkan email akun Anda. Kami kirim link untuk membuat kata sandi baru.
        </AppText>
      </View>

      {error ? <NoticeBox message={error} /> : null}
      {sent ? (
        <NoticeBox
          tone="success"
          message="Jika email itu terdaftar, link sudah dikirim. Buka link dari HP ini untuk membuat kata sandi baru."
        />
      ) : null}

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="nama@email.com"
        onSubmitEditing={submit}
        returnKeyType="send"
      />
      <PrimaryButton title={sent ? 'Kirim ulang link' : 'Kirim link'} onPress={submit} loading={busy} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, marginBottom: spacing.sm },
});
