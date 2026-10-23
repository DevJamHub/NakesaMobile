# Aturan Kerja Kelompok

Tampilan dan function wajib sama dengan app Nakesa versi lama. Ukuran, warna, teks, dan nama function-nya ada di [STANDAR.md](STANDAR.md).

## Pembagian halaman

Satu orang pegang satu halaman. Jangan ubah halaman atau file milik teman tanpa bilang dulu.

| Halaman | File | Pemegang |
|---|---|---|
| Beranda | `app/(tabs)/index.tsx` | Sigit |
| Detail Praktik | `app/praktik/[idPraktik].tsx` | Sigit |
| Janji Temu | `app/(tabs)/janji-temu.tsx` | Bayhaqy |
| Detail Janji Temu | `app/janji/[idJanji].tsx` | Bayhaqy |
| Profil | `app/(tabs)/profil.tsx` | Aditya |
| Ubah Kata Sandi | `app/ubah-kata-sandi.tsx` | Aditya |

`app/_layout.tsx` (Stack) dan `app/(tabs)/_layout.tsx` (tab bawah) dipegang Sigit. Yang lain hanya menambah screen halamannya di bagian namanya sendiri. Rincian tugas, urutan kerja, dan file milik tiap orang ada di [TUGAS.md](TUGAS.md).

## Isi wajib tiap orang

Kriteria nilai Modul 1 tetap harus ada di halaman masing-masing:

- Custom function dan loop (`map`, `for`, atau `FlatList`)
- Type dan array of objects
- Inline style dan external style

Mulai Modul 2, setiap orang juga harus punya kriteria Modul 2 di file miliknya, karena demo dinilai sendiri-sendiri:

- `useState` dan `useEffect`
- `router.push()`, `router.back()`, dan satu fungsi expo-router lain (`canGoBack()` dan `replace()`)
- `<Stack.Screen>` halamannya di `app/_layout.tsx`

## Batasan Modul 2

- Data tetap ditulis statis di `constants/`. Belum ada database atau `fetch`.
- Hook yang dipakai: `useState`, `useEffect`, dan `useLocalSearchParams`. Pindah halaman memakai `router` dari `expo-router`, sesuai pembagian di TUGAS.md.
- Pop-up memakai `tampilkanPesan` dari `@/functions`, bukan `Alert` langsung, supaya muncul juga di web.
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
- File baru di `components/`, `constants/`, `functions/`, `styles/` dan `types/` wajib didaftarkan di `index.ts` folder itu, **di bagian namamu sendiri** (`// ===== Sigit =====`, `// ===== Bayhaqy =====`, `// ===== Aditya =====`). Jangan menambah baris di bagian orang lain, supaya Git bisa menggabungkan tanpa konflik.
- Halaman tab (di `app/(tabs)/`) wajib didaftarkan sebagai `<Tabs.Screen>` di `app/(tabs)/_layout.tsx`. Kalau tidak, tabnya muncul dengan nama file dan ikon segitiga.
- Halaman di luar tab wajib didaftarkan sebagai `<Stack.Screen>` di `app/_layout.tsx`, dengan judul header dari STANDAR bagian 4.
- Nama file dalam kurung siku (`[idPraktik].tsx`) adalah dynamic route. Folder dalam kurung biasa (`(tabs)`) adalah route group yang tidak masuk ke alamat.
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
4. Sebelum push, ambil `main` terbaru ke branch-mu: `git pull origin main`. Kalau ada konflik, bereskan di laptop sampai tidak ada lagi baris `<<<<<<<`, `=======`, atau `>>>>>>>`. **Jangan pernah commit file yang masih berisi tanda itu.**
5. Pastikan `npx expo lint` dan `npx tsc --noEmit` tidak error, dan app jalan di Expo Go. Kalau masih ada tanda konflik, `tsc` pasti error.
6. Push branch-mu, buka Pull Request ke `main`, lalu minta satu teman review.
7. GitHub otomatis mengecek setiap PR (sisa tanda konflik, TypeScript, lint). PR hanya boleh di-merge kalau ceknya hijau ✅. Kalau merah, buka detailnya, perbaiki di branch-mu, lalu push lagi.
8. Jangan push langsung ke `main`, dan jangan pernah force push.
9. Setelah PR di-merge, mulai pekerjaan berikutnya dari `main` terbaru: `git switch main`, `git pull`, lalu kembali ke branch-mu dan `git merge main`.

## Kalau pakai AI

1. Sebelum minta AI menulis kode, suruh AI membaca `AGENTS.md`, `TUGAS.md`, `ATURAN.md`, dan `STANDAR.md`. Banyak AI di code editor otomatis membaca `AGENTS.md`.
2. Minta AI hanya mengubah file milikmu.
3. Tolak hasil AI yang memakai hal di luar Modul 2, yaitu hook selain `useState`, `useEffect`, dan `useLocalSearchParams`, fungsi `router` yang tidak ada di TUGAS.md, `fetch`, package baru, atau warna, ukuran, dan teks di luar `STANDAR.md`.
4. Cocokkan hasilnya dengan `STANDAR.md` dan screenshot app lama, lalu pastikan format komentarnya ada.
5. Pahami setiap baris sebelum commit. Saat demo tidak boleh pakai AI, jadi kode yang tidak bisa kamu jelaskan sebaiknya ditulis ulang dengan cara yang lebih sederhana.
6. Tulis pesan commit sendiri, tanpa baris tambahan dari AI seperti `Co-Authored-By` atau `Generated with ...`.

## Persiapan demo

Pahami seluruh app, bukan cuma halaman sendiri, karena asisten bisa bertanya tentang bagian mana saja. Latih modifikasi kecil tanpa AI dan tanpa membuka modul.
