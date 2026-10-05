import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { NoticeBox } from '@/components/ui/States';
import { TextField } from '@/components/ui/TextField';
import { colors, spacing } from '@/constants/theme';
import { signIn } from '@/features/auth/auth-service';
import { useAuth } from '@/features/auth/AuthProvider';
import { friendlyError } from '@/lib/errors';
import { isValidEmail } from '@/lib/format';

export default function LoginScreen() {
  const { notice, clearNotice } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    clearNotice();
    if (!isValidEmail(email)) return setError('Format email belum benar.');
    if (!password) return setError('Isi kata sandi Anda.');
    setError(null);
    setBusy(true);
    try {
      await signIn(email, password);
      // The navigator moves to Home (or onboarding) once the account is loaded.
    } catch (e) {
      setError(friendlyError(e, 'Gagal masuk. Periksa email dan kata sandi Anda.'));
      setBusy(false);
    }
  };

  return (
    <Screen edges={['bottom']}>
      <View style={styles.header}>
        <AppText variant="title">Masuk</AppText>
        <AppText color={colors.textMuted}>Selamat datang kembali di Nakesa Patient.</AppText>
      </View>

      {notice ? <NoticeBox message={notice} tone="info" /> : null}
      {error ? <NoticeBox message={error} /> : null}

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        placeholder="nama@email.com"
      />
      <TextField
        label="Kata sandi"
        value={password}
        onChangeText={setPassword}
        password
        autoComplete="current-password"
        textContentType="password"
        onSubmitEditing={submit}
        returnKeyType="go"
      />
      <Link href="/forgot-password" style={styles.forgot}>
        <AppText variant="smallStrong" color={colors.primary}>
          Lupa kata sandi?
        </AppText>
      </Link>

      <PrimaryButton title="Masuk" onPress={submit} loading={busy} />
      <PrimaryButton title="Belum punya akun? Daftar" variant="ghost" onPress={() => router.replace('/register')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, marginBottom: spacing.sm },
  forgot: { alignSelf: 'flex-end', paddingVertical: spacing.xs },
});
