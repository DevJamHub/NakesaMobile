# Standar Tampilan dan Function

Semua halaman harus terlihat dan bekerja sama seperti aplikasi Nakesa versi lama. Semua angka dan teks di file ini diambil dari kode app lama. Jangan pakai warna, ukuran, atau kalimat lain.

## 1. Warna

Di kode, warna diambil dari `constants/warna.ts` (misalnya `warna.primary`), jangan menulis hex langsung.

| Nama | Hex | Dipakai untuk |
|---|---|---|
| primary | `#0F766E` | tombol utama, ikon, teks aktif |
| primaryPressed | `#0B5E58` | tombol utama saat ditekan |
| primarySoft | `#E6F4F1` | lingkaran di belakang ikon, latar saat ditekan |
| background | `#F4F7F6` | latar layar |
| surface | `#FFFFFF` | card, tab bawah, kolom cari |
| text | `#10201D` | teks utama |
| textMuted | `#5B6C69` | teks keterangan |
| textFaint | `#8C9B98` | placeholder, ikon panah, tab yang tidak aktif |
| border | `#E0E8E6` | garis tepi card dan chip |
| whatsapp | `#1F9D55` | tombol WhatsApp (saat ditekan `#17804A`) |

Warna status (dipakai di badge, titik status, dan kotak pesan):

| Tone | Teks / titik | Latar |
|---|---|---|
| success | `#15803D` | `#E8F6EC` |
| warning | `#B45309` | `#FDF3E3` |
| danger | `#B42318` | `#FDECEA` |
| info | `#1D5FB4` | `#E8F0FB` |
| neutral | `#5B6C69` | `#EEF2F1` |

## 2. Teks

Font bawaan HP, jangan pakai `fontFamily`.

| Jenis | fontSize / lineHeight | fontWeight | Warna | Dipakai untuk |
|---|---|---|---|---|
| title | 26 / 32, `letterSpacing: -0.3` | `"700"` | text | judul halaman, sapaan |
| h2 | 20 / 26 | `"700"` | text | nama di halaman profil |
| h3 | 17 / 23 | `"600"` | text | judul section, nama praktik |
| body | 16 / 22 | normal | text | teks biasa |
| bodyStrong | 16 / 22 | `"600"` | text | nama di card janji temu |
| small | 14 / 20 | normal | textMuted | keterangan |
| smallStrong | 14 / 20 | `"600"` | text | tanggal, jam, label kategori |
| caption | 12 / 16 | normal | textMuted | label kecil di atas nilai |

## 3. Jarak, sudut, bayangan

- Jarak (padding, margin, gap) hanya boleh: 4, 8, 12, 16, 24, 32.
- `borderRadius`: 8 (tombol kecil), 10 (kotak tanggal), 12 (tombol), 16 (card, kolom cari), 999 (badge, chip, bentuk bulat).
- Bayangan card dan kolom cari:
  `shadowColor: "#0B2B27", shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2`

## 4. Layar dan tab bawah

- Latar layar `#F4F7F6`, isi di dalam `ScrollView`.
- `contentContainerStyle`: `padding: 16`, `paddingBottom: 32`, `gap: 16` (jarak antar bagian).
- Baris pertama setiap halaman adalah judul jenis **title** ("Janji Temu", "Profil"). Beranda memakai sapaan.
- Tab bawah tanpa header di atas: warna aktif primary, tidak aktif textFaint, label 12 tebal `"600"`, latar putih dengan garis atas border.

| Tab | Judul | Ikon aktif / tidak aktif |
|---|---|---|
| `index` | Beranda | `home` / `home-outline` |
| `janji-temu` | Janji Temu | `calendar` / `calendar-outline` |
| `profil` | Profil | `person` / `person-outline` |

## 5. Komponen

