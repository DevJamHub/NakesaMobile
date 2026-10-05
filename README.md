# Nakesa Patient

Aplikasi mobile untuk **pasien** di ekosistem Nakesa: cari tenaga kesehatan dan praktik, lihat layanan dan
jadwal, buat janji temu, lalu pantau atau batalkan janji temu dari HP.

Nakesa Patient memakai database yang sama dengan **Nakesa Pro** (aplikasi tenaga kesehatan), jadi janji temu
dari pasien langsung muncul di praktik.

## Fitur

- **Akun** — daftar (nama, email, kata sandi, nomor HP) atau **lanjutkan dengan Google**, konfirmasi email,
  masuk/keluar, lupa & reset kata sandi, ubah kata sandi. Sesi tetap tersimpan setelah aplikasi ditutup.
- **Kunci aplikasi dengan Face ID / sidik jari** (opsional, Profil) — diminta saat aplikasi dibuka dan setelah
  ditinggal lebih dari 1 menit; kode/PIN HP sebagai cadangan.
- **Profil pasien** — foto, tanggal lahir, jenis kelamin, nomor HP, alamat, kota/kabupaten, provinsi.
  Onboarding singkat setelah daftar (boleh dilewati).
- **Beranda** — sapaan, kategori profesi (dari database), janji temu berikutnya, praktik di kota pasien.
- **Cari** — nama tenaga kesehatan, nama praktik, profesi, spesialisasi, atau layanan; filter kategori.
- **Detail praktik** — alamat, buka peta, telepon, WhatsApp, jam praktik, layanan & harga, tenaga kesehatan.
- **Profil tenaga kesehatan** — profesi, spesialisasi, tempat praktik, jadwal, layanan.
- **Booking** — pilih layanan → tanggal → jam kosong → konfirmasi (+ catatan) → kabari praktik via WhatsApp.
- **Janji temu** — tab *Akan Datang* dan *Riwayat*, detail, batalkan (status menjadi `CANCELLED`, data tidak
  dihapus), buat janji lagi di praktik yang sama.
- Setiap layar punya tampilan memuat, kosong, dan error (termasuk saat tidak ada internet).

Harga yang belum diisi praktik tidak pernah ditebak ("Tanya harga ke praktik"), dan rating tidak ditampilkan
karena sistem rating belum ada.

## Teknologi

Expo SDK 57 · React Native 0.86 · React 19 · TypeScript · Expo Router (typed routes) · Supabase (Auth,
Postgres + Row Level Security, Storage).

## Menjalankan

Butuh Node.js 22.18 atau lebih baru.

```bash
npm ci
npx expo start
```

Pindai QR code dengan **Expo Go**, atau tekan `a` / `i` untuk emulator. Semua modul native yang dipakai sudah
ada di Expo Go, jadi tidak perlu development build untuk mencoba. Untuk menguji Face ID di iPhone, pakai
development build atau build EAS: di Expo Go perilakunya bisa berbeda (misalnya diganti kode HP).

Koneksi Supabase diambil dari `.env` (contoh: `.env.example`):

```
EXPO_PUBLIC_SUPABASE_URL=…
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=…
```

Hanya **publishable key** yang boleh ada di aplikasi. Jangan pernah memasukkan service-role / secret key.

### Perintah

| Perintah | Fungsi |
| --- | --- |
| `npx expo start` | Dev server |
| `npm run lint` | ESLint (`expo lint`) |
| `npm run typecheck` | TypeScript. Jalankan `npx expo start` sekali dulu agar tipe rute (typed routes) dibuat. |
| `npm test` | Unit test |

## Supabase

Skema, fungsi, dan aturan RLS yang dipakai aplikasi dijelaskan di **[`supabase/README.md`](supabase/README.md)**.
Yang perlu diatur di project Supabase:

