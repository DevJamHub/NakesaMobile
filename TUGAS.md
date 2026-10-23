# Tugas Modul 2: State, Hooks, dan Navigasi

Modul 2 menambah state, hooks, dan pindah halaman ke app yang sama. Semua hasil Modul 1 harus tetap jalan, karena semua modul diperiksa lagi di akhir semester.

Setiap orang menulis kodenya sendiri di VS Code masing-masing, lalu commit, `git pull origin main`, push, dan membuka PR dari laptop sendiri (ATURAN bagian "Alur kerja GitHub"). Asisten melihat kontribusi tiap orang dari riwayat GitHub.

## Yang dinilai saat demo

Demo dilakukan **sendiri-sendiri**, tanpa membuka modul dan tanpa AI di code editor. Setiap orang harus bisa menunjukkan ketiga kriteria dari file miliknya sendiri:

| Kriteria (bobot) | Sigit | Bayhaqy | Aditya |
|---|---|---|---|
| `useState` dan `useEffect` (10%) | Beranda: kolom cari dan pilihan kategori | Janji Temu: pilihan `Akan Datang` / `Riwayat` | Ubah Kata Sandi: isi form dan pesan salah |
| `router.push()` (10%) | card praktik → Detail Praktik | card janji → Detail Janji Temu | tombol `Ubah kata sandi` di Profil → Ubah Kata Sandi |
| `router.back()` | tombol `Kembali` | tombol `Kembali` | tombol `Batal`, dan setelah `Simpan` |
| 1 fungsi expo-router lain | `router.canGoBack()` + `router.replace()` | `router.canGoBack()` + `router.replace()` | `router.canGoBack()` + `router.replace()` |
| `_layout.tsx` dan `<Stack.Screen>` (10%) | membuat Stack dan `Stack.Screen` Detail Praktik | `Stack.Screen` Detail Janji Temu | `Stack.Screen` Ubah Kata Sandi |

Sisanya adalah menjawab pertanyaan (15%) dan modifikasi kode langsung (15%). Karena itu pahami juga halaman teman, bukan cuma halamanmu sendiri.

## Struktur baru `app/`

```
app/
├── _layout.tsx            Stack, membungkus semua halaman (Sigit)
├── (tabs)/
│   ├── _layout.tsx        tab bawah (Sigit)
│   ├── index.tsx          Beranda (Sigit)
│   ├── janji-temu.tsx     Janji Temu (Bayhaqy)
│   └── profil.tsx         Profil (Aditya)
├── praktik/[id].tsx       Detail Praktik (Sigit)
├── janji/[id].tsx         Detail Janji Temu (Bayhaqy)
└── ubah-kata-sandi.tsx    Ubah Kata Sandi (Aditya)
```

- `(tabs)` adalah **route group**. Nama folder dalam kurung tidak masuk ke alamat, jadi Beranda tetap `/` dan Janji Temu tetap `/janji-temu`.
- `[id]` adalah **dynamic route**. Alamat `/praktik/3` membuka file `praktik/[id].tsx` dengan `id` bernilai `"3"`.
- Halaman di `(tabs)` didaftarkan sebagai `<Tabs.Screen>` di `app/(tabs)/_layout.tsx`. Halaman di luar `(tabs)` didaftarkan sebagai `<Stack.Screen>` di `app/_layout.tsx`, dengan judul header dari STANDAR bagian 4.
- Di kedua `_layout.tsx` ada bagian nama seperti di `index.ts` (`{/* ===== Bayhaqy ===== */}`). Tambahkan screen-mu hanya di bagianmu sendiri, supaya Git bisa menggabungkan tanpa konflik.

## Cara pindah dan kembali

Ketiga halaman detail memakai pola yang sama. Setiap orang menulis versinya sendiri di halamannya.

```tsx
import { router, useLocalSearchParams } from "expo-router";

// Halaman daftar: buka halaman detail dengan id di alamat
router.push(`/praktik/${praktik.idPraktik}`);

// Halaman detail: ambil id dari alamat. Hasilnya string, jadi diubah dulu dengan Number()
const { id } = useLocalSearchParams<{ id: string }>();
```

