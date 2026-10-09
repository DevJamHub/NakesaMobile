/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: cekStatusAktif (hanya dipakai di file ini)
1.3: getStatusJanji
    2.1: Aturan "Sudah lewat"
    2.2: Switch Status
1.4: getJanjiAkanDatang
1.5: getRiwayatJanji
1.6: getJanjiBerikutnya
========================================================= */

// 1.1: Import Section
import { janjiTemus } from "@/constants";
import { tanggalHariIni } from "@/functions/tanggal"; // [9]
import type { InfoStatusJanji, JanjiTemu, StatusJanji } from "@/types";

// 1.2: cekStatusAktif (hanya dipakai di file ini)
function cekStatusAktif(status: StatusJanji): boolean {
    return status === "baru" || status === "dikonfirmasi"; // [1]
}

// 1.3: getStatusJanji
export function getStatusJanji(janji: JanjiTemu): InfoStatusJanji {

    // 2.1: Aturan "Sudah lewat"
    const sudahLewat = janji.tanggal < tanggalHariIni(); // [2]
    if (cekStatusAktif(janji.status) && sudahLewat) {
        return {
            label: "Sudah lewat",
            tone: "neutral",
            penjelasan: "Tanggal janji temu ini sudah lewat.",
        };
    }

    // 2.2: Switch Status
    switch (janji.status) { // [3]
        case "baru":
            return {
                label: "Menunggu konfirmasi",
                tone: "warning",
                penjelasan: "Praktik akan mengonfirmasi janji temu ini, biasanya lewat WhatsApp.",
            };
        case "dikonfirmasi":
            return {
                label: "Dikonfirmasi",
                tone: "success",
                penjelasan: "Janji temu sudah dikonfirmasi. Datang sesuai jadwal ya.",
            };
        case "selesai":
            return {
                label: "Selesai",
                tone: "info",
                penjelasan: "Janji temu ini sudah selesai.",
            };
        case "batal":
            return {
                label: "Dibatalkan",
                tone: "neutral",
                penjelasan: "Janji temu ini sudah dibatalkan.",
            };
        case "ditolak":
            return {
                label: "Ditolak",
                tone: "danger",
                penjelasan: "Praktik tidak bisa menerima janji temu ini. Silakan pilih jadwal lain.",
            };
    }
}

// 1.4: getJanjiAkanDatang
export function getJanjiAkanDatang(): JanjiTemu[] {
    const hariIni = tanggalHariIni();
    const akanDatang = janjiTemus.filter(
        (janji) => cekStatusAktif(janji.status) && janji.tanggal >= hariIni
    ); // [4]

    return akanDatang.sort(
        (a, b) => a.tanggal.localeCompare(b.tanggal)
    ); // [5]
}

// 1.5: getRiwayatJanji
export function getRiwayatJanji(): JanjiTemu[] {
    const akanDatang = getJanjiAkanDatang();
    const riwayat = janjiTemus.filter(
        (janji) => !akanDatang.includes(janji)
    ); // [6]

    return riwayat.sort(
        (a, b) => b.tanggal.localeCompare(a.tanggal)
    ); // [7]
}

// 1.6: getJanjiBerikutnya
export function getJanjiBerikutnya(): JanjiTemu | undefined {
    return getJanjiAkanDatang()[0]; // [8]
}

/* ======================== EXPLANATION ========================
[1]: Status "baru" dan "dikonfirmasi" artinya janji temunya masih berjalan. || artinya "atau",
jadi hasilnya true kalau status salah satu dari keduanya.
[2]: Tanggal berbentuk teks "YYYY-MM-DD" bisa dibandingkan langsung dengan < dan >, karena urutan
teksnya sama dengan urutan waktunya: "2026-10-01" < "2026-10-09" bernilai true.
[3]: switch memeriksa isi janji.status, lalu menjalankan case yang cocok. Setiap case langsung return,
jadi tidak perlu break. Isi label, tone, dan penjelasan sesuai STANDAR.md bagian 9.
[4]: filter() membuat array baru yang isinya hanya janji yang lolos syarat: statusnya masih aktif DAN
tanggalnya hari ini atau setelahnya. && artinya "dan", jadi kedua syarat harus terpenuhi.
[5]: sort() mengurutkan array. localeCompare() membandingkan dua teks: hasilnya negatif kalau a lebih dulu,
positif kalau b lebih dulu. a dibanding b berarti urutan naik, jadi tanggal paling dekat ada di atas.
[6]: Riwayat berisi semua janji yang TIDAK ada di daftar akan datang. includes() mengecek apakah sebuah
item ada di dalam array, lalu tanda ! membalik hasilnya (true menjadi false, false menjadi true).
[7]: Kebalikan dari [5]: b dibanding a berarti urutan turun, jadi janji terbaru ada di atas.
[8]: [0] mengambil item pertama, yaitu janji yang paling dekat. Kalau daftarnya kosong, hasilnya
undefined, makanya return type-nya JanjiTemu | undefined. Function ini dipakai di halaman Beranda.
[9]: tanggalHariIni diimpor langsung dari file tanggal.ts, bukan dari "@/functions". Alasannya,
functions/index.ts juga mengekspor file ini. Kalau file ini mengimpor dari index itu, keduanya saling
memanggil berputar (require cycle) dan Expo memberi warning kuning.
=================================================================*/
