import { praktiks } from "@/constants";
import type { Praktik } from "@/types";

export function getPraktik(idPraktik: number): Praktik | undefined {
    return praktiks.find(
        (item) => item.idPraktik === idPraktik
    ); // [1]
}

/* ======================== EXPLANATION ========================
[1]: find() adalah function bawaan array yang mengembalikan item pertama yang id-nya cocok.
Kalau tidak ada yang cocok, hasilnya undefined. Karena itu return type-nya Praktik | undefined (union type).
Yang memanggil function ini memakai ?. dan ??, contoh: getPraktik(1)?.namaPraktik ?? "Tidak ditemukan".
=================================================================*/
