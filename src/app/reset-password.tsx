// New password after opening the reset link (the link has already signed the patient in).
import { router } from 'expo-router';
import { useState } from 'react';

import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { ErrorState, NoticeBox } from '@/components/ui/States';
import { TextField } from '@/components/ui/TextField';
import { MIN_PASSWORD_LENGTH } from '@/constants/config';
import { colors } from '@/constants/theme';
import { updatePassword } from '@/features/auth/auth-service';
import { useAuth } from '@/features/auth/AuthProvider';
import { friendlyError } from '@/lib/errors';

export default function ResetPasswordScreen() {
  const { session } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!session) {
    return (
      <Screen
        edges={['bottom']}
        footer={<PrimaryButton title="Minta link baru" onPress={() => router.replace('/forgot-password')} />}>
        <ErrorState message="Link tidak valid atau sudah kedaluwarsa." />
      </Screen>
    );
  }

  const submit = async () => {
    if (password.length < MIN_PASSWORD_LENGTH) return setError(`Minimal ${MIN_PASSWORD_LENGTH} karakter.`);
    if (confirm !== password) return setError('Kata sandi tidak sama.');
    setError(null);
    setBusy(true);
    try {
      await updatePassword(password);
      setDone(true);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Screen edges={['bottom']} footer={<PrimaryButton title="Lanjut" onPress={() => router.replace('/')} />}>
        <NoticeBox tone="success" message="Kata sandi berhasil diganti. Gunakan kata sandi baru saat masuk berikutnya." />
      </Screen>
    );
  }

  return (
    <Screen edges={['bottom']}>
      <AppText color={colors.textMuted}>Buat kata sandi baru untuk akun {session.user.email}.</AppText>
      {error ? <NoticeBox message={error} /> : null}
      <TextField
        label="Kata sandi baru"
        value={password}
        onChangeText={setPassword}
        password
        autoComplete="new-password"
        hint={`Minimal ${MIN_PASSWORD_LENGTH} karakter.`}
      />
      <TextField
        label="Konfirmasi kata sandi baru"
        value={confirm}
        onChangeText={setConfirm}
        password
        autoComplete="new-password"
        onSubmitEditing={submit}
      />
      <PrimaryButton title="Simpan kata sandi" onPress={submit} loading={busy} />
    </Screen>
  );
}
