# Database Nakesa Patient

Nakesa Patient **tidak punya database sendiri**. Aplikasi ini memakai project Supabase **NAKESA** yang sama
dengan Nakesa Pro, sehingga janji temu yang dibuat pasien langsung masuk ke praktik di Nakesa Pro.

Dokumen ini adalah **kontrak** antara aplikasi dan database: semua tabel, fungsi, bucket, dan aturan yang
dipanggil oleh kode di `src/`. Kalau salah satu diubah di database, sesuaikan juga service di
`src/features/*/…-service.ts` (dan sebaliknya).

> [!WARNING]
> **File migration belum ada di repo ini.** `dev/seed_demo.sql` menyebut migration
> `20261005170000_patient_app.sql` (fungsi `patient_*`, tabel `patient_profiles`, bucket `patient-avatars`,
> RLS), tetapi file itu tidak ikut di-commit. Ambil dari tempat migration itu dijalankan (repo Nakesa Pro atau
> riwayat migration di Supabase), atau buat ulang dari database dengan `supabase db pull`, lalu simpan di
> `supabase/migrations/` agar bisa di-review dan dijalankan ulang. Migration yang sudah ada di folder itu
> (`20261005200000_patient_google_sign_in.sql`) dijalankan **setelah** migration tersebut.

## Tabel yang diakses langsung (dilindungi RLS)

| Tabel | Dari aplikasi | Kolom yang dipakai | Aturan RLS yang wajib |
| --- | --- | --- | --- |
| `profiles` | `select`, `update` | `id, full_name, email, role` | Pasien hanya membaca & mengubah barisnya sendiri. **Kolom `role` (dan `profession`) tidak boleh bisa diubah pasien** — pakai column privilege atau trigger, karena aplikasi memang meng-update `full_name` di tabel ini. |
| `patient_profiles` | `select`, `upsert` | `id, phone, birth_date, gender ('L'/'P'), address, city, province, avatar_path, onboarded_at` | Insert/select/update hanya jika `id = auth.uid()`. |
| `professions` | `select` | `key, label, title, icon, color, sort_order` | Boleh dibaca semua user yang masuk. |

Tabel lain (`practices`, `practice_hours`, `practice_services`, `bookings`, …) **tidak** diakses langsung oleh
aplikasi pasien; semuanya lewat fungsi di bawah.

## Fungsi (RPC)

Semua fungsi hanya mengembalikan praktik yang `is_listed` dan hanya data publiknya, serta hanya janji temu milik
`auth.uid()`. Bentuk JSON hasilnya sama dengan tipe di `src/types/domain.ts`.

| Fungsi | Parameter | Hasil | Dipakai di |
| --- | --- | --- | --- |
| `patient_search_practices` | `p_query text`, `p_profession text`, `p_city text`, `p_limit int`, `p_offset int` (semua boleh `null` kecuali limit/offset) | `PracticeSummary[]` — praktik di `p_city` lebih dulu | Beranda, Cari |
| `patient_get_practice` | `p_practice_id uuid` | `PracticeDetail` (jam praktik, layanan, tenaga kesehatan) | Detail praktik, booking |
| `patient_get_health_worker` | `p_user_id uuid` | `HealthWorkerDetail` | Profil tenaga kesehatan |
| `patient_available_slots` | `p_practice_id uuid`, `p_date date`, `p_service_id uuid` (boleh `null`) | `TimeSlot[]` = `{ start, end, available }` | Pilih jam |
| `patient_book_appointment` | `p_practice_id`, `p_date`, `p_time`, `p_service_id`, `p_service_name`, `p_health_worker_id`, `p_notes` | `uuid` janji temu baru | Konfirmasi booking |
| `patient_list_appointments` | – | `AppointmentRow[]`, **urut tanggal naik** (aplikasi membalik urutan untuk Riwayat) | Janji Temu, Beranda |
| `patient_get_appointment` | `p_booking_id uuid` | `AppointmentRow` | Detail janji temu, booking sukses |
| `patient_cancel_appointment` | `p_booking_id uuid` | – (status jadi `batal`, baris tidak dihapus) | Batalkan janji temu |
| `patient_claim_new_account` | – | – (role akun Google baru menjadi `PATIENT`, atau error `P0001`) | Setelah login Google |

`AppointmentRow` (lihat `src/features/appointment/appointment-service.ts`):
`id, status, date, start_time, end_time, service, service_id, notes, created_at, updated_at, can_cancel,
practice (PracticeSummary), health_worker ({ id, full_name, profession })`.

Catatan penting:

- **Pesan error untuk pasien.** Fungsi menolak dengan `raise exception '…'` (kode `P0001`) berisi kalimat
  Bahasa Indonesia; aplikasi menampilkannya apa adanya (`src/lib/errors.ts`). Pesan saat jam sudah diambil
  orang lain harus mengandung kata **"tidak tersedia"** — layar konfirmasi memakai itu untuk menawarkan
  tombol "Pilih jam lain".