Tombol `Kembali` memanggil function `kembali()` buatanmu sendiri:
- Kalau `router.canGoBack()` bernilai `true`, panggil `router.back()`.
- Kalau `false`, panggil `router.replace(...)` ke halaman daftarnya. Ini terjadi kalau halaman detail dibuka langsung lewat alamat, misalnya di-refresh di browser, sehingga tidak ada halaman sebelumnya.

Kalau id tidak ditemukan (`getPraktik` mengembalikan `undefined`), tampilkan `EmptyState` dengan teks dari STANDAR bagian 7 dan tombol `Kembali`. App tidak boleh error.

## Urutan kerja Modul 2

**Langkah 1: Struktur Stack (Sigit).** Langkah ini memindahkan file Beranda dan Janji Temu, jadi harus di-merge ke `main` paling dulu.

| Yang dibuat Sigit | Keterangan |
|---|---|
| Pindahkan `app/index.tsx` dan `app/janji-temu.tsx` ke `app/(tabs)/` | Pakai `git mv`, supaya Git mencatatnya sebagai pindah file, bukan hapus lalu buat baru |
| `app/(tabs)/_layout.tsx` | Isi tab bawah dipindah dari `app/_layout.tsx`, ditambah bagian nama untuk tab Profil (Aditya) |
| `app/_layout.tsx` | Ditulis ulang menjadi `Stack`. Kolom 600px di tengah tetap ada. Isinya `<Stack.Screen name="(tabs)" options={{ headerShown: false }} />` dan bagian nama ketiga orang |
| `components/Tombol.tsx` | Dipindah dari tugas Aditya, karena tombol `Kembali` Sigit dan Bayhaqy membutuhkannya sekarang. Props-nya sama seperti di tugas Modul 1, ditambah jenis `"whatsapp"` |
| `types/pasien.ts`, `constants/pasien.ts` | Dipindah dari tugas Aditya, karena sapaan Beranda dan pesan WhatsApp Bayhaqy memakai nama pasien. Bentuk dan isinya sama seperti di tugas Modul 1 |
| `labelHarga` di `functions/format.ts` | Hasilnya sesuai STANDAR bagian 10 |

Selama langkah 1 belum di-merge, Bayhaqy dan Aditya **jangan mengubah file di `app/`**. Kerjakan dulu file di luar `app/` yang disebut di bagian masing-masing.

**Langkah 2: Halaman masing-masing.** Setelah langkah 1 di-merge, setiap orang menjalankan `git switch main`, `git pull`, dan `npm install`, lalu membuat branch baru, misalnya `git switch -c fitur-detail-janji`. Ketiganya bekerja bersamaan.

**Langkah 3: Penyatuan.** Setelah Detail Praktik dan Detail Janji Temu sama-sama di-merge:
- Sigit: card `Janji temu berikutnya` di Beranda membuka Detail Janji Temu dengan `router.push`.
- Bayhaqy: di Detail Janji Temu ada tombol `Lihat praktik` yang membuka Detail Praktik dengan `router.push`.

Halaman Aditya tidak dipakai halaman lain. Kalau belum selesai, app tetap jalan dan bisa didemokan.

---

## Sigit: Beranda dan Detail Praktik

**Beranda (`app/(tabs)/index.tsx`)**
1. Sapaan memakai nama depan pasien: `Selamat pagi, Budi 👋` (STANDAR bagian 7).
2. `SearchBar` sekarang menerima props `value` dan `onChangeText`. Teksnya disimpan di state `kataKunci`.
3. Kartu kategori bisa dipilih. Id profesi yang dipilih disimpan di state `idProfesiTerpilih` (`number | null`). Kalau kategori yang sama ditekan lagi, pilihannya batal. Kartu yang terpilih memakai garis tepi `warna.primary`.
4. State `hasilPraktik` diisi ulang di `useEffect` setiap kali `kataKunci` atau `idProfesiTerpilih` berubah (dependency `[kataKunci, idProfesiTerpilih]`), pakai function `cariPraktik`.
5. Kalau `hasilPraktik` kosong, tampilkan `EmptyState` dengan judul `Belum ada praktik`.
6. Card praktik ditekan → `router.push` ke Detail Praktik. `Lihat semua` → `router.push("/janji-temu")`.