1. **Migration aplikasi pasien** (fungsi `patient_*`, tabel `patient_profiles`, bucket `patient-avatars`,
   RLS) sudah dijalankan. File migration-nya belum ada di repo ini — lihat peringatan di `supabase/README.md`.
2. **Redirect URLs** (Authentication → URL Configuration): tambahkan `nakesapatient://**` dan, untuk Expo Go,
   `exp://**`. Link konfirmasi email, reset kata sandi, dan login Google kembali ke layar `auth/callback` di
   aplikasi.
3. **Login Google** — urutannya penting:
   1. Jalankan `supabase/migrations/20261005200000_patient_google_sign_in.sql` (SQL Editor atau
      `supabase db push`). Tanpa fungsi ini, akun Google baru tidak mendapat role pasien dan langsung
      dikeluarkan lagi. Penjelasannya ada di `supabase/README.md`.
   2. Google Cloud Console → APIs & Services: siapkan *OAuth consent screen*, lalu buat *OAuth client ID*
      tipe **Web application** dengan Authorized redirect URI
      `https://fmmudgdkyihbyxntutit.supabase.co/auth/v1/callback`.
   3. Supabase → Authentication → Sign In / Providers → **Google**: aktifkan, isi Client ID dan Client Secret.
4. **Data demo** untuk development: jalankan `supabase/dev/seed_demo.sql` di SQL Editor, hapus lagi dengan
   `supabase/dev/cleanup_demo.sql`.

## Struktur

```
src/
  app/           Layar & navigasi (Expo Router). Setiap file = satu layar, _layout.tsx = navigator.
  components/    Komponen UI: PracticeCard, ServiceCard, AppointmentCard, …; ui/ berisi komponen dasar.
  features/      Logika per fitur — auth, profile, practice, appointment. File *-service.ts = panggilan Supabase.
  hooks/         useAsync (memuat/error/refresh), useRevalidateOnFocus.
  lib/           Klien Supabase, format (tanggal WIB, rupiah, link WA/telepon/peta), pesan error, membuka link.
  constants/     Tema dan konfigurasi.
  types/         Tipe domain.
supabase/        Kontrak database, data demo.
tests/           Unit test.
```

Navigasi diatur oleh guard di `src/app/_layout.tsx`:

| Kondisi | Layar yang tersedia |
| --- | --- |
| Belum masuk | `(auth)`: welcome, login, register, forgot-password, check-email |
| Masuk, belum onboarding | onboarding |
| Masuk & sudah onboarding | `(tabs)`: Beranda, Cari, Janji Temu, Profil · detail praktik · tenaga kesehatan · booking · detail janji temu · ubah profil · ubah kata sandi |
| Selalu | `auth/callback` (link dari email), `reset-password` |

## Keamanan & privasi

- Semua aturan akses ada di database (RLS dan fungsi `patient_*`). Filter di aplikasi hanya untuk tampilan.
- Yang disimpan di HP hanya sesi login; data kesehatan tidak disimpan di perangkat.
- Foto profil ada di bucket privat dan dibuka dengan signed URL berumur 1 jam.
- Praktik hanya menerima nama dan nomor HP pasien saat pasien membuat janji temu.
- Ubah kata sandi selalu meminta kata sandi lama dulu.
- Login Google berjalan di browser HP (Supabase OAuth); aplikasi tidak pernah melihat kata sandi Google.
  Role pasien untuk akun Google baru diputuskan oleh database, bukan oleh aplikasi.
- Kunci aplikasi tidak menyimpan kata sandi apa pun: sesi tetap tersimpan seperti biasa, hanya dibuka dengan
  Face ID / sidik jari / kode HP. Pilihan aktif atau tidaknya disimpan per akun di HP itu saja.

## Testing

`npm test` menjalankan unit test untuk logika yang tidak butuh HP atau server: tanggal WIB, rupiah, nomor
HP/WhatsApp/link peta, status janji temu, nama & jadwal praktik, validasi profil, dan pembacaan link email.
Test memakai test runner bawaan Node (`node:test`), tanpa paket tambahan; `tests/setup/` membuat Node bisa
membaca import `@/…` dari `src/`.

