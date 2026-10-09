/* =================== TABLE OF CONTENT =================
1.1: Daftar Nama Hari & Bulan
1.2: buatTeksTanggal (hanya dipakai di file ini)
1.3: tanggalHariIni
1.4: formatTanggal
1.5: tanggalRamah
1.6: formatJam
========================================================= */

// 1.1: Daftar Nama Hari & Bulan
const haris = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]; // [1]
const bulans = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// 1.2: buatTeksTanggal (hanya dipakai di file ini)
function buatTeksTanggal(tanggal: Date): string { // [2]
    const tahun = tanggal.getFullYear();
    const bulan = String(tanggal.getMonth() + 1).padStart(2, "0"); // [3]
    const hari = String(tanggal.getDate()).padStart(2, "0");

    return `${tahun}-${bulan}-${hari}`;
}

// 1.3: tanggalHariIni
export function tanggalHariIni(): string {
    return buatTeksTanggal(new Date()); // [4]
}

// 1.4: formatTanggal
export function formatTanggal(tanggal: string): string {
    const bagian = tanggal.split("-"); // [5]
    const tahun = Number(bagian[0]);
    const bulan = Number(bagian[1]);
    const hari = Number(bagian[2]);
    const objekTanggal = new Date(tahun, bulan - 1, hari); // [6]

    return `${haris[objekTanggal.getDay()]}, ${hari} ${bulans[bulan - 1]} ${tahun}`;
}

// 1.5: tanggalRamah
export function tanggalRamah(tanggal: string): string {
    const besok = new Date();
    besok.setDate(besok.getDate() + 1); // [7]

    if (tanggal === tanggalHariIni()) {
        return "Hari ini";
    } else if (tanggal === buatTeksTanggal(besok)) {
        return "Besok";
    }

    return formatTanggal(tanggal);
}

// 1.6: formatJam
export function formatJam(jamMulai?: string, jamSelesai?: string): string { // [8]
    if (!jamMulai) {
        return "Jam menyusul";
    }

    const mulai = jamMulai.replace(":", "."); // [9]
    if (!jamSelesai) {
        return mulai;
    }

    return `${mulai}–${jamSelesai.replace(":", ".")}`;
}

/* ======================== EXPLANATION ========================
[1]: Array nama hari dimulai dari "Minggu" karena getDay() bawaan JavaScript memberi angka 0 untuk Minggu,
1 untuk Senin, dan seterusnya. Jadi haris[0] = "Minggu". Array bulan juga mulai dari 0: bulans[0] = "Januari".
[2]: Function ini tidak di-export, jadi hanya bisa dipakai di file ini. Isinya mengubah object Date
menjadi teks "YYYY-MM-DD", dipakai oleh tanggalHariIni() dan tanggalRamah() supaya kodenya tidak ditulis dua kali.
[3]: getMonth() menghitung bulan dari 0 (Januari = 0), jadi ditambah 1. padStart(2, "0") menambah angka 0
di depan kalau panjangnya kurang dari 2, jadi 6 menjadi "06".
[4]: new Date() tanpa isi adalah tanggal dan jam saat ini di HP.
[5]: split("-") memecah teks di setiap tanda "-". "2026-10-06" menjadi ["2026", "10", "06"].
Lalu Number() mengubah teks menjadi angka, jadi "06" menjadi 6.
[6]: new Date(tahun, bulan, hari) membuat object tanggal. Bulannya dikurangi 1 karena hitungannya mulai dari 0.
Object ini kita butuhkan hanya untuk getDay(), yaitu mencari nama harinya.
[7]: setDate() mengganti tanggal. Tanggal hari ini ditambah 1 menjadi besok. Kalau hari ini tanggal 31,
JavaScript otomatis pindah ke tanggal 1 bulan berikutnya.
[8]: Tanda ? berarti parameter boleh tidak diisi. formatJam("08:30", "09:00") hasilnya "08.30–09.00",
formatJam("08:30") hasilnya "08.30", dan formatJam() hasilnya "Jam menyusul".
[9]: replace(":", ".") mengganti titik dua dengan titik, jadi "08:30" menjadi "08.30".
=================================================================*/
