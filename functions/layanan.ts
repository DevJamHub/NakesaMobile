import { layanans } from "@/constants";
import type { Layanan } from "@/types";

export function getLayanan(idLayanan: number): Layanan | undefined {
    return layanans.find(
        (item) => item.idLayanan === idLayanan
    ); // [1]
}

/* ======================== EXPLANATION ========================
[1]: find() adalah function bawaan array yang mengembalikan item pertama yang id-nya cocok.
Kalau tidak ada yang cocok, hasilnya undefined. Karena itu return type-nya Layanan | undefined (union type).
Yang memanggil function ini memakai ?. dan ??, contoh: getLayanan(1)?.namaLayanan ?? "Tidak ditemukan".
=================================================================*/