**Card**: latar putih, `borderRadius: 16`, `padding: 16`, `borderWidth: 1`, borderColor border, bayangan card. Kalau bisa ditekan, saat ditekan `opacity: 0.85` dan `transform: [{ scale: 0.99 }]`.

**Tombol**: `minHeight: 54`, `borderRadius: 12`, `paddingHorizontal: 20`, isi di tengah. Teks 16 tebal `"700"`. Ikon 20 di kiri teks dengan jarak 8.

| Jenis | Latar | Saat ditekan | Teks | Garis tepi |
|---|---|---|---|---|
| utama | primary | primaryPressed | putih | tidak ada |
| kedua | putih | primarySoft | primary | 1.5 primary |
| polos | transparan | primarySoft | primary | tidak ada |
| bahaya | putih | `#FDECEA` | `#B42318` | 1.5 `#B42318` |
| whatsapp | whatsapp | `#17804A` | putih | tidak ada |

Tombol kecil: `minHeight: 42`, `paddingHorizontal: 14`, `borderRadius: 8`, teks 14, ikon 18.

**Badge**: baris, `alignSelf: "flex-start"`, `paddingHorizontal: 10`, `paddingVertical: 4`, `borderRadius: 999`, `gap: 6`. Titik di depan teks berukuran 7×7 (bulat). Teks 13 tebal `"600"`. Warna teks, titik, dan latar diambil dari tabel tone.

**Chip**: `minHeight: 40`, `paddingHorizontal: 16`, `borderRadius: 999`, `borderWidth: 1.5`, borderColor border, latar putih. Teks 15 tebal `"600"`. Kalau terpilih: latar dan garis primary, teks putih.

**Judul section**: baris dengan `justifyContent: "space-between"` dan `marginBottom: 12`. Judul berjenis h3. Kalau ada aksi (misalnya "Lihat semua"), teksnya smallStrong warna primary di kanan.

**Baris info**: baris `gap: 12`. Ikon 18 primary di dalam lingkaran 34×34 berlatar primarySoft. Di kanannya label (caption) dan nilai (body).

**Avatar**: bulat. Kalau ada foto, pakai `Image`. Kalau tidak ada, tampilkan inisial atau emoji profesi di lingkaran berlatar warna yang sama dengan transparansi 12% (tambahkan `1F` di belakang hex, misalnya `#0F766E1F`). Inisial: `fontSize` = ukuran × 0.38, tebal `"700"`. Emoji: `fontSize` = ukuran × 0.48. Ukuran: card praktik 52, card janji temu 44, halaman profil 96.

**Kolom cari**: baris `gap: 10`, `minHeight: 54`, `paddingHorizontal: 16`, `borderRadius: 16`, latar putih, garis tepi 1 border, bayangan card. Ikon `search` 20 primary. Placeholder `Cari dokter, bidan, praktik, layanan…` berwarna textFaint, teks 16.

**Kartu kategori**: 4 kartu per baris (`width: "23%"`, `flexGrow: 1`, susunan baris dengan `flexWrap: "wrap"` dan `gap: 8`). Isi di tengah, `gap: 6`, `paddingVertical: 12`, `paddingHorizontal: 4`, `borderRadius: 16`, latar putih, garis tepi 1. Emoji profesi berukuran 24 di lingkaran 48 berlatar warna profesi + `1A`. Label 13 / 17 tebal `"600"`, rata tengah.

**Card praktik**: baris `gap: 12`. Kiri: avatar emoji profesi ukuran 52. Tengah (`gap: 3`):
1. nama praktik (h3)
2. subjudul profesi (smallStrong, warna profesi)
3. nama nakes bergelar (small)
4. alamat dengan ikon `location-outline` 15 textMuted (small)
5. badge "Sedang buka" (success) atau "Sedang tutup" (neutral), dengan titik

Kanan: `chevron-forward` 20 textFaint kalau card bisa ditekan.