Alur lengkap (daftar → booking → batal) perlu diuji di HP dengan database sungguhan. Daftar periksanya:

- [ ] Daftar akun baru → akun otomatis menjadi pasien → onboarding → Beranda.
- [ ] "Lanjutkan dengan Google" dengan akun Google baru → onboarding meminta nomor HP → Beranda. Dengan email
      pasien yang sudah ada → langsung masuk ke akun yang sama. Dengan akun Nakesa Pro → ditolak dengan pesan.
- [ ] Profil → aktifkan "Kunci dengan Face ID / sidik jari" → tutup dan buka lagi aplikasi → diminta membuka
      kunci; "Keluar dan masuk lagi" tetap bisa dipakai.
- [ ] Tutup lalu buka lagi aplikasi → tetap masuk.
- [ ] Cari praktik demo → buka detail → lihat layanan → pilih layanan, tanggal, dan jam → buat janji temu.
- [ ] Janji temu muncul di Supabase (`bookings`), di Nakesa Pro, dan di menu Janji Temu.
- [ ] Batalkan janji temu → pindah ke Riwayat dengan status Dibatalkan.
- [ ] Akun pasien lain tidak bisa melihat janji temu tersebut, dan pasien tidak bisa mengubah data praktik
      (lihat "Cek RLS secara manual" di `supabase/README.md`).

## Build & rilis (EAS)

```bash
npx eas-cli@latest login
npx eas-cli@latest init                                  # sekali, menautkan project Expo
npx eas-cli@latest build -p android --profile preview    # APK untuk dicoba di HP
npx eas-cli@latest build --profile production            # untuk Play Store / App Store
```

Profil `development` membutuhkan `expo-dev-client` (`npx expo install expo-dev-client`).

### Sebelum rilis

- [ ] Tentukan `android.package` dan `ios.bundleIdentifier` di `app.json` (misal `id.nakesa.patient`). Tidak
      bisa diganti setelah aplikasi terbit.
- [ ] Commit file migration database ke repo (lihat `supabase/README.md`).
- [ ] Jalankan `supabase/dev/cleanup_demo.sql` di database produksi.
- [ ] Pasang SMTP sendiri di Supabase (Authentication → Emails). Layanan email bawaan Supabase hanya untuk
      percobaan dan batas kirimnya sangat kecil, padahal pendaftaran butuh email konfirmasi.
- [ ] Publikasikan OAuth consent screen di Google Cloud (status *In production*). Selama masih *Testing*,
      hanya akun yang terdaftar sebagai test user yang bisa masuk dengan Google. Cek juga tampilan tombol
      terhadap pedoman branding "Sign in with Google".
- [ ] Sediakan **hapus akun** dari dalam aplikasi — wajib di Google Play dan App Store untuk aplikasi yang bisa
      membuat akun. Perlu fungsi database yang menghapus akun pasien dan menganonimkan riwayat janji temunya di
      praktik.
- [ ] Siapkan halaman kebijakan privasi (diminta store, apalagi untuk aplikasi kesehatan).
- [ ] Ganti ikon dan splash screen bawaan template di `assets/`.

## Rencana berikutnya

Dari spesifikasi MVP (`NAKESA_PATIENT_MVP_PROMPT.md`):

- **Fase 2** — rekam medis, resep, obat, dokumen kesehatan, consent, notifikasi (mis. pengingat janji temu).
- **Fase 3** — pembayaran, konsultasi online, chat, telemedicine, resep digital.
- **Fase 4** — health tracking, asisten AI, insight kesehatan, integrasi eksternal.

Perbaikan kecil yang bisa menyusul: jarak dan urutan "praktik terdekat" memakai lokasi HP (butuh
`expo-location` dan koordinat praktik), serta ubah jadwal janji temu tanpa membatalkan.