**Detail Praktik (`app/praktik/[id].tsx`)**, header `Detail Praktik`
1. `PraktikCard` dari praktik yang dibuka, tanpa `onPress`.
2. Section `Layanan`: daftar layanan praktik itu. Nama layanan (body) di kiri, `labelHarga` (smallStrong) di kanan.
3. Tombol `Kembali` (kedua). Kalau tidak bisa kembali, `router.replace("/")`.

**File**
- [ ] Langkah 1 (tabel di atas)
- [ ] `functions/praktik.ts`: `cariPraktik(kataKunci, idProfesi)`, pakai `filter()`. Nama praktik dan nama nakes dicocokkan tanpa membedakan huruf besar dan kecil
- [ ] `types/layanan.ts` dan `constants/layanan.ts`: tambah field `idPraktik`. `functions/layanan.ts`: `getLayananPraktik(idPraktik)`, pakai `filter()`
- [ ] `components/SearchBar.tsx` dan `components/KategoriCard.tsx`: props baru di atas
- [ ] `app/praktik/[id].tsx`, styles di `styles/beranda.ts`

---

## Bayhaqy: Janji Temu dan Detail Janji Temu

**Bisa dikerjakan sebelum langkah 1 di-merge** (di luar `app/`):
- [ ] `functions/statusJanji.ts`: tambah `getJanji(idJanji)`, pakai `find()`
- [ ] `functions/whatsapp.ts`: `pesanWhatsApp(...)`, hasilnya sama persis dengan format di STANDAR bagian 10. Nama pasien dikirim sebagai parameter
- [ ] `components/Chip.tsx`, dengan props `label: string`, `terpilih: boolean`, `onPress: () => void`. Bentuknya sesuai STANDAR bagian 5 "Chip". Style di `styles/chip.ts`

**Janji Temu (`app/(tabs)/janji-temu.tsx`)**
1. Di bawah judul ada dua `Chip`: `Akan Datang (2)` dan `Riwayat`. Pilihan disimpan di state `pilihan` (`"akanDatang" | "riwayat"`), awalnya `"akanDatang"`.
2. State `daftarJanji` diisi ulang di `useEffect` setiap kali `pilihan` berubah, dari `getJanjiAkanDatang()` atau `getRiwayatJanji()`.
3. Daftar yang kosong tetap memakai `EmptyState` (`Belum ada janji temu` / `Belum ada riwayat`).
4. Card ditekan → `router.push` ke Detail Janji Temu. Ini menggantikan pop-up status dari Modul 1.

**Detail Janji Temu (`app/janji/[id].tsx`)**, header `Detail Janji Temu`
1. `JanjiTemuCard` dari janji yang dibuka, tanpa `onPress`.
2. Card status: `Badge` status, lalu penjelasan status (small) dari `getStatusJanji`.
3. Tombol `Tanya lewat WhatsApp` (whatsapp, `logo-whatsapp`) memunculkan `tampilkanPesan` berjudul `Pesan WhatsApp` dengan isi dari `pesanWhatsApp`. Membuka aplikasi WhatsApp sungguhan menunggu modul berikutnya.
4. Tombol `Kembali` (kedua). Kalau tidak bisa kembali, `router.replace("/janji-temu")`.
5. Langkah 3: tombol `Lihat praktik` (polos).

**File**
- [ ] Tiga file di atas (sebelum langkah 1)
- [ ] `app/(tabs)/janji-temu.tsx` dan `app/janji/[id].tsx`, styles di `styles/janjiTemu.ts`
- [ ] `<Stack.Screen>` Detail Janji Temu di `app/_layout.tsx`, bagian Bayhaqy

---

## Aditya: Profil dan Ubah Kata Sandi

Bagian ini tidak dipakai halaman lain, jadi Aditya bisa mengerjakannya dengan tempo sendiri tanpa menghambat Sigit dan Bayhaqy. Tetap lengkap untuk demo: ketiga kriteria nilai ada di halaman Ubah Kata Sandi.

**Profil (`app/(tabs)/profil.tsx`)**
Halaman Profil dari Modul 1 belum ada di `main`, jadi diselesaikan dulu sesuai tugas Modul 1 di bawah, dengan tiga perubahan:
1. Filenya di `app/(tabs)/profil.tsx`, dan tabnya didaftarkan di `app/(tabs)/_layout.tsx` bagian Aditya.
2. `Tombol`, `types/pasien.ts`, dan `constants/pasien.ts` sudah dibuat Sigit. Tinggal di-import, jangan dibuat ulang.
3. Tombol `Ubah kata sandi` → `router.push("/ubah-kata-sandi")`, tidak lagi memunculkan pop-up.