- **Status.** `bookings.status` (bahasa Nakesa Pro) dipetakan di aplikasi: `baru → PENDING`,
  `dikonfirmasi → CONFIRMED`, `selesai → COMPLETED`, `batal → CANCELLED`, `ditolak → REJECTED`.
- **Aturan pembatalan** ada di database dan dikirim sebagai `can_cancel`; aplikasi hanya menampilkan tombol.
- **Batas booking** 60 hari ke depan: `BOOKING_DAYS_AHEAD` di `src/constants/config.ts` harus sama dengan
  aturan di database.
- **Zona waktu**: tanggal & jam memakai WIB (Asia/Jakarta), sama seperti Nakesa Pro.

## Storage

Bucket privat **`patient-avatars`**. Foto disimpan di `<user_id>/avatar-<timestamp>.jpg` dan dibuka dengan
signed URL (1 jam). Policy: pasien hanya boleh `insert`, `select`, dan `delete` objek di folder
`auth.uid()`-nya sendiri.

## Auth

- Daftar dengan metadata `full_name`, `phone`, dan `app: 'nakesa_patient'`. Trigger sign-up membuat baris
  `profiles` dengan role **`PATIENT`** untuk metadata itu (role tidak pernah dikirim dari aplikasi).
- Akun dengan role selain `PATIENT` (mis. tenaga kesehatan) dikeluarkan lagi oleh aplikasi dengan pesan;
  fungsi `patient_*` juga menolak role lain.
- **Redirect URLs** (Authentication → URL Configuration) harus berisi `nakesapatient://**` untuk build dan
  `exp://**` untuk Expo Go, karena link konfirmasi, reset kata sandi, dan login Google kembali ke
  `…/auth/callback`.

### Login Google

Login Google memakai provider Google di Supabase Auth: aplikasi membuka browser HP, lalu Supabase
mengembalikan sesi ke `…/auth/callback` (flow implicit, sama seperti link email).

Masalahnya, akun Google baru **tidak bisa** mengirim `app: 'nakesa_patient'` saat dibuat, sehingga trigger
sign-up memberinya role bawaan (bukan `PATIENT`). Karena itu, setelah akun Google masuk dan belum menjadi
pasien, aplikasi memanggil `patient_claim_new_account()` (`migrations/20261005200000_patient_google_sign_in.sql`).
Fungsi ini hanya mengubah role menjadi `PATIENT` jika akunnya:

- dibuat lewat Google/provider sosial (bukan email/kata sandi),
- dibuat kurang dari 15 menit yang lalu, dan
- tidak memiliki praktik di Nakesa Pro.

Selain itu fungsi menolak dengan pesan `P0001`, dan aplikasi mengeluarkan akun itu lagi dengan pesan tersebut.
Pasien yang sudah terdaftar dengan email (dan sudah dikonfirmasi) lalu login dengan Google memakai email yang
sama ditautkan otomatis oleh Supabase ke akun yang sama, jadi role pasiennya tetap. Fungsi ini sudah diuji dengan PostgreSQL 16 pada skema tiruan;
cocokkan dulu dengan trigger sign-up dan tabel Nakesa Pro sebelum dijalankan di produksi.

Jalankan migration ini **sebelum** provider Google diaktifkan. Kalau provider aktif lebih dulu, akun Google
yang sempat dibuat tetap memakai role bawaan; setelah 15 menit akun itu tidak bisa lagi diklaim dan perlu
dihapus atau diubah manual di Supabase.

## Data demo (development saja)

- `dev/seed_demo.sql` — 3 tenaga kesehatan demo + praktik, jam praktik, dan layanan. Login Nakesa Pro:
  `demo-bidan@nakesa.test`, `demo-drg@nakesa.test`, `demo-fisio@nakesa.test` (kata sandi `DemoNakesa123`).
- `dev/cleanup_demo.sql` — menghapus semuanya lagi. **Jalankan sebelum aplikasi dirilis.**

## Cek RLS secara manual

Jalankan di Supabase → SQL Editor. Semua di dalam transaksi yang di-`rollback`, jadi tidak ada data yang
berubah. Ganti `<…>` dengan id dua akun pasien (A dan B) dan id janji temu milik A.

```sql
begin;
set local role authenticated;
set local request.jwt.claims = '{"sub": "<id pasien B>", "role": "authenticated"}';

select count(*) from public.patient_profiles;                    -- harus 1 (hanya milik B)
select count(*) from public.profiles
 where id <> auth.uid() and role = 'PATIENT';                   -- harus 0 (pasien lain tak terlihat)
select * from public.patient_get_appointment('<id janji temu A>'); -- harus error
update public.practices set name = name returning id;           -- harus 0 baris (atau error)
update public.practice_services set price = price returning id; -- harus 0 baris (atau error)
update public.profiles set role = 'ADMIN' where id = auth.uid() returning id; -- harus error / 0 baris

rollback;
```

Lalu di aplikasi: login sebagai A dan buat janji temu; login sebagai B dan pastikan janji temu A tidak muncul
di menu Janji Temu.