**Card janji temu**:
- Atas: avatar emoji 44, nama praktik (bodyStrong), dan layanan (small).
- Tengah: kotak berlatar background, `borderRadius: 10`, `paddingVertical: 8`, `paddingHorizontal: 12`, `marginVertical: 12`. Isinya `calendar-outline` dan `time-outline` (16 primary) diikuti teks smallStrong, dengan jarak 16 antar keduanya.
- Bawah: badge status dengan titik.

**Tampilan kosong**: di tengah, `padding: 24`, `gap: 8`. Ikon 30 primary di lingkaran 64 berlatar primarySoft. Judul h3 rata tengah, pesan small rata tengah (lebar maksimal 300). Ikon bawaan `leaf-outline`.

## 6. Ikon

Hanya Ionicons dari `@expo/vector-icons`. Ikon keterangan pakai versi `-outline`. Ikon tab pakai versi penuh saat aktif. Ikon profesi pakai emoji (lihat tabel profesi).

Ikon yang dipakai app lama: `search`, `location-outline`, `calendar-outline`, `time-outline`, `chevron-forward`, `call-outline`, `person-outline`, `home-outline`, `create-outline`, `key-outline`, `log-out-outline`, `finger-print`, `shield-checkmark-outline`, `logo-whatsapp`, `leaf-outline`.

## 7. Bahasa dan teks baku

- Bahasa Indonesia yang sopan, sapa pengguna dengan **Anda** (bukan "kamu").
- Rentang jam pakai tanda pisah `–` (contoh `08.30–09.00`). Elipsis pakai `…`.

| Tempat | Teks |
|---|---|
| Sapaan Beranda | `Selamat pagi, Budi 👋` (tanpa nama: `Selamat pagi 👋`) lalu `Apa yang Anda butuhkan hari ini?` (textMuted) |
| Judul section Beranda | `Kategori`, `Janji temu berikutnya` (aksi `Lihat semua`), `Praktik untuk Anda` |
| Bagian Janji Temu | `Akan Datang (2)`, `Riwayat` |
| Tampilan kosong | `Belum ada praktik`, `Belum ada janji temu`, `Belum ada riwayat` |
| Profil, data kosong | `Belum diisi` |
| Profil, label info | `Nomor HP`, `Tanggal lahir`, `Jenis kelamin`, `Alamat`, `Kota/Kabupaten, Provinsi` |
| Profil, tombol | `Ubah profil` (kedua, `create-outline`), `Ubah kata sandi` (polos, `key-outline`), `Keluar` (bahaya, `log-out-outline`) |
| Profil, kunci aplikasi | `Kunci dengan sidik jari` lalu `Diminta saat aplikasi dibuka atau ditinggal lebih dari 1 menit.` |
| Profil, privasi | `Data Anda hanya bisa dilihat oleh Anda. Praktik hanya menerima nama dan nomor HP Anda saat Anda membuat janji temu.` |
| Konfirmasi keluar | Judul `Keluar dari akun?`, pesan `Anda perlu masuk lagi dengan email dan kata sandi untuk membuka janji temu Anda.`, tombol `Tidak` dan `Ya, keluar` |
| Status praktik | `Sedang buka`, `Sedang tutup` |
| Jam belum ada | `Jam menyusul` |

## 8. Data profesi

| Profesi | Gelar | Emoji | Warna |
|---|---|---|---|
| Bidan | Bidan | 🤰 | `#b8456e` |
| Dokter Umum | dr. | 🩺 | `#236f9f` |
| Dokter Gigi | drg. | 🦷 | `#12839a` |
| Dokter Spesialis | dr. | 👨‍⚕️ | `#4c5fd5` |
| Perawat | Ns. | 💉 | `#1f8a6a` |
| Fisioterapis | (tidak ada) | 🦴 | `#b8661a` |
| Psikolog | (tidak ada) | 🧠 | `#7159c0` |
| Ahli Gizi | (tidak ada) | 🥗 | `#4a8a2a` |
| Lainnya | (tidak ada) | ➕ | `#236f9f` |