**Ubah Kata Sandi (`app/ubah-kata-sandi.tsx`)**, header `Ubah Kata Sandi`
1. Tiga kolom isian dengan label (caption) di atasnya: `Kata sandi sekarang`, `Kata sandi baru`, `Ulangi kata sandi baru`. Isinya disembunyikan dengan `secureTextEntry`, dan tiap kolom punya state sendiri. Bentuk kolom sama dengan kolom cari (STANDAR bagian 5), tanpa ikon dan bayangan.
2. State `pesanSalah` diisi di `useEffect` setiap kali kata sandi baru atau ulangannya berubah:
   - kata sandi baru sudah diisi tapi kurang dari 8 karakter → `Kata sandi minimal 8 karakter.`
   - ulangan sudah diisi tapi tidak sama → `Kata sandi baru tidak sama.`
   - selain itu → kosong (`""`)
3. Kalau `pesanSalah` tidak kosong, tampilkan di bawah kolom (small, warna `warna.danger`).
4. Tombol `Simpan` (utama): kalau ada kolom kosong atau `pesanSalah` tidak kosong, `tampilkanPesan("Lengkapi semua kolom dengan benar.")`. Kalau sudah benar, `tampilkanPesan("Kata sandi berhasil diubah.")` lalu `kembali()`. Belum ada database, jadi kata sandinya belum benar-benar tersimpan.
5. Tombol `Batal` (polos) → `kembali()`. Kalau tidak bisa kembali, `router.replace("/profil")`.

**File**
- [ ] Bisa dikerjakan sebelum langkah 1 di-merge: `components/InfoRow.tsx`, `hitungUmur` di `functions/profil.ts`
- [ ] Setelah langkah 1: `buatInfoProfil` dan `konfirmasiKeluar` di `functions/profil.ts`, `app/(tabs)/profil.tsx`, `app/ubah-kata-sandi.tsx`, styles di `styles/profil.ts`
- [ ] Tab Profil di `app/(tabs)/_layout.tsx` dan `<Stack.Screen>` Ubah Kata Sandi di `app/_layout.tsx`, keduanya di bagian Aditya

---

## Modul 2 dianggap selesai kalau

- [ ] Ketiga kriteria nilai ada di file milikmu sendiri (tabel "Yang dinilai saat demo")
- [ ] Halaman detail tidak error kalau dibuka langsung lewat alamat atau id-nya salah
- [ ] Semua halaman Modul 1 masih jalan, di Expo Go dan di web
- [ ] Teks, warna, dan ukuran baru hanya dari STANDAR.md
- [ ] Format komentar ada: TABLE OF CONTENT, nomor bagian, dan EXPLANATION, termasuk penjelasan `useState`, `useEffect`, dan setiap fungsi `router`
- [ ] `npx expo lint` dan `npx tsc --noEmit` tidak error, cek GitHub di PR hijau ✅
- [ ] Kamu bisa menjelaskan setiap baris dan mengubahnya langsung tanpa AI

---

# Tugas Modul 1 (harus tetap jalan)

Setiap orang mengerjakan satu halaman sampai tampilannya sama dengan app Nakesa versi lama. Warna, ukuran, teks, dan hasil function mengikuti [STANDAR.md](STANDAR.md). Cara kerja di GitHub ada di [ATURAN.md](ATURAN.md).

| Orang | Halaman |
|---|---|
| Sigit | Beranda (`app/index.tsx`) |
| Bayhaqy | Janji Temu (`app/janji-temu.tsx`) |
| Aditya | Profil (`app/profil.tsx`) |

## Urutan kerja

**Langkah 1: Fondasi.** Bagian ini kecil, jadi merge ke `main` secepatnya. Sigit merge duluan karena Bayhaqy memakai warna, data, dan `Avatar`-nya.

| Orang | Yang dibuat |
|---|---|
| Sigit | `constants/warna.ts`, `types/ikon.ts`, data bersama, `components/Avatar.tsx`, `app/_layout.tsx` (tab bawah, baru berisi tab Beranda) |
| Bayhaqy | `components/Badge.tsx`, `components/SectionHeader.tsx`, `components/EmptyState.tsx`, `functions/tanggal.ts` |

