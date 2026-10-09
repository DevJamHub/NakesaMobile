import type { JanjiTemu } from "@/types";

export const janjiTemus: JanjiTemu[] = [ // [1]
    {
        idJanji: 1,
        idPraktik: 1,
        idLayanan: 1,
        tanggal: "2026-11-10",
        jamMulai: "08:30",
        jamSelesai: "09:00",
        status: "dikonfirmasi",
    },
    {
        idJanji: 2,
        idPraktik: 2,
        idLayanan: 2,
        tanggal: "2026-11-17",
        status: "baru", // [2]
    },
    {
        idJanji: 3,
        idPraktik: 3,
        idLayanan: 3,
        tanggal: "2026-10-01",
        jamMulai: "10:00",
        jamSelesai: "10:30",
        status: "baru", // [3]
    },
    {
        idJanji: 4,
        idPraktik: 4,
        tanggal: "2026-09-22",
        jamMulai: "13:00",
        jamSelesai: "13:30",
        status: "selesai", // [4]
    },
    {
        idJanji: 5,
        idPraktik: 5,
        idLayanan: 5,
        tanggal: "2026-09-15",
        jamMulai: "09:00",
        jamSelesai: "10:00",
        status: "batal",
    },
    {
        idJanji: 6,
        idPraktik: 1,
        idLayanan: 1,
        tanggal: "2026-08-25",
        jamMulai: "08:00",
        jamSelesai: "08:30",
        status: "ditolak",
    },
];

/* ======================== EXPLANATION ========================
[1]: Array of objects. Setiap object harus sesuai type JanjiTemu. Tanggal ditulis "YYYY-MM-DD".
Janji 1 dan 2 tanggalnya setelah hari demo, jadi masuk "Akan Datang". Sisanya masuk "Riwayat".
[2]: Janji ini tidak punya jamMulai dan jamSelesai, jadi card menampilkan "Jam menyusul".
[3]: Statusnya "baru" tetapi tanggalnya sudah lewat, jadi ditampilkan sebagai "Sudah lewat".
[4]: Janji ini tidak punya idLayanan, jadi card menampilkan nama profesi praktiknya.
=================================================================*/
