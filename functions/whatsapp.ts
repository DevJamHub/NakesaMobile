/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: pesanWhatsApp
    2.1: Cari Praktik & Layanan
    2.2: Baris Pembuka & Nama
    2.3: Baris Layanan (kalau ada)
    2.4: Baris Jadwal & Penutup
========================================================= */

// 1.1: Import Section
import { getLayanan } from "@/functions/layanan";
import { getPraktik } from "@/functions/praktik";
import { formatJam, formatTanggal } from "@/functions/tanggal"; // [1]
import type { JanjiTemu } from "@/types";

// 1.2: pesanWhatsApp
export function pesanWhatsApp(janji: JanjiTemu, namaPasien: string): string { // [2]

    // 2.1: Cari Praktik & Layanan
    const namaPraktik = getPraktik(janji.idPraktik)?.namaPraktik ?? "Praktik"; // [3]
    let namaLayanan = "";
    if (janji.idLayanan !== undefined) {
        namaLayanan = getLayanan(janji.idLayanan)?.namaLayanan ?? "";
    } // [4]

    // 2.2: Baris Pembuka & Nama
    const barisPesan: string[] = [
        `Halo ${namaPraktik}, saya ingin menanyakan janji temu saya:`,
        `Nama: ${namaPasien}`,
    ]; // [5]

    // 2.3: Baris Layanan (kalau ada)
    if (namaLayanan !== "") {
        barisPesan.push(`Layanan: ${namaLayanan}`);
    } // [6]

    // 2.4: Baris Jadwal & Penutup
    let jadwal = `Jadwal: ${formatTanggal(janji.tanggal)}`;
    if (janji.jamMulai) {
        jadwal = `${jadwal}, jam ${formatJam(janji.jamMulai)}`;
    } // [7]
    barisPesan.push(jadwal);
    barisPesan.push("Terima kasih 🙏");

    return barisPesan.join("\n"); // [8]
}

/* ======================== EXPLANATION ========================
[1]: Function lain diimpor langsung dari file-nya, bukan dari "@/functions". Alasannya, functions/index.ts
juga mengekspor file ini. Kalau file ini mengimpor dari index itu, keduanya saling memanggil berputar
(require cycle) dan Expo memberi warning kuning. Alasannya sama seperti di statusJanji.ts.
[2]: Function ini menerima 2 parameter: janji (object JanjiTemu yang sedang dibuka) dan namaPasien
(dikirim dari halaman, diambil dari data pasien). Hasilnya satu teks (string) berisi pesan WhatsApp.
Contoh pemakaian: pesanWhatsApp(janji, "Budi Santoso").
[3]: Data janji hanya menyimpan idPraktik, jadi namanya dicari dengan getPraktik().
?. (optional chaining) mengambil namaPraktik hanya kalau praktiknya ketemu.
?? artinya "kalau hasil di kiri undefined, pakai yang di kanan", jadi kalau praktik tidak ketemu
pesannya tetap bisa dibuat dengan kata "Praktik".
[4]: idLayanan boleh kosong (tanda ? di type JanjiTemu). Kita isi namaLayanan dengan teks kosong dulu
(let, karena nilainya bisa diganti), lalu dicari dengan getLayanan() hanya kalau idLayanan ada.
[5]: Array of string. Setiap item adalah satu baris pesan. Tanda backtick ` ` adalah template literal,
jadi variabel bisa disisipkan langsung dengan ${...}.
[6]: Baris "Layanan: ..." hanya ditambahkan kalau namaLayanan tidak kosong (STANDAR bagian 10).
push() menambah satu item di akhir array.
[7]: ", jam ..." hanya ditambahkan kalau jamMulai ada. formatJam("08:30") hasilnya "08.30", dan
formatTanggal("2026-11-10") hasilnya "Selasa, 10 November 2026".
[8]: join("\n") menggabungkan semua baris menjadi satu teks, dipisah baris baru (\n). Contoh hasil janji nomor 1:
Halo Praktik Mandiri Bidan Siti, saya ingin menanyakan janji temu saya:
Nama: Budi Santoso
Layanan: Periksa Kehamilan
Jadwal: Selasa, 10 November 2026, jam 08.30
Terima kasih 🙏
=================================================================*/
