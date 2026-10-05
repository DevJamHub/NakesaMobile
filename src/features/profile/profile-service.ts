// Patient account: name/email/role from `profiles`, personal data from `patient_profiles`.
// RLS lets a patient read and change only their own rows.
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { supabase } from '@/lib/supabase';
import type { Gender, PatientAccount, Role } from '@/types/domain';

const AVATAR_BUCKET = 'patient-avatars';

type ProfileRow = { id: string; full_name: string | null; email: string | null; role: Role };
type PatientRow = {
  phone: string | null;
  birth_date: string | null;
  gender: Gender | null;
  address: string | null;
  city: string | null;
  province: string | null;
  avatar_path: string | null;
  onboarded_at: string | null;
};

const PATIENT_COLUMNS = 'phone, birth_date, gender, address, city, province, avatar_path, onboarded_at';

function toAccount(profile: ProfileRow, patient: PatientRow | null): PatientAccount {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name ?? '',
    role: profile.role,
    phone: patient?.phone ?? null,
    birthDate: patient?.birth_date ?? null,
    gender: patient?.gender ?? null,
    address: patient?.address ?? null,
    city: patient?.city ?? null,
    province: patient?.province ?? null,
    avatarPath: patient?.avatar_path ?? null,
    onboardedAt: patient?.onboarded_at ?? null,
  };
}

/** The signed-in user's account. The profile row is made by a trigger at sign-up,
 *  so retry briefly in case we arrive before it exists. */
export async function fetchAccount(userId: string, attempts = 3): Promise<PatientAccount | null> {
  for (let i = 0; i < attempts; i++) {
    const [profile, patient] = await Promise.all([
      supabase.from('profiles').select('id, full_name, email, role').eq('id', userId).maybeSingle<ProfileRow>(),
      supabase.from('patient_profiles').select(PATIENT_COLUMNS).eq('id', userId).maybeSingle<PatientRow>(),
    ]);
    if (profile.error) throw profile.error;
    if (patient.error) throw patient.error;
    if (profile.data) return toAccount(profile.data, patient.data);
    await new Promise((resolve) => setTimeout(resolve, 300 * (i + 1)));
  }
  return null;
}

export type AccountChanges = Partial<{
  fullName: string;
  phone: string | null;
  birthDate: string | null;
  gender: Gender | null;
  address: string | null;
  city: string | null;
  province: string | null;
  avatarPath: string | null;
  onboarded: boolean;
}>;

export async function updateAccount(userId: string, changes: AccountChanges): Promise<PatientAccount> {
  if (changes.fullName !== undefined) {
    const { error } = await supabase.from('profiles').update({ full_name: changes.fullName.trim() }).eq('id', userId);
    if (error) throw error;
  }

  const patient: Record<string, unknown> = {};
  if (changes.phone !== undefined) patient.phone = changes.phone;
  if (changes.birthDate !== undefined) patient.birth_date = changes.birthDate;
  if (changes.gender !== undefined) patient.gender = changes.gender;
  if (changes.address !== undefined) patient.address = changes.address;
  if (changes.city !== undefined) patient.city = changes.city;
  if (changes.province !== undefined) patient.province = changes.province;
  if (changes.avatarPath !== undefined) patient.avatar_path = changes.avatarPath;
  if (changes.onboarded) patient.onboarded_at = new Date().toISOString();

  if (Object.keys(patient).length > 0) {
    const { error } = await supabase.from('patient_profiles').upsert({ id: userId, ...patient });
    if (error) throw error;
  }

  const account = await fetchAccount(userId, 1);
  if (!account) throw new Error('Profil tidak ditemukan.');
  return account;
}

/** Resize the picked photo, upload it to the patient's own folder and return its path. */
export async function uploadAvatar(userId: string, imageUri: string): Promise<string> {
  const image = await ImageManipulator.manipulate(imageUri).resize({ width: 512 }).renderAsync();
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.7, base64: true });
  if (!saved.base64) throw new Error('Foto tidak bisa diproses.');

  const binary = atob(saved.base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  // A new name each time, so an old cached photo is never shown.
  const path = `${userId}/avatar-${Date.now()}.jpg`;
  const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(path, bytes.buffer, { contentType: 'image/jpeg' });
  if (error) throw error;
  return path;
}

export async function removeAvatarFile(path: string) {
  await supabase.storage.from(AVATAR_BUCKET).remove([path]);
}

/** Short-lived link to the patient's private photo. */
export async function avatarUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from(AVATAR_BUCKET).createSignedUrl(path, 60 * 60);
  if (error) return null;
  return data.signedUrl;
}
