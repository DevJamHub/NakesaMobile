// Turns Supabase / network errors into short, friendly messages in Bahasa Indonesia.

export const GENERIC_ERROR = 'Terjadi kesalahan. Coba lagi.';
export const NETWORK_ERROR = 'Koneksi internet bermasalah. Periksa jaringan lalu coba lagi.';

const BY_CODE: Record<string, string> = {
  invalid_credentials: 'Email atau kata sandi salah.',
  email_not_confirmed: 'Konfirmasi email Anda dulu. Cek kotak masuk email Anda.',
  user_already_exists: 'Email ini sudah terdaftar. Silakan masuk.',
  email_exists: 'Email ini sudah terdaftar. Silakan masuk.',
  email_address_invalid: 'Format email belum benar.',
  validation_failed: 'Periksa kembali data yang Anda isi.',
  weak_password: 'Pilih kata sandi yang lebih kuat.',
  same_password: 'Kata sandi baru harus berbeda dari yang lama.',
  wrong_current_password: 'Kata sandi saat ini salah.',
  over_email_send_rate_limit: 'Terlalu banyak email terkirim. Tunggu sebentar lalu coba lagi.',
  over_request_rate_limit: 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
  signup_disabled: 'Pendaftaran akun baru sedang ditutup.',
  user_banned: 'Akun ini dinonaktifkan.',
  otp_expired: 'Link sudah kedaluwarsa. Silakan minta link baru.',
  flow_state_expired: 'Link sudah kedaluwarsa. Silakan coba lagi.',
  session_not_found: 'Sesi Anda sudah berakhir. Silakan masuk lagi.',
  refresh_token_not_found: 'Sesi Anda sudah berakhir. Silakan masuk lagi.',
};

type ErrorLike = { name?: string; code?: string; message?: string; status?: number };

export const messageForCode = (code: string | null | undefined) => (code ? BY_CODE[code] ?? null : null);

export function isNetworkError(error: unknown): boolean {
  const e = (error ?? {}) as ErrorLike;
  const message = e.message ?? '';
  return (
    e.name === 'AuthRetryableFetchError' ||
    /network request failed|failed to fetch|network error|load failed/i.test(message)
  );
}

export function friendlyError(error: unknown, fallback = GENERIC_ERROR): string {
  if (__DEV__) console.warn('[error]', error);
  const e = (error ?? {}) as ErrorLike;

  if (isNetworkError(error)) return NETWORK_ERROR;
  // Messages raised by the patient_* database functions are written for patients.
  if (e.code === 'P0001' && e.message) return e.message;
  const byCode = messageForCode(e.code);
  if (byCode) return byCode;
  return fallback;
}
