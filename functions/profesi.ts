import { profesis } from "@/constants";
import type { Profesi } from "@/types";

export function getProfesi(idProfesi: number): Profesi | undefined {
    return profesis.find(
        (item) => item.idProfesi === idProfesi
    ); // [1]
}

/* ======================== EXPLANATION ========================
[1]: find() adalah function bawaan array yang mengembalikan item pertama yang id-nya cocok.
Kalau tidak ada yang cocok, hasilnya undefined. Karena itu return type-nya Profesi | undefined (union type).
Yang memanggil function ini memakai ?. dan ??, contoh: getProfesi(1)?.namaProfesi ?? "Tidak ditemukan".
=================================================================*/
