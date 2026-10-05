// Change the password while signed in (Profil → Ubah kata sandi).
import { router } from 'expo-router';
import { useState } from 'react';

import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { NoticeBox } from '@/components/ui/States';
import { TextField } from '@/components/ui/TextField';
import { MIN_PASSWORD_LENGTH } from '@/constants/config';
import { colors } from '@/constants/theme';
import { changePassword } from '@/features/auth/auth-service';
import { useAccount, useAuth } from '@/features/auth/AuthProvider';
import { friendlyError } from '@/lib/errors';

type Field = 'current' | 'next' | 'confirm';

export default function ChangePasswordScreen() {
  const account = useAccount();
  const { session } = useAuth();
  const email = session?.user.email ?? account.email;
  const [values, setValues] = useState<Record<Field, string>>({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (field: Field) => (text: string) => setValues((v) => ({ ...v, [field]: text }));

  const submit = async () => {
    const found: Partial<Record<Field, string>> = {};
    if (!values.current) found.current = 'Isi kata sandi Anda saat ini.';
    if (values.next.length < MIN_PASSWORD_LENGTH) found.next = `Minimal ${MIN_PASSWORD_LENGTH} karakter.`;
    else if (values.next === values.current) found.next = 'Kata sandi baru harus berbeda dari yang lama.';
    if (values.confirm !== values.next) found.confirm = 'Kata sandi tidak sama.';
    setErrors(found);
    setError(null);
    if (Object.keys(found).length) return;
    if (!email) return setError('Email akun tidak ditemukan. Keluar lalu masuk lagi.');

    setBusy(true);
    try {
      await changePassword(email, values.current, values.next);
      setDone(true);
    } catch (e) {
      setError(friendlyError(e, 'Kata sandi belum bisa diganti. Coba lagi.'));
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Screen edges={['bottom']} footer={<PrimaryButton title="Selesai" onPress={() => router.back()} />}>
        <NoticeBox tone="success" message="Kata sandi berhasil diganti. Gunakan kata sandi baru saat masuk berikutnya." />
      </Screen>
    );
  }

  return (
    <Screen edges={['bottom']} footer={<PrimaryButton title="Simpan kata sandi" onPress={submit} loading={busy} />}>
      <AppText color={colors.textMuted}>Untuk keamanan, masukkan dulu kata sandi yang Anda pakai sekarang.</AppText>
      {error ? <NoticeBox message={error} /> : null}
      <TextField
        label="Kata sandi saat ini"
        value={values.current}
        onChangeText={set('current')}
        password
        autoComplete="current-password"
        textContentType="password"
        error={errors.current}
      />
      <TextField
        label="Kata sandi baru"
        value={values.next}
        onChangeText={set('next')}
        password
        autoComplete="new-password"
        textContentType="newPassword"
        hint={`Minimal ${MIN_PASSWORD_LENGTH} karakter.`}
        error={errors.next}
      />
      <TextField
        label="Konfirmasi kata sandi baru"
        value={values.confirm}
        onChangeText={set('confirm')}
        password
        autoComplete="new-password"
        textContentType="newPassword"
        error={errors.confirm}
        onSubmitEditing={submit}
        returnKeyType="go"
      />
    </Screen>
  );
}
