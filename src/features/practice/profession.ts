// Display helpers for professions (same rules as Nakesa Pro's js/professions.js).
import type { HealthWorker, PracticeHour, PracticeSummary, Profession } from '@/types/domain';
import { DAYS } from '@/lib/format';
import { colors } from '@/constants/theme';

/** "Bidan Siti", "drg. Andi" — skips the title when the name already starts with it.
 *  "" without a name (never a title on its own). */
export function titledName(fullName: string | null | undefined, profession: Profession | null | undefined): string {
  const name = (fullName ?? '').trim();
  const title = profession?.title ?? '';
  if (!name || !title || name.toLowerCase().startsWith(title.toLowerCase())) return name;
  return `${title} ${name}`;
}

export const professionColor = (profession: Profession | null | undefined) => profession?.color ?? colors.primary;

export const professionIcon = (profession: Profession | null | undefined) => profession?.icon || '🏥';

/** "Dokter Spesialis Anak" / "Bidan" */
export function practiceSubtitle(practice: Pick<PracticeSummary, 'profession' | 'specialty'>): string {
  const label = practice.profession?.label ?? 'Tenaga kesehatan';
  return practice.specialty ? `${label} · ${practice.specialty}` : label;
}

export const healthWorkerName = (hw: Pick<HealthWorker, 'full_name' | 'profession'>) => titledName(hw.full_name, hw.profession);

/** "Jl. Melati 12, Surabaya" */
export const practicePlace = (practice: Pick<PracticeSummary, 'address' | 'city'>) =>
  [practice.address, practice.city].filter(Boolean).join(', ');

/** "Kota Surabaya" / "Kab. Sidoarjo" / " surabaya " → "surabaya" / "sidoarjo" / "surabaya" */
const cityKey = (city: string | null | undefined) =>
  (city ?? '').trim().toLowerCase().replace(/^(kota|kabupaten|kab)\b\.?\s*/, '');

/** Whether the practice is in the patient's city ("Kota Surabaya" and "surabaya" are the same). */
export function isInCity(practice: Pick<PracticeSummary, 'city'>, city: string | null | undefined): boolean {
  const key = cityKey(practice.city);
  return !!key && key === cityKey(city);
}

/** Practice hours grouped per day, Monday first: [{ day, label, sessions: ['08.00–12.00'] }] */
export function weekSchedule(hours: PracticeHour[]) {
  return [1, 2, 3, 4, 5, 6, 0].map((day) => ({
    day,
    label: DAYS[day],
    sessions: hours
      .filter((h) => h.day === day)
      .map((h) => `${h.opens.replace(':', '.')}–${h.closes.replace(':', '.')}`),
  }));
}
