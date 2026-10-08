import { nakeses } from "@/constants";

export function getNakes(idNakes: number): string {
    const nakes = nakeses.find(
        (item) => item.idNakes === idNakes
    ); // [1]

    return nakes?.namaNakes ?? "Tidak ditemukan"; // [2]
}

/* ======================== EXPLANATION ========================
[1]: Ini kita mengambil namaNakes berdasarkan id. find() adalah function bawaan array yang
mengembalikan item pertama yang cocok, atau undefined kalau tidak ada yang cocok.
[2]: object?.prop adalah optional chaining. Artinya: Ambil props dari object, tetapi hanya jika object tidak null atau undefined.
Sementara ?? artinya kembalikan opsi dikanan jika object.prop tidak ada, jika ada ambil yang dikiri.
=================================================================*/
