import { profesis } from "@/constants";

export function getProfesi(idProfesi: number): string {
    const profesi = profesis.find(
        (item) => item.idProfesi === idProfesi
    ); // [1]

    return profesi?.namaProfesi ?? "Tidak ditemukan"; // [2]
}

/* ======================== EXPLANATION ========================
[1]: Ini kita mengambil namaProfesi berdasarkan id. find() adalah function bawaan array yang
mengembalikan item pertama yang cocok, atau undefined kalau tidak ada yang cocok.
[2]: object?.prop adalah optional chaining. Artinya: Ambil props dari object, tetapi hanya jika object tidak null atau undefined.
Sementara ?? artinya kembalikan opsi dikanan jika object.prop tidak ada, jika ada ambil yang dikiri.
=================================================================*/
