# Tugas Modul 1

Setiap orang mengerjakan satu halaman sampai tampilannya sama dengan app Nakesa versi lama. Warna, ukuran, teks, dan hasil function mengikuti [STANDAR.md](STANDAR.md). Cara kerja di GitHub ada di [ATURAN.md](ATURAN.md).

| Orang | Halaman |
|---|---|
| Sigit | Beranda (`app/index.tsx`) |
| Bayhaqy | Janji Temu (`app/janji-temu.tsx`) |
| Aditya | Profil (`app/profil.tsx`) |

## Urutan kerja

**Langkah 1: Fondasi.** Bagian ini kecil, jadi merge ke `main` secepatnya. Sigit merge duluan karena yang lain memakai warnanya.

| Orang | Yang dibuat |
|---|---|
| Sigit | `constants/warna.ts`, `types/ikon.ts`, data bersama, `app/_layout.tsx`, serta `app/janji-temu.tsx` dan `app/profil.tsx` yang isinya baru judul |
| Bayhaqy | `components/Badge.tsx`, `components/SectionHeader.tsx`, `components/EmptyState.tsx`, `functions/tanggal.ts` |
| Aditya | `components/Avatar.tsx`, `components/Tombol.tsx`, `components/InfoRow.tsx` |

**Langkah 2: Halaman masing-masing.** Ketiganya bekerja bersamaan di branch sendiri.

**Langkah 3: Penyatuan.** Setelah halaman Bayhaqy dan Aditya di-merge, Sigit menambahkan "Janji temu berikutnya" dan nama pasien di sapaan Beranda.

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
| `Avatar` | `ukuran: number`, `foto?: string`, `nama?: string`, `emoji?: string`, `warna?: string` | Aditya |
| `Tombol` | `judul: string`, `onPress: () => void`, `jenis?: "utama" \| "kedua" \| "polos" \| "bahaya" \| "whatsapp"`, `ikon?: NamaIkon`, `kecil?: boolean` | Aditya |
| `InfoRow` | `ikon: NamaIkon`, `label?: string`, `nilai: string` | Aditya |

Bentuk tiap komponen ada di STANDAR bagian 5.

### Function bersama

| File | Function | Pemilik |
|---|---|---|
| `functions/format.ts` | `formatRupiah` (sudah ada), `sapaan`, `namaDepan`, `namaBergelar`, `subjudulPraktik`, `alamatPraktik` | Sigit |
| `functions/tanggal.ts` | `tanggalHariIni` (`"YYYY-MM-DD"`), `formatTanggal`, `tanggalRamah`, `formatJam` | Bayhaqy |

Hasil tiap function harus sama dengan STANDAR bagian 10.

---

## Sigit: Beranda

**Tampilan, urut dari atas**
1. Sapaan (title): `Selamat pagi, Budi 👋`, di bawahnya `Apa yang Anda butuhkan hari ini?` (textMuted). Nama diambil dari data pasien Aditya pada langkah 3.
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

**Tampilan, urut dari atas**
1. Judul `Profil` (title).
2. `Avatar` ukuran 96 di tengah: foto kalau ada, kalau tidak inisial (`BS`).
3. Nama (h2) dan email (small), rata tengah.
4. Card berisi `InfoRow`: `Nomor HP`, `Tanggal lahir` (`Kamis, 17 Mei 1990 (36 tahun)`), `Jenis kelamin`, `Alamat`, dan `Kota/Kabupaten, Provinsi`. Data yang kosong ditulis `Belum diisi`.
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
- [ ] Fondasi (langkah 1)
- [ ] `types/pasien.ts`, `constants/pasien.ts`
- [ ] `functions/profil.ts`:
  - `getInisial(nama)` pakai loop `for`
  - `hitungUmur(tanggalLahir)`
  - `buatInfoProfil(pasien)`: menghasilkan array `InfoProfil` dan mengisi `Belum diisi` kalau datanya kosong
  - `konfirmasiKeluar()`: `Alert` dengan dua tombol, memakai callback `onPress`
- [ ] `styles/profil.ts`

**Materi Modul 1 yang harus kelihatan:** `interface`, `readonly`, field opsional `?`, union type, loop `for`, `map` (baris info), ternary (foto atau inisial), `Image`, `Alert` dengan callback, inline style, external style.

---

## Dianggap selesai kalau

- [ ] Tampilan sama dengan screenshot app lama dan STANDAR.md (warna, ukuran, teks, ikon)
- [ ] Tidak ada warna yang ditulis langsung dalam hex, semuanya dari `constants/warna.ts`
- [ ] Format komentar ada: TABLE OF CONTENT, nomor bagian, dan EXPLANATION
- [ ] `npx expo lint` dan `npx tsc --noEmit` tidak error
- [ ] Jalan di Expo Go tanpa warning merah atau kuning
- [ ] PR sudah dicek satu teman, lalu di-merge
- [ ] Kamu bisa menjelaskan setiap baris di halamanmu tanpa AI
