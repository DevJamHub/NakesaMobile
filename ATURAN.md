# Aturan Kerja Kelompok

Tampilan dan function wajib sama dengan app Nakesa versi lama. Ukuran, warna, teks, dan nama function-nya ada di [STANDAR.md](STANDAR.md).

## Pembagian halaman

Satu orang pegang satu halaman. Jangan ubah halaman atau file milik teman tanpa bilang dulu.

| Halaman | File | Pemegang |
|---|---|---|
| Beranda | `app/index.tsx` | Sigit |
| Janji Temu | `app/janji-temu.tsx` | _(isi nama)_ |
| Profil | `app/profil.tsx` | _(isi nama)_ |

`app/_layout.tsx` (tab bawah) dipegang Sigit. Rincian tugas, urutan kerja, dan file milik tiap orang ada di [TUGAS.md](TUGAS.md).

## Isi wajib tiap halaman

Setiap halaman harus punya semua kriteria nilai Modul 1, supaya tiap orang bisa menjelaskan dari halamannya sendiri:

- Custom function dan loop (`map`, `for`, atau `FlatList`)
- Type dan array of objects
- Inline style dan external style

## Batasan Modul 1

- Data ditulis statis di `constants/`. Belum ada database.
- Belum pakai `useState` atau pindah halaman lewat tombol. Tombol cukup memunculkan `Alert` dulu.
- Jangan menambah package tanpa bilang ke kelompok. Kalau perlu, pakai `npx expo install <nama-package>`.

## Letak dan nama file

| Folder | Isi | Format nama | Contoh |
|---|---|---|---|
| `app/` | halaman | huruf kecil, pakai tanda hubung | `janji-temu.tsx` |
| `components/` | component | PascalCase | `JanjiTemuCard.tsx` |
| `constants/` | data | camelCase | `janjiTemu.ts` |
| `functions/` | custom function | camelCase | `statusJanji.ts` |
| `styles/` | StyleSheet | camelCase | `janjiTemu.ts` |
| `types/` | type / interface | camelCase | `janjiTemu.ts` |

- Satu file untuk satu topik.
- File baru di `components/`, `constants/`, `functions/`, `styles/` dan `types/` wajib didaftarkan di `index.ts` folder itu.
- Import selalu lewat `@/`, misalnya `import { praktiks } from "@/constants";`, bukan `../constants`.

## Penamaan di dalam kode

| Jenis | Aturan | Contoh |
|---|---|---|
| Type / interface | PascalCase | `JanjiTemu` |
| Id | `id` + nama, berupa number | `idJanji` |
| Array data | nama + `s` | `janjiTemus` |
| Function | diawali kata kerja | `getStatusJanji`, `formatTanggal` |
| StyleSheet | nama + `Styles` | `janjiTemuStyles` |

Nama variabel dan teks di layar pakai bahasa Indonesia. Indentasi 4 spasi, string pakai tanda kutip dua (`"`).

## Format komentar

Ikuti contoh di `app/index.tsx` dan `components/PraktikCard.tsx`:

1. `TABLE OF CONTENT` di bagian paling atas halaman dan component.
2. Nomor bagian di atas kode, misalnya `// 1.1: Import Section` atau `{/* 3.1: Daftar Janji */}`.
3. Tanda `// [1]` di baris yang perlu dijelaskan, lalu penjelasannya ditulis di blok `EXPLANATION` di bagian bawah file.

## Alur kerja GitHub

1. Sebelum mulai: `git switch main`, lalu `git pull` dan `npm install`.
2. Buat branch sendiri: `git switch -c fitur-<halaman>`, misalnya `fitur-janji-temu`.
3. Commit kecil dan sering, dengan pesan yang jelas, misalnya `Tambah card janji temu`.
4. Sebelum push, pastikan `npx expo lint` dan `npx tsc --noEmit` tidak error, dan app jalan di Expo Go.
5. Push branch-mu, buka Pull Request ke `main`, lalu minta satu teman review.
6. Jangan push langsung ke `main`, dan jangan pernah force push.
7. Setelah PR di-merge, kembali ke `main` dan `git pull`.

## Kalau pakai AI

1. Sebelum minta AI menulis kode, suruh AI membaca `AGENTS.md`, `TUGAS.md`, `ATURAN.md`, dan `STANDAR.md`. Banyak AI di code editor otomatis membaca `AGENTS.md`.
2. Minta AI hanya mengubah file milikmu.
3. Tolak hasil AI yang memakai hal di luar Modul 1, yaitu `useState` atau hook lain, `router` / `Link`, `fetch`, package baru, atau warna dan ukuran di luar `STANDAR.md`.
4. Cocokkan hasilnya dengan `STANDAR.md` dan screenshot app lama, lalu pastikan format komentarnya ada.
5. Pahami setiap baris sebelum commit. Saat demo tidak boleh pakai AI, jadi kode yang tidak bisa kamu jelaskan sebaiknya ditulis ulang dengan cara yang lebih sederhana.
6. Tulis pesan commit sendiri, tanpa baris tambahan dari AI seperti `Co-Authored-By` atau `Generated with ...`.

## Persiapan demo

Pahami seluruh app, bukan cuma halaman sendiri, karena asisten bisa bertanya tentang bagian mana saja. Latih modifikasi kecil tanpa AI dan tanpa membuka modul.
