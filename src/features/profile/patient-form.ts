// Values and checks of the profile form (onboarding and "Ubah Profil"); the fields are in PatientForm.tsx.
import { cleanPhone, displayDateToIso, isoToDisplayDate, isValidPhone, todayWIB } from '@/lib/format';
import type { Gender, PatientAccount } from '@/types/domain';

import type { AccountChanges } from './profile-service';

export type PatientFormValues = {
  fullName: string;
  phone: string;
  birthDate: string; // DD/MM/YYYY as typed
  gender: Gender | null;
  address: string;
  city: string;
  province: string | null;
};

export type PatientFormErrors = Partial<Record<keyof PatientFormValues, string>>;

export const formFromAccount = (a: PatientAccount): PatientFormValues => ({
  fullName: a.fullName,
  phone: a.phone ?? '',
  birthDate: isoToDisplayDate(a.birthDate),
  gender: a.gender,
  address: a.address ?? '',
  city: a.city ?? '',
  province: a.province,
});

/** Checks the form; returns the errors, or the changes to save. */
export function validatePatientForm(
  values: PatientFormValues,
  withIdentity: boolean,
): { errors: PatientFormErrors; changes: AccountChanges | null } {
  const errors: PatientFormErrors = {};
  const birthDate = values.birthDate.trim() ? displayDateToIso(values.birthDate) : null;

  if (withIdentity) {
    if (!values.fullName.trim()) errors.fullName = 'Nama lengkap wajib diisi.';
    if (!isValidPhone(values.phone)) errors.phone = 'Nomor HP belum benar. Contoh: 081234567890';
  }
  if (values.birthDate.trim() && !birthDate) errors.birthDate = 'Tanggal belum benar. Contoh: 17/08/1990';
  else if (birthDate && (birthDate > todayWIB() || birthDate < '1900-01-01')) {
    errors.birthDate = 'Tanggal lahir belum benar.';
  }
  if (Object.keys(errors).length) return { errors, changes: null };

  const changes: AccountChanges = {
    birthDate,
    gender: values.gender,
    address: values.address.trim() || null,
    city: values.city.trim() || null,
    province: values.province,
  };
  if (withIdentity) {
    changes.fullName = values.fullName.trim();
    changes.phone = cleanPhone(values.phone);
  }
  return { errors, changes };
}
