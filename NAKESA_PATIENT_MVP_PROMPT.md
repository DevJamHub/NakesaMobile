# Nakesa Patient — MVP Development Prompt

## Project Overview

Bangun aplikasi mobile **Nakesa Patient**, aplikasi khusus pasien yang menjadi bagian dari ekosistem Nakesa.

Nakesa Patient bukan aplikasi management tenaga kesehatan. Fokus MVP adalah:

- pasien membuat akun
- pasien mengelola profil
- mencari tenaga kesehatan/praktik
- melihat layanan
- melakukan booking
- melihat dan membatalkan appointment

### Technology Stack

- React Native
- Expo
- TypeScript
- Expo Router
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage jika diperlukan

Gunakan arsitektur yang clean, scalable, dan mobile-first.

---

## 1. Konsep Ekosistem

Nakesa memiliki dua sisi aplikasi:

```text
NAKESA ECOSYSTEM
│
├── Nakesa Pro
│   └── Untuk tenaga kesehatan / pengelola praktik
│
└── Nakesa Patient
    └── Untuk pasien
```

Keduanya menggunakan backend/database Nakesa yang sama.

Jangan membuat database terpisah jika database Nakesa sudah tersedia. Nakesa Patient hanya boleh mengakses data sesuai authentication, authorization, RLS, dan consent.

---

## 2. Tujuan MVP

MVP harus memungkinkan pasien:

1. Register
2. Login/logout
3. Membuat dan mengedit profil
4. Mencari tenaga kesehatan
5. Mencari praktik
6. Melihat detail praktik
7. Melihat layanan
8. Memilih layanan dan jadwal
9. Membuat booking
10. Melihat appointment mendatang
11. Melihat riwayat appointment
12. Membatalkan appointment

Jangan implementasikan fitur kompleks yang belum diperlukan.

---

## 3. Core User Flow

```text
Install App
    ↓
Welcome
    ↓
Login / Register
    ↓
Onboarding
    ↓
Home
    ↓
Cari Praktik / Nakes
    ↓
Detail Praktik
    ↓
Pilih Layanan
    ↓
Pilih Jadwal
    ↓
Konfirmasi Booking
    ↓
Appointment Created
    ↓
My Appointment
```

---

## 4. Authentication

Gunakan Supabase Auth.

Support:

- Email/password
- Session persistence
- Forgot password
- Reset password
- Logout

Form register:

```text
Nama Lengkap
Email
Password
Konfirmasi Password
Nomor Telepon
```

Jangan menyimpan password sendiri di database.

---

## 5. User Role

Gunakan role:

```text
PATIENT
HEALTH_WORKER
PRACTICE_ADMIN
ADMIN
```

Untuk aplikasi ini user harus memiliki role `PATIENT`.

Role tidak boleh hanya dipercaya dari frontend. Gunakan database/RLS untuk authorization.

---

## 6. Patient Profile

Halaman **My Profile**:

```text
Nama lengkap
Foto profil
Tanggal lahir
Jenis kelamin
Nomor telepon
Email
Alamat
Kota/Kabupaten
Provinsi
```

Untuk MVP jangan meminta terlalu banyak data kesehatan sensitif. Jangan membuat field diagnosis/penyakit/rekam medis hanya untuk onboarding.

---

## 7. Home

Home sederhana dan consumer-facing.

Contoh:

```text
Good morning, [Nama] 👋

Apa yang kamu butuhkan?

[ 🔍 Cari dokter, bidan, praktik... ]

Kategori
------------------------
🩺 Dokter
🦷 Dokter Gigi
👩‍⚕️ Bidan
💉 Perawat
🦵 Fisioterapis
🧠 Psikolog
💊 Apoteker

Praktik terdekat
------------------------
[ Practice Card ]

Appointment berikutnya
------------------------
[ Appointment Card ]
```

Kategori sebaiknya berasal dari database jika sudah tersedia.

---

## 8. Search

Pasien dapat mencari berdasarkan:

- nama tenaga kesehatan
- nama praktik
- profesi
- spesialisasi
- layanan

Contoh:

```text
Dokter gigi
dr. Andi
Praktik Bidan
Scaling
Fisioterapi
```

Untuk MVP gunakan search yang sederhana dan scalable; tidak perlu algoritma pencarian kompleks.

---

## 9. Practice List

Tampilkan:

```text
Nama praktik
Profesi utama
Alamat
Kota
Rating jika tersedia
Status buka/tutup jika tersedia
Jarak jika location tersedia
```

Jangan membuat rating palsu. Jika sistem rating belum tersedia, jangan tampilkan rating.

---

## 10. Practice Detail

Contoh struktur:

