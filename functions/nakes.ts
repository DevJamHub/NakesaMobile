import { nakeses } from "@/constants";
import type { Nakes } from "@/types";

export function getNakes(idNakes: number): Nakes | undefined {
    return nakeses.find(
        (item) => item.idNakes === idNakes
    ); // [1]
}

/* ======================== EXPLANATION ========================
[1]: find() adalah function bawaan array yang mengembalikan item pertama yang id-nya cocok.
Kalau tidak ada yang cocok, hasilnya undefined. Karena itu return type-nya Nakes | undefined (union type).
Yang memanggil function ini memakai ?. dan ??, contoh: getNakes(1)?.namaNakes ?? "Tidak ditemukan".
=================================================================*/