Aditya tidak punya bagian fondasi, supaya tidak ada yang menunggu dia. Sebagai gantinya, dia membuat component `InfoRow` di dalam tugas halaman Profil. (`Tombol` awalnya juga tugas Aditya, tapi di Modul 2 dibuat Sigit karena halaman detail membutuhkannya.)

**Langkah 2: Halaman masing-masing.** Ketiganya bekerja bersamaan di branch sendiri. Bayhaqy dan Aditya membuat file halamannya sendiri dan menambahkan tabnya di `app/_layout.tsx` (judul dan ikon ada di STANDAR bagian 4).

**Langkah 3: Penyatuan.** Setelah halaman Bayhaqy di-merge, Sigit menambahkan "Janji temu berikutnya" di Beranda.

Halaman Profil (Aditya) tidak dipakai halaman lain. Kalau belum selesai, tab Profil belum muncul, tapi app tetap jalan dan bisa didemokan.

## Fondasi bersama

Semua orang memakai bentuk di bawah ini. Jangan mengubahnya tanpa bilang ke kelompok.

### Warna dan ikon (Sigit)

- `constants/warna.ts`: object `warna` berisi semua warna di STANDAR bagian 1. Warna status ditulis berpasangan, misalnya `success` dan `successSoft`, `warning` dan `warningSoft`. Di kode, warna selalu diambil dari sini (`warna.primary`), jangan menulis hex langsung.
- `types/warna.ts`: `type Tone = "success" | "warning" | "danger" | "info" | "neutral"`
- `types/ikon.ts`: `type NamaIkon = keyof typeof Ionicons.glyphMap` (daftar nama ikon Ionicons yang valid)

### Data (Sigit)

```ts
type Profesi = { idProfesi: number; namaProfesi: string; gelar: string; emoji: string; warna: string };
type Nakes = { idNakes: number; namaNakes: string };          // tanpa gelar, contoh "Siti Rahmawati"
type Layanan = { idLayanan: number; namaLayanan: string; harga: number | null };
type Praktik = {
    idPraktik: number;
    namaPraktik: string;     // "Klinik Bidan Siti"
    idNakes: number;
    idProfesi: number;
    spesialis?: string;      // hanya untuk Dokter Spesialis, contoh "Anak"
    alamat: string;          // "Jl. Melati 12"
    kota: string;            // "Malang"
    sedangBuka: boolean;
};
```

- Isi data profesi: 9 profesi dari STANDAR bagian 8.
- Isi data praktik: 5 praktik di Malang, minimal 1 yang tutup dan 1 Dokter Spesialis.
- Function pencari, satu file per data di `functions/`: `getProfesi`, `getNakes`, `getLayanan`, `getPraktik`. Masing-masing memakai `find()` dan mengembalikan objeknya, atau `undefined` kalau tidak ketemu.

### Komponen bersama

| Komponen | Props | Pembuat |
|---|---|---|
| `Badge` | `label: string`, `tone: Tone`, `titik?: boolean` | Bayhaqy |
| `SectionHeader` | `judul: string`, `aksi?: string`, `onAksi?: () => void` | Bayhaqy |
| `EmptyState` | `judul: string`, `pesan?: string`, `ikon?: NamaIkon` | Bayhaqy |
| `Avatar` | `ukuran: number`, `foto?: string`, `nama?: string`, `emoji?: string`, `warnaAvatar?: string` | Sigit |

Bentuk tiap komponen ada di STANDAR bagian 5.

### Function bersama

| File | Function | Pemilik |
|---|---|---|
| `functions/format.ts` | `formatRupiah` (sudah ada), `getInisial` (dipakai `Avatar`), `sapaan`, `namaDepan`, `namaBergelar`, `subjudulPraktik`, `alamatPraktik` | Sigit |
| `functions/tanggal.ts` | `tanggalHariIni` (`"YYYY-MM-DD"`), `formatTanggal`, `tanggalRamah`, `formatJam` | Bayhaqy |

Hasil tiap function harus sama dengan STANDAR bagian 10.

---

## Sigit: Beranda

