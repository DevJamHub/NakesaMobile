import type { Tone } from "@/types";

export type StatusJanji = "baru" | "dikonfirmasi" | "selesai" | "batal" | "ditolak"; // [1]

export type JanjiTemu = {
    idJanji: number;
    idPraktik: number;       // merujuk ke data praktik
    idLayanan?: number;      // [2]
    tanggal: string;         // "2026-10-20"
    jamMulai?: string;       // "08:30"
    jamSelesai?: string;     // "09:00"
    status: StatusJanji;
};

export type InfoStatusJanji = { // [3]
    label: string;
    tone: Tone;
    penjelasan: string;
};

/* ======================== EXPLANATION ========================
[1]: Union type. StatusJanji hanya boleh berisi salah satu dari 5 teks ini. Kalau kita menulis
status: "terima", TypeScript langsung memberi error karena "terima" tidak ada di daftar.
[2]: Tanda ? berarti field ini boleh tidak diisi. Kalau idLayanan kosong, card menampilkan nama profesi.
Begitu juga jamMulai dan jamSelesai: kalau kosong, card menampilkan "Jam menyusul".
[3]: Bentuk hasil dari function getStatusJanji(): label untuk badge dan judul Alert, tone untuk warna
badge, dan penjelasan untuk isi Alert.
=================================================================*/
