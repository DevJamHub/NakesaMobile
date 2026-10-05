import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { NoticeBox } from '@/components/ui/States';
import { colors, spacing } from '@/constants/theme';
import { useAccount, useAuth } from '@/features/auth/AuthProvider';
import {
  PatientFormFields,
  formFromAccount,
  validatePatientForm,
  type PatientFormErrors,
} from '@/features/profile/PatientForm';
import { updateAccount } from '@/features/profile/profile-service';
import { friendlyError } from '@/lib/errors';

export default function OnboardingScreen() {
  const account = useAccount();
  const { setAccount } = useAuth();
  const [values, setValues] = useState(() => formFromAccount(account));
  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'save' | 'skip' | null>(null);

  // Saving marks onboarding as done; the navigator then opens Home.
  const finish = async (skip: boolean) => {
    const { errors: found, changes } = skip ? { errors: {}, changes: {} } : validatePatientForm(values, false);
    setErrors(found);
    if (!changes) return;
    setBusy(skip ? 'skip' : 'save');
    setError(null);
    try {
      setAccount(await updateAccount(account.id, { ...changes, onboarded: true }));
    } catch (e) {
      setError(friendlyError(e));
      setBusy(null);
    }
  };

  return (
    <Screen
      footer={
        <>
          <PrimaryButton title="Simpan & mulai" onPress={() => finish(false)} loading={busy === 'save'} disabled={!!busy} />
          <PrimaryButton title="Lewati dulu" variant="ghost" onPress={() => finish(true)} loading={busy === 'skip'} disabled={!!busy} />
        </>
      }>
      <View style={styles.header}>
        <AppText variant="title">Halo, {account.fullName.split(' ')[0]} 👋</AppText>
        <AppText color={colors.textMuted}>
          Lengkapi sedikit data diri supaya praktik lebih mudah melayani Anda. Semua bisa diubah nanti di Profil.
        </AppText>
      </View>
      {error ? <NoticeBox message={error} /> : null}
      <PatientFormFields values={values} errors={errors} onChange={setValues} withIdentity={false} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginTop: spacing.lg },
});