```text
[Foto]

Praktik Bidan Sehat Ibu
Bidan

📍 Alamat
🕐 Jam praktik
📞 Nomor telepon

Tentang praktik

Layanan
----------------
Pemeriksaan Kehamilan
Konsultasi
KB
Pemeriksaan Bayi

Tenaga Kesehatan
----------------
👩‍⚕️ Nama Bidan

[ BOOK APPOINTMENT ]
```

---

## 11. Health Worker Profile

Pasien dapat melihat:

```text
Foto
Nama
Gelar
Profesi
Spesialisasi
Praktik
Pengalaman jika tersedia
Layanan
Jadwal praktik
```

Jangan menampilkan data sensitif atau dokumen verifikasi internal. Nomor STR/SIP hanya ditampilkan jika memang dirancang sebagai data publik dan sesuai regulasi.

---

## 12. Services

Setiap praktik dapat memiliki banyak layanan.

Contoh:

```text
Layanan
├── Konsultasi Umum
├── Pemeriksaan Kehamilan
├── Scaling
├── Fisioterapi
└── Konsultasi Psikologi
```

Minimal service:

```text
id
practice_id
name
description
price
duration
status
```

Harga boleh nullable. Jangan membuat harga dummy untuk data produksi.

---

## 13. Booking

Flow:

```text
Practice
   ↓
Service
   ↓
Date
   ↓
Available Time
   ↓
Confirmation
   ↓
Booking Created
```

Appointment:

```text
id
patient_id
practice_id
health_worker_id
service_id
appointment_date
start_time
end_time
status
notes
created_at
updated_at
```

Status:

```text
PENDING
CONFIRMED
COMPLETED
CANCELLED
REJECTED
```

---

## 14. Appointment Screen

Gunakan dua tab:

```text
Upcoming
History
```

Upcoming menampilkan appointment yang akan datang.

History menampilkan appointment yang sudah selesai/dibatalkan.

---

## 15. Cancel Appointment

Pasien dapat membatalkan appointment yang masih memenuhi aturan pembatalan.

Konfirmasi:

```text
Batalkan appointment?

Anda yakin ingin membatalkan appointment ini?

[ Tidak ]
[ Ya, Batalkan ]
```

Ubah status menjadi:

```text
CANCELLED
```

Jangan hard-delete appointment karena record diperlukan sebagai history/audit.

---

## 16. Location

Untuk MVP gunakan alamat dan kota terlebih dahulu.

Jika location sudah tersedia, simpan:

```text
latitude
longitude
```

Nantinya dapat digunakan untuk:

- praktik terdekat
- distance sorting
- map
- navigation

Jangan membuat sistem GPS kompleks jika belum diperlukan.

---

## 17. Database

Gunakan database Nakesa shared.

Minimal tabel:

```text
profiles
patients
health_workers
professions
specializations
practices
practice_staff
services
practice_services
practice_hours
appointments
```

Relasi utama:

```text
profiles
   ↓
patients

health_workers
   ↓
practice_staff
   ↓
practices

practices
   ↓
practice_services
   ↓
services

patients
   ↓
appointments
   ↓
practices
   ↓
services
```

Gunakan UUID dan foreign key yang benar. Tabel penting minimal memiliki `id`, `created_at`, dan `updated_at`.

Jangan membuat tabel duplikat jika sudah ada di project.

---

## 18. Supabase RLS

RLS adalah bagian wajib MVP.

### Patient SELECT

Pasien boleh melihat:

- profil dirinya sendiri
- appointment miliknya sendiri
- praktik yang bersifat public
- layanan public
- profil tenaga kesehatan yang bersifat public

### Patient INSERT

Pasien boleh membuat:

- patient profile miliknya
- appointment miliknya

### Patient UPDATE

Pasien boleh mengubah:

- profil dirinya sendiri
- appointment miliknya hanya jika status/aturan mengizinkan

### Patient DELETE

Hindari hard delete appointment. Gunakan `CANCELLED`.

Pasien tidak boleh:

- membaca pasien lain
- mengubah praktik
- mengubah layanan
- mengubah tenaga kesehatan
- mengubah harga
- mengubah appointment pasien lain

Implementasikan RLS di Supabase. Jangan hanya melakukan filtering di frontend.

---

## 19. Privacy & Security

Karena aplikasi berhubungan dengan data kesehatan:

- Jangan expose data sensitif tanpa authorization.
- Jangan menggunakan Supabase service-role key di React Native.
- Jangan menyimpan secret key di frontend.
- Gunakan publishable/anon key sesuai arsitektur Supabase.
- Gunakan RLS.
- Pisahkan public profile dan private patient data.
- Jangan menyimpan data medis pasien di local storage biasa.
- Jangan memberikan akses data hanya berdasarkan patient ID yang diketahui.

---

## 20. Navigation

Gunakan Expo Router.

Bottom tab MVP:

```text
Home
Explore
Appointments
Profile
```

Tab Health belum wajib untuk MVP. Jika ingin disiapkan untuk fase berikutnya, boleh dibuat placeholder/Coming Soon.

