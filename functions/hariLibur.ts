/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Alamat API
1.3: ambilHariLibur (async + fetch)
1.4: ambilHariLiburDenganBatas (new Promise: resolve & reject)
1.5: cekHariLibur (async + await)
========================================================= */

// 1.1: Import Section
import type { HariLibur } from "@/types";

// 1.2: Alamat API 

//B2 Alamat API: menyimpan alamat server. (simpan nomor telepon restoran)
const ALAMAT_API = "https://nagerholidays.com/api/v4/Holidays"; // [1]
const BATAS_WAKTU = 8000; // [2]

// 1.3: ambilHariLibur (async + fetch)
//B3 ambilHariLibur: meminta data ke server lalu menerimanya. (telepon, pesan, makanan datang)
export async function ambilHariLibur(tahun: number): Promise<HariLibur[]> { // [3]
    const respon = await fetch(`${ALAMAT_API}/ID/${tahun}`, { cache: "no-store" }); // [4]

    if (!respon.ok) {
        throw new Error(`Server menjawab dengan kode ${respon.status}`);
    } // [5]

    const daftarLibur: HariLibur[] = await respon.json(); // [6] 
    return daftarLibur;
}

// 1.4: ambilHariLiburDenganBatas (new Promise: resolve & reject)
export function ambilHariLiburDenganBatas(tahun: number): Promise<HariLibur[]> {
    return new Promise((resolve, reject) => { // [7]
        const timer = setTimeout(() => {
            reject(new Error("Server terlalu lama menjawab."));
        }, BATAS_WAKTU); // [8]

        ambilHariLibur(tahun)
            .then((daftarLibur) => {
                clearTimeout(timer);
                resolve(daftarLibur);
            })
            .catch((error) => {
                clearTimeout(timer);
                reject(error);
            }); // [9]
    });
}

// 1.5: cekHariLibur (async + await)
export async function cekHariLibur(tanggal: string): Promise<HariLibur | undefined> { // [10]
    const tahun = Number(tanggal.slice(0, 4)); // [11]
    const daftarLibur = await ambilHariLiburDenganBatas(tahun);

    return daftarLibur.find((libur) => libur.date === tanggal); // [12]
}

/* ======================== EXPLANATION ========================
[1]: Bagian tetap dari alamat (endpoint) External API Nager.Date versi 4, layanan gratis daftar hari libur
nasional tanpa API key (sumber: https://nagerholidays.com/api, bagian "Quick Start Example").
Pola alamatnya GET /api/v4/Holidays/{CountryCode}/{Year}, jadi alamat lengkapnya
https://nagerholidays.com/api/v4/Holidays/ID/2026 = hari libur di Indonesia (kode negara ID) tahun 2026.
Method yang dipakai GET (mengambil data), method bawaan fetch().
[2]: Batas waktu menunggu server: 8000 milidetik = 8 detik. Dipakai di [8].
[3]: Custom async function. Karena ada kata async, function ini SELALU mengembalikan Promise.
Promise<HariLibur[]> artinya kalau berhasil, isinya array of objects bertipe HariLibur (types/hariLibur.ts).
[4]: fetch() adalah PRE-BUILT async function (bawaan JavaScript/React Native) untuk mengirim HTTP Request.
fetch() mengembalikan Promise, jadi kita pakai await supaya baris berikutnya menunggu jawaban server dulu.
Template literal `${...}` menyusun alamat: ALAMAT_API + "/ID/" + tahun, misalnya ".../Holidays/ID/2026".
Urutannya {CountryCode} dulu baru {Year}, sesuai pola di dokumentasi API.
{ cache: "no-store" } artinya selalu minta data baru ke server, bukan memakai salinan lama di browser.
Ini penting di web: kalau alamat API pernah dibuka langsung di browser, salinan lamanya tidak membawa
izin CORS sehingga fetch dari app ditolak browser.
[5]: respon.ok bernilai true kalau kode status 200–299 (berhasil). Kalau tidak (misalnya 404 atau 500),
kita throw Error. throw di dalam async function membuat Promise-nya reject (gagal).
[6]: respon.json() juga PRE-BUILT async function: mengubah teks JSON dari server menjadi array of objects
JavaScript, jadi perlu await juga. Hasilnya langsung dimasukkan ke variabel bertipe HariLibur[] (interface).
[7]: Custom Promise memakai Promise constructor: new Promise((resolve, reject) => { ... }).
- resolve(nilai): memberi tahu bahwa Promise BERHASIL, nilainya diteruskan ke .then()
- reject(error): memberi tahu bahwa Promise GAGAL, error-nya diteruskan ke .catch()
Promise hanya bisa selesai SEKALI: mana yang dipanggil duluan, itu yang dipakai.
[8]: setTimeout menyiapkan "alarm". Kalau dalam 8 detik server belum menjawab, reject() dipanggil dengan
pesan "Server terlalu lama menjawab.", jadi pengguna tidak menunggu selamanya.
[9]: Promise chain. .then() jalan kalau ambilHariLibur() berhasil: alarm dimatikan dengan clearTimeout(),
lalu resolve() mengirim daftar libur. .catch() jalan kalau gagal (misalnya tidak ada internet):
alarm dimatikan, lalu reject() meneruskan error-nya.
[10]: Custom async function yang dipakai halaman. Hasilnya object HariLibur kalau tanggal itu hari libur,
atau undefined kalau bukan.
[11]: Tanggal disimpan sebagai "YYYY-MM-DD", jadi slice(0, 4) mengambil 4 huruf pertama ("2026"),
lalu Number() mengubahnya menjadi angka 2026 untuk alamat API.
[12]: find() mencari hari libur yang field date-nya sama dengan tanggal janji. Kalau tidak ada,
hasilnya undefined.
=================================================================*/
