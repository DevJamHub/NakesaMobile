import { router } from 'expo-router';
import { useState } from 'react';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { NoticeBox } from '@/components/ui/States';
import { useAccount, useAuth } from '@/features/auth/AuthProvider';
import {
  PatientFormFields,
  formFromAccount,
  validatePatientForm,
  type PatientFormErrors,
} from '@/features/profile/PatientForm';
import { updateAccount } from '@/features/profile/profile-service';
import { friendlyError } from '@/lib/errors';

export default function EditProfileScreen() {
  const account = useAccount();
  const { setAccount } = useAuth();
  const [values, setValues] = useState(() => formFromAccount(account));
  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    const { errors: found, changes } = validatePatientForm(values, true);
    setErrors(found);
    if (!changes) return;
    setBusy(true);
    setError(null);
    try {
      setAccount(await updateAccount(account.id, changes));
      router.back();
    } catch (e) {
      setError(friendlyError(e, 'Profil belum bisa disimpan. Coba lagi.'));
      setBusy(false);
    }
  };

  return (
    <Screen edges={['bottom']} footer={<PrimaryButton title="Simpan" onPress={save} loading={busy} />}>
      {error ? <NoticeBox message={error} /> : null}
      <PatientFormFields values={values} errors={errors} onChange={setValues} withIdentity />
    </Screen>
  );
}