---

## 21. UI/UX

Gunakan desain:

- modern
- clean
- medical
- professional
- minimal
- mobile-first
- banyak whitespace
- rounded cards
- clear typography
- accessible

Jangan membuat UI seperti dashboard admin. Ini aplikasi konsumen/pasien.

---

## 22. Loading, Empty & Error State

Setiap halaman harus memiliki:

### Loading

```text
Loading...
```

### Empty

```text
Belum ada appointment
```

### Error

```text
Terjadi kesalahan.
Coba lagi.
```

Tangani network error dengan baik.

---

## 23. Fitur yang Tidak Perlu Dibuat di MVP

Jangan implementasikan dulu:

- AI diagnosis
- telemedicine
- video call
- chat dokter
- payment gateway
- insurance
- e-prescription kompleks
- rekam medis lengkap
- laboratory integration
- hospital integration
- AI health assistant
- wearable integration
- advanced analytics
- subscription
- marketplace obat
- delivery obat

---

## 24. Roadmap

### Phase 2

```text
Medical Records
Prescriptions
Medication
Health Documents
Consent Management
Notifications
```

### Phase 3

```text
Payment
Online Consultation
Chat
Telemedicine
Digital Prescription
```

### Phase 4

```text
Health Tracking
AI Assistant
Personal Health Insights
External Integrations
```

---

## 25. Architecture Principle

Gunakan separation of concerns.

Contoh:

```text
app/
components/
features/
services/
hooks/
lib/
types/
constants/
utils/
```

Jangan menaruh seluruh logic di screen.

Contoh feature structure:

```text
features/
├── auth/
├── patient/
├── practice/
├── search/
├── appointment/
└── profile/
```

Reusable components:

```text
PracticeCard
HealthWorkerCard
ServiceCard
AppointmentCard
CategoryCard
SearchBar
PrimaryButton
EmptyState
LoadingState
```

---

## 26. Implementation Rules

Sebelum coding:

1. Inspect project structure.
2. Inspect existing Supabase configuration.
3. Inspect existing database schema.
4. Jangan membuat tabel duplikat.
5. Jangan mengganti arsitektur existing tanpa alasan.
6. Reuse component yang sudah tersedia.
7. Reuse authentication yang sudah tersedia.
8. Reuse database Nakesa.
9. Jika schema existing berbeda, gunakan adapter/service layer daripada merusak schema existing.

Jika prompt ini bertentangan dengan struktur project existing, prioritaskan existing architecture dan jelaskan perubahan yang diperlukan.

---

## 27. Expected MVP Output

MVP harus benar-benar dapat dijalankan di Expo, bukan hanya mockup.

Minimal:

```text
✅ Register
✅ Login
✅ Logout
✅ Patient Profile
✅ Home
✅ Search
✅ Practice List
✅ Practice Detail
✅ Health Worker Detail
✅ Service List
✅ Booking
✅ Appointment List
✅ Appointment Detail
✅ Cancel Appointment
✅ RLS
✅ Loading State
✅ Error State
✅ Empty State
```

Gunakan data Supabase secara nyata.

Jika database belum tersedia, buat migration SQL dan seed data development.

Gunakan dummy data hanya untuk development.

---

## 28. Acceptance Criteria

MVP dianggap berhasil jika:

1. User dapat register.
2. User otomatis menjadi patient.
3. User dapat login.
4. User dapat melihat Home.
5. User dapat mencari praktik.
6. User dapat membuka detail praktik.
7. User dapat melihat layanan.
8. User dapat memilih layanan.
9. User dapat memilih jadwal.
10. User dapat membuat appointment.
11. Appointment tersimpan di Supabase.
12. Appointment muncul di halaman Appointments.
13. User dapat membatalkan appointment.
14. User tidak dapat melihat appointment pasien lain.
15. User tidak dapat mengubah data praktik.
16. RLS aktif dan bekerja.
17. Session tetap tersimpan ketika aplikasi ditutup dan dibuka kembali.
18. Aplikasi dapat dijalankan menggunakan Expo.

---

## 29. Initial Development Procedure

**Jangan langsung membuat ulang project.**

Mulai dengan memeriksa struktur project dan database existing.

Setelah inspection, tampilkan:

```text
CURRENT ARCHITECTURE
DATABASE STATUS
EXISTING FEATURES
MISSING FEATURES
IMPLEMENTATION PLAN
```

Kemudian implementasikan MVP secara bertahap dengan prioritas:

```text
1. Authentication
2. Patient Profile
3. Practice Discovery
4. Practice Detail
5. Services
6. Booking
7. Appointment
8. RLS & Security
9. UI Polish
10. Testing
```

Pastikan setiap tahap tetap dapat dijalankan sebelum melanjutkan ke tahap berikutnya.
