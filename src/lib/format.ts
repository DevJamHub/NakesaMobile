// Formatting for Indonesian dates, times, rupiah, and WhatsApp / phone / map links.
// Dates are "YYYY-MM-DD" strings in WIB (Asia/Jakarta), like the database.

export const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const DAYS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Today in WIB as "YYYY-MM-DD", optionally shifted by some days. */
export function todayWIB(offsetDays = 0): string {
  const date = new Date(Date.now() + WIB_OFFSET_MS);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

/** WIB date ("YYYY-MM-DD") of a timestamp such as created_at. */
export const dateWIB = (timestamp: string) => new Date(new Date(timestamp).getTime() + WIB_OFFSET_MS).toISOString().slice(0, 10);

function parts(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d, dow: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
}

export const dayOfWeek = (iso: string) => parts(iso).dow;

/** "2026-10-06" → "Selasa, 6 Oktober 2026" */
export function formatDate(iso: string, withYear = true): string {
  const { y, m, d, dow } = parts(iso);
  return `${DAYS[dow]}, ${d} ${MONTHS[m - 1]}${withYear ? ` ${y}` : ''}`;
}

/** "Hari ini", "Besok", or "Selasa, 6 Oktober 2026". */
export function friendlyDate(iso: string): string {
  if (iso === todayWIB()) return 'Hari ini';
  if (iso === todayWIB(1)) return 'Besok';
  return formatDate(iso);
}

/** "1990-05-17" → "17/05/1990" */
export function isoToDisplayDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** "17/05/1990" → "1990-05-17", or null when it is not a real date. */
export function displayDateToIso(text: string): string | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text.trim());
  if (!match) return null;
  const [, d, m, y] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Age in years from "YYYY-MM-DD", or null. */
export function age(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;
  const birth = parts(birthDate);
  const today = parts(todayWIB());
  let years = today.y - birth.y;
  if (today.m < birth.m || (today.m === birth.m && today.d < birth.d)) years--;
  return years;
}

/** "08:30" or "08:30:00" → "08.30" */
export const shortTime = (time: string | null | undefined) => (time ? time.slice(0, 5).replace(':', '.') : '');

/** 150000 → "Rp 150.000" */
export function rupiah(amount: number): string {
  return `Rp ${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/** Price label for a service; null prices are never guessed. */
export const priceLabel = (price: number | null) =>
  price === null ? 'Tanya harga ke praktik' : price === 0 ? 'Gratis' : rupiah(price);

export const durationLabel = (minutes: number) =>
  minutes % 60 === 0 ? `${minutes / 60} jam` : minutes > 60 ? `${Math.floor(minutes / 60)} jam ${minutes % 60} menit` : `${minutes} menit`;

/** Keep digits and a leading +, e.g. "0812-3456 789" → "08123456789". */
export const cleanPhone = (phone: string) => phone.trim().replace(/(?!^\+)[^\d]/g, '');

export const isValidPhone = (phone: string) => cleanPhone(phone).replace(/\D/g, '').length >= 9;

/** "0812-3456 789" → "628123456789" (format wa.me expects). */
export function waNumber(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith('8')) digits = `62${digits}`;
  return digits;
}

export function waLink(phone: string, message = ''): string {
  return `https://wa.me/${waNumber(phone)}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

/** "0812-3456 789" → "tel:08123456789" (opens the phone app). */
export const telLink = (phone: string) => `tel:${cleanPhone(phone)}`;

type Place = {
  address?: string | null;
  city?: string | null;
  province?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

/** Google Maps link: the exact pin when the place has coordinates, otherwise a search for its
 *  address (not its name: many small practices are not on Google Maps). Null without an address. */
export function mapsLink(place: Place): string | null {
  const { latitude, longitude } = place;
  const pinned = typeof latitude === 'number' && typeof longitude === 'number';
  if (!pinned && !place.address && !place.city) return null;
  const query = pinned
    ? `${latitude},${longitude}`
    : [place.address, place.city, place.province].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** Greeting by the time of day on the phone. */
export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 18) return 'Selamat sore';
  return 'Selamat malam';
}

/** "Budi Santoso" → "Budi" ("" when there is no name). */
export const firstName = (fullName: string | null | undefined) => (fullName ?? '').trim().split(/\s+/)[0] ?? '';

/** "Budi Santoso" → "BS" */
export function initials(name: string | null | undefined): string {
  const words = (name ?? '').trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((w) => w[0]!.toUpperCase()).join('') || '?';
}