**Tampilan, urut dari atas**
1. Sapaan (title) tanpa nama: `Selamat pagi 👋`, di bawahnya `Apa yang Anda butuhkan hari ini?` (textMuted). App lama juga menampilkan sapaan seperti ini kalau nama belum diisi.
2. Kolom cari pakai `TextInput`. Belum bisa menyaring.
3. Section `Kategori`: 9 kartu profesi, 4 per baris. Kalau ditekan, muncul `Alert` berisi nama profesi.
4. Section `Janji temu berikutnya` dengan aksi `Lihat semua`: satu `JanjiTemuCard` dari `getJanjiBerikutnya()`. Section ini hanya tampil kalau ada janji yang akan datang (langkah 3).
5. Section `Praktik untuk Anda`: daftar card praktik pakai `FlatList`. Kalau ditekan, muncul `Alert` berisi nama praktik.

**File**
- [ ] Fondasi (langkah 1)
- [ ] `components/SearchBar.tsx`, `components/KategoriCard.tsx`, `components/PraktikCard.tsx` (ditulis ulang sesuai STANDAR)
- [ ] `styles/beranda.ts`, menggantikan `styles/praktik.ts`
- [ ] Hapus yang tidak dipakai lagi: `lokasi` (types, constants, functions), `functions/janji.ts`, serta field `tarif` dan `kunjunganRumah`

**Materi Modul 1 yang harus kelihatan:** `if/else` (sapaan), `map` (kategori), `FlatList` (praktik), ternary (badge buka/tutup), `TextInput`, type dan array of objects, inline style (warna profesi), external style.

---

## Bayhaqy: Janji Temu

**Tampilan, urut dari atas**
1. Judul `Janji Temu` (title).
2. Section `Akan Datang (2)`: janji berstatus `baru` dan `dikonfirmasi`, yang tanggalnya paling dekat di atas. Kalau kosong, tampilkan `EmptyState` dengan judul `Belum ada janji temu`.
3. Section `Riwayat`: janji lainnya, yang terbaru di atas. Kalau kosong, judulnya `Belum ada riwayat`.
4. Kalau card ditekan, muncul `Alert` dengan judul label status dan isi penjelasan status (STANDAR bagian 9).

**Data**

```ts
type StatusJanji = "baru" | "dikonfirmasi" | "selesai" | "batal" | "ditolak";
type JanjiTemu = {
    idJanji: number;
    idPraktik: number;       // merujuk ke data praktik
    idLayanan?: number;      // kalau kosong, card menampilkan nama profesi
    tanggal: string;         // "2026-10-20"
    jamMulai?: string;       // "08:30"
    jamSelesai?: string;     // "09:00"
    status: StatusJanji;
};
```

Isi 6 janji:
- 2 akan datang (1 `baru`, 1 `dikonfirmasi`), tanggalnya setelah hari demo
- 1 `baru` yang tanggalnya sudah lewat, supaya tampil sebagai `Sudah lewat`
- 1 `selesai`, 1 `batal`, 1 `ditolak`

**File**
- [ ] Fondasi (langkah 1)
- [ ] `types/janjiTemu.ts`, `constants/janjiTemu.ts`
- [ ] `functions/statusJanji.ts`:
  - `getStatusJanji(janji)`: label, tone, dan penjelasan, pakai `switch`, termasuk aturan `Sudah lewat`
  - `getJanjiAkanDatang()` dan `getRiwayatJanji()`: pakai `filter()` dan `sort()`
  - `getJanjiBerikutnya()`: janji pertama dari daftar akan datang, dipakai Beranda
- [ ] `components/JanjiTemuCard.tsx` sesuai STANDAR "Card janji temu". Card ini dipakai Beranda juga.
- [ ] `styles/janjiTemu.ts`

**Materi Modul 1 yang harus kelihatan:** union type, `switch`, `filter`, `sort`, `map`, kondisi untuk daftar kosong, inline style (warna badge), external style.

---

## Aditya: Profil

Halaman ini lengkap dan bisa didemokan sendiri. Bedanya hanya satu: tidak ada halaman lain yang menunggu Profil, jadi Aditya bisa mengerjakannya dengan tempo sendiri tanpa menghambat Sigit dan Bayhaqy.

