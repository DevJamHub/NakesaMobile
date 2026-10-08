import { lokasis } from "@/constants";

export function getLokasi(idLokasi: number): string {
    const lokasi = lokasis.find(
        (item) => item.idLokasi === idLokasi
    ); // [1]

    return lokasi?.namaLokasi ?? "Tidak ditemukan"; // [2]
}

/* ======================== EXPLANATION ========================
[1]: Ini kita mengambil namaLokasi berdasarkan id. find() adalah function bawaan array yang
mengembalikan item pertama yang cocok, atau undefined kalau tidak ada yang cocok.
[2]: object?.prop adalah optional chaining. Artinya: Ambil props dari object, tetapi hanya jika object tidak null atau undefined.
Sementara ?? artinya kembalikan opsi dikanan jika object.prop tidak ada, jika ada ambil yang dikiri.
=================================================================*/
