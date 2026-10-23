import type { Pasien } from "@/types";

export const pasien: Pasien = {
    idPasien: 1,
    namaLengkap: "Budi Santoso",
    email: "budi.santoso@example.com",
    noHp: "081234567890",
    tanggalLahir: "1990-05-17",
    jenisKelamin: "Laki-laki",
    kota: "Malang",
    provinsi: "Jawa Timur",
}; // [1]

/* ======================== EXPLANATION ========================
[1]: Pasien yang sedang memakai app. Hanya satu orang, jadi berupa object biasa, bukan array.
alamat dan foto sengaja tidak diisi, supaya di halaman Profil muncul "Belum diisi" dan inisial "BS".
=================================================================*/