**Tampilan, urut dari atas**
1. Judul `Profil` (title).
2. `Avatar` ukuran 96 di tengah. Component ini buatan Sigit, tinggal dipakai. Karena foto kosong, yang tampil inisial `BS`.
3. Nama (h2) dan email (small), rata tengah.
4. Card berisi `InfoRow`: `Nomor HP`, `Tanggal lahir`, `Jenis kelamin`, `Alamat`, dan `Kota/Kabupaten, Provinsi`.
   - Tanggal lahir ditulis dengan umurnya, contoh `Kamis, 17 Mei 1990 (36 tahun)`, pakai `formatTanggal` dari Bayhaqy dan `hitungUmur`.
   - Data yang kosong ditulis `Belum diisi`.
5. Tombol `Ubah profil` (kedua, `create-outline`) dan `Ubah kata sandi` (polos, `key-outline`). Keduanya memunculkan `Alert`.
6. Card kunci aplikasi: ikon `finger-print`, `Kunci dengan sidik jari` (bodyStrong), lalu `Diminta saat aplikasi dibuka atau ditinggal lebih dari 1 menit.` (small). Kalau ditekan, muncul `Alert`.
7. Card privasi: ikon `shield-checkmark-outline`, lalu teks (small) `Data Anda hanya bisa dilihat oleh Anda. Praktik hanya menerima nama dan nomor HP Anda saat Anda membuat janji temu.`
8. Tombol `Keluar` (bahaya, `log-out-outline`). Kalau ditekan, muncul `Alert` berjudul `Keluar dari akun?` dengan pesan `Anda perlu masuk lagi dengan email dan kata sandi untuk membuka janji temu Anda.` dan tombol `Tidak` serta `Ya, keluar`.

**Data**

```ts
interface Pasien {
    readonly idPasien: number;
    namaLengkap: string;
    email: string;
    noHp?: string;
    tanggalLahir?: string;                      // "1990-05-17"
    jenisKelamin?: "Laki-laki" | "Perempuan";
    alamat?: string;
    kota?: string;
    provinsi?: string;
    foto?: string;                              // link gambar
}
type InfoProfil = { ikon: NamaIkon; label: string; nilai: string };
```

Isi 1 pasien bernama `Budi Santoso`, dengan `alamat` dan `foto` sengaja dikosongkan supaya `Belum diisi` dan inisial ikut tampil.

**File**
- [ ] ~~`types/pasien.ts`, `constants/pasien.ts`~~ (dibuat Sigit di Modul 2 langkah 1)
- [ ] `functions/profil.ts`:
  - `hitungUmur(tanggalLahir)`: umur dalam tahun, pakai `if` untuk mengecek apakah ulang tahun tahun ini sudah lewat
  - `buatInfoProfil(pasien)`: menghasilkan array `InfoProfil` dan mengisi `Belum diisi` kalau datanya kosong
  - `konfirmasiKeluar()`: `Alert` dengan dua tombol, memakai callback `onPress`
- [ ] `components/InfoRow.tsx`, dengan props `ikon: NamaIkon`, `label?: string`, `nilai: string`
- [ ] ~~`components/Tombol.tsx`~~ (dibuat Sigit di Modul 2 langkah 1), dengan props `judul: string`, `onPress: () => void`, `jenis?: "utama" | "kedua" | "polos" | "bahaya"`, `ikon?: NamaIkon`. Warna tiap jenis dipilih pakai `switch`, bentuknya ada di STANDAR bagian 5.
- [ ] `styles/profil.ts`

**Materi Modul 1 yang harus kelihatan:** `interface`, `readonly`, field opsional `?`, union type, `if` dan `switch`, `map` (baris info), `??` atau ternary untuk `Belum diisi`, `Alert` dengan callback, inline style, external style.

---

## Dianggap selesai kalau

- [ ] Tampilan sama dengan screenshot app lama dan STANDAR.md (warna, ukuran, teks, ikon)
- [ ] Tidak ada warna yang ditulis langsung dalam hex, semuanya dari `constants/warna.ts`
- [ ] Format komentar ada: TABLE OF CONTENT, nomor bagian, dan EXPLANATION
- [ ] `npx expo lint` dan `npx tsc --noEmit` tidak error
- [ ] Jalan di Expo Go tanpa warning merah atau kuning
- [ ] PR sudah dicek satu teman, lalu di-merge
- [ ] Kamu bisa menjelaskan setiap baris di halamanmu tanpa AI
