import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { NoticeBox } from '@/components/ui/States';
import { TextField } from '@/components/ui/TextField';
import { MIN_PASSWORD_LENGTH } from '@/constants/config';
import { colors, spacing } from '@/constants/theme';
import { signUp } from '@/features/auth/auth-service';
import { friendlyError } from '@/lib/errors';
import { isValidEmail, isValidPhone } from '@/lib/format';

type Field = 'fullName' | 'email' | 'phone' | 'password' | 'confirm';

export default function RegisterScreen() {
  const [values, setValues] = useState<Record<Field, string>>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (field: Field) => (text: string) => setValues((v) => ({ ...v, [field]: text }));

  const submit = async () => {
    const next: Partial<Record<Field, string>> = {};
    if (!values.fullName.trim()) next.fullName = 'Nama lengkap wajib diisi.';
    if (!isValidEmail(values.email)) next.email = 'Format email belum benar.';
    if (!isValidPhone(values.phone)) next.phone = 'Nomor HP belum benar. Contoh: 081234567890';
    if (values.password.length < MIN_PASSWORD_LENGTH) next.password = `Minimal ${MIN_PASSWORD_LENGTH} karakter.`;
    if (values.confirm !== values.password) next.confirm = 'Kata sandi tidak sama.';
    setErrors(next);
    setError(null);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const result = await signUp(values);
      if (result === 'confirm_email') {
        router.replace({ pathname: '/check-email', params: { email: values.email.trim() } });
      }
      // 'signed_in': the navigator moves to onboarding by itself.
    } catch (e) {
      setError(friendlyError(e, 'Pendaftaran gagal. Coba lagi.'));
      setBusy(false);
    }
  };

  return (
    <Screen edges={['bottom']}>
      <View style={styles.header}>
        <AppText variant="title">Buat akun</AppText>
        <AppText color={colors.textMuted}>Gratis, hanya butuh satu menit.</AppText>
      </View>

      {error ? <NoticeBox message={error} /> : null}

      <TextField
        label="Nama lengkap"
        value={values.fullName}
        onChangeText={set('fullName')}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        maxLength={120}
        error={errors.fullName}
      />
      <TextField
        label="Email"
        value={values.email}
        onChangeText={set('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        placeholder="nama@email.com"
        error={errors.email}
      />
      <TextField
        label="Nomor HP (WhatsApp)"
        value={values.phone}
        onChangeText={set('phone')}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        placeholder="081234567890"
        maxLength={20}
        error={errors.phone}
      />
      <TextField
        label="Kata sandi"
        value={values.password}
        onChangeText={set('password')}
        password
        autoComplete="new-password"
        textContentType="newPassword"
        hint={`Minimal ${MIN_PASSWORD_LENGTH} karakter.`}
        error={errors.password}
      />
      <TextField
        label="Konfirmasi kata sandi"
        value={values.confirm}
        onChangeText={set('confirm')}
        password
        autoComplete="new-password"
        textContentType="newPassword"
        error={errors.confirm}
        onSubmitEditing={submit}
        returnKeyType="go"
      />

      <AppText variant="caption">
        Saat Anda membuat janji temu, nama dan nomor HP Anda dikirim ke praktik yang Anda pilih agar praktik bisa
        menghubungi Anda.
      </AppText>

      <PrimaryButton title="Daftar" onPress={submit} loading={busy} />
      <PrimaryButton title="Sudah punya akun? Masuk" variant="ghost" onPress={() => router.replace('/login')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, marginBottom: spacing.sm },
});
