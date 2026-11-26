# Nakesa

Aplikasi untuk pasien mencari tenaga kesehatan (bidan, dokter, perawat, fisioterapis) di Malang.
Project Praktikum Pemrograman Mobile, Modul 1: Sintaks & UI Dasar. Datanya masih statis, belum pakai database.

## Cara menjalankan

```bash
npm install
npx expo start --go
```

Scan QR code-nya dengan aplikasi Expo Go. Project ini memakai **Expo SDK 58**, jadi Expo Go di HP harus versi terbaru (update dulu dari App Store / Play Store).

- **Android**: scan QR dari dalam aplikasi Expo Go.
- **iPhone**: scan QR dengan aplikasi **Kamera** bawaan, lalu ketuk notifikasi "Buka di Expo Go".
- Laptop dan HP harus tersambung ke Wi-Fi yang sama. Kalau tetap tidak tersambung (misalnya Wi-Fi kampus), jalankan `npx expo start --go --tunnel`.
- Setelah `git pull` yang mengubah `package.json`, jalankan `npm install` lagi.

## Struktur folder

```
app/          halaman aplikasi (index.tsx)
components/   component, misalnya PraktikCard
constants/    data (array of objects)
functions/    custom function
styles/       external styling (StyleSheet)
types/        type data
```

Sebelum mulai, baca [TUGAS.md](TUGAS.md) (tugas tiap orang), [ATURAN.md](ATURAN.md) (cara kerja), dan [STANDAR.md](STANDAR.md) (tampilan dan function).
