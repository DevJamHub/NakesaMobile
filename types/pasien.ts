import type { NamaIkon } from "@/types";

export interface Pasien {
    readonly idPasien: number; // [1]
    namaLengkap: string;
    email: string;
    noHp?: string; // [2]
    tanggalLahir?: string; // "1990-05-17"
    jenisKelamin?: "Laki-laki" | "Perempuan"; // [3]
    alamat?: string;
    kota?: string;
    provinsi?: string;
    foto?: string; // link gambar
}

export type InfoProfil = { ikon: NamaIkon; label: string; nilai: string }; // [4]

/* ======================== EXPLANATION ========================
[1]: interface adalah cara lain menulis bentuk object, mirip type. readonly artinya idPasien tidak boleh
diubah setelah object dibuat. Kalau ada kode yang mencoba mengubahnya, TypeScript memberi error.
[2]: Tanda ? artinya opsional: pasien boleh belum mengisi data ini. Di halaman Profil, data yang kosong
ditampilkan sebagai "Belum diisi".
[3]: Union type. jenisKelamin hanya boleh berisi "Laki-laki" atau "Perempuan".
[4]: Bentuk satu baris info di halaman Profil, dipakai oleh buatInfoProfil() dan component InfoRow.
=================================================================*/