## 9. Status janji temu

| status | Label | Tone | Penjelasan |
|---|---|---|---|
| `"baru"` | Menunggu konfirmasi | warning | Praktik akan mengonfirmasi janji temu ini, biasanya lewat WhatsApp. |
| `"dikonfirmasi"` | Dikonfirmasi | success | Janji temu sudah dikonfirmasi. Datang sesuai jadwal ya. |
| `"selesai"` | Selesai | info | Janji temu ini sudah selesai. |
| `"batal"` | Dibatalkan | neutral | Janji temu ini sudah dibatalkan. |
| `"ditolak"` | Ditolak | danger | Praktik tidak bisa menerima janji temu ini. Silakan pilih jadwal lain. |

- **Akan Datang** berisi status `baru` dan `dikonfirmasi`. **Riwayat** berisi sisanya.
- Janji `baru` atau `dikonfirmasi` yang tanggalnya sudah lewat ditampilkan sebagai `Sudah lewat` (neutral).

## 10. Function standar

Nama function dan hasilnya harus sama dengan tabel ini. Letak file dan pemilik tiap function ada di [TUGAS.md](TUGAS.md). Kalau function-nya sudah ada, pakai saja, jangan dibuat ulang.

| Function | Contoh | Aturan |
|---|---|---|
| `formatRupiah(angka)` | `150000` → `Rp 150.000` | titik sebagai pemisah ribuan |
| `labelHarga(harga)` | `null` → `Tanya harga ke praktik`, `0` → `Gratis` | selain itu memakai `formatRupiah`; dipakai mulai Modul 2 |
| `formatTanggal(tanggal)` | `"2026-10-06"` → `Selasa, 6 Oktober 2026` | tanggal selalu disimpan sebagai string `"YYYY-MM-DD"` |
| `tanggalRamah(tanggal)` | hari ini → `Hari ini`, besok → `Besok` | selain itu memakai `formatTanggal` |
| `formatJam(jam)` | `"08:30"` → `08.30` | rentang: `08.30–09.00`; tanpa jam: `Jam menyusul` |
| `hitungUmur(tanggalLahir)` | `"1990-05-17"` → `36` | tanggal lahir di profil ditulis `Kamis, 17 Mei 1990 (36 tahun)` |
| `sapaan()` | — | jam < 11 `Selamat pagi`, < 15 `Selamat siang`, < 18 `Selamat sore`, selain itu `Selamat malam` |
| `namaDepan(nama)` | `Budi Santoso` → `Budi` | |
| `getInisial(nama)` | `Budi Santoso` → `BS` | maksimal 2 huruf, huruf besar; nama kosong → `?` |
| `namaBergelar(nama, gelar)` | `Siti`, `Bidan` → `Bidan Siti` | gelar tidak ditulis dua kali kalau nama sudah diawali gelar |
| `subjudulPraktik(profesi, spesialis?)` | `Bidan`, `Dokter Spesialis · Anak` | |
| `alamatPraktik(alamat, kota)` | `Jl. Melati 12, Malang` | bagian yang kosong dilewati |
| `getStatusJanji(status)` | `"baru"` → label, tone, penjelasan | isi sesuai tabel status |
| `pesanWhatsApp(...)` | lihat di bawah | dipakai mulai Modul 2 (halaman detail janji temu) |

Format pesan WhatsApp (pembukanya `saya ingin menanyakan janji temu saya:`):

```
Halo Klinik Bidan Siti, saya ingin menanyakan janji temu saya:
Nama: Budi Santoso
Layanan: Periksa Kehamilan
Jadwal: Selasa, 6 Oktober 2026, jam 08.30
Terima kasih 🙏
```

Baris `Layanan` dilewati kalau layanannya kosong, dan `, jam ...` dilewati kalau jamnya belum ada.
