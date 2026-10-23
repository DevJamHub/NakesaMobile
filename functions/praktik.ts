import { praktiks } from "@/constants";
import type { Praktik } from "@/types";

export function getPraktik(idPraktik: number): Praktik | undefined {
    return praktiks.find(
        (item) => item.idPraktik === idPraktik
    ); // [1]
}

export function cariPraktik(kataKunci: string): Praktik[] {
    return praktiks.filter(
        (item) => item.namaPraktik.toLowerCase().includes(kataKunci.toLowerCase())
    ); // [2]
}

/* ======================== EXPLANATION ========================
[1]: find() adalah function bawaan array yang mengembalikan item pertama yang id-nya cocok.
Kalau tidak ada yang cocok, hasilnya undefined. Karena itu return type-nya Praktik | undefined (union type).
Yang memanggil function ini memakai ?. dan ??, contoh: getPraktik(1)?.namaPraktik ?? "Tidak ditemukan".
[2]: filter() mengembalikan semua praktik yang namanya mengandung kataKunci. toLowerCase() mengubah
keduanya ke huruf kecil, jadi "GIGI" dan "gigi" dianggap sama. Kalau kataKunci kosong, includes("")
selalu true, jadi semua praktik tampil.
=================================================================*/
