export function formatRupiah(angka: number): string {
    return `Rp ${angka.toLocaleString("id-ID")}`; // [1]
}

export function getInisial(nama: string): string {
    const kata = nama.trim().split(" "); // [2]
    let inisial = "";

    for (let i = 0; i < kata.length; i++) {
        if (kata[i] !== "" && inisial.length < 2) {
            inisial = inisial + kata[i][0].toUpperCase(); // [3]
        }
    }

    return inisial === "" ? "?" : inisial; // [4]
}

export function sapaan(): string {
    const jam = new Date().getHours(); // [5]

    if (jam < 11) {
        return "Selamat pagi";
    } else if (jam < 15) {
        return "Selamat siang";
    } else if (jam < 18) {
        return "Selamat sore";
    } else {
        return "Selamat malam";
    } // [6]
}

export function namaDepan(nama: string): string {
    return nama.trim().split(" ")[0]; // [7]
}

export function namaBergelar(nama: string, gelar: string): string {
    if (nama === "" || gelar === "") {
        return nama;
    }

    if (nama.toLowerCase().startsWith(gelar.toLowerCase())) {
        return nama; // [8]
    }

    return `${gelar} ${nama}`;
}

export function subjudulPraktik(profesi: string, spesialis?: string): string {
    return spesialis ? `${profesi} · ${spesialis}` : profesi; // [9]
}

export function alamatPraktik(alamat: string, kota: string): string {
    return [alamat, kota].filter((bagian) => bagian !== "").join(", "); // [10]
}

/* ======================== EXPLANATION ========================
[1]: toLocaleString("id-ID") adalah function bawaan yang memberi titik pemisah ribuan sesuai format
Indonesia, jadi 75000 menjadi "75.000". Tanda backtick ` ` adalah template literal, jadi kita bisa
menyisipkan variabel langsung ke dalam string dengan ${...}.
[2]: trim() membuang spasi di awal dan akhir, lalu split(" ") memecah nama per kata.
"Budi Santoso" menjadi ["Budi", "Santoso"].
[3]: Primitive loop (for). Setiap kata diambil huruf pertamanya (kata[i][0]) lalu dijadikan huruf besar.
Kata kosong dilewati (kalau ada spasi dobel), dan maksimal hanya 2 huruf, jadi hasilnya "BS".
[4]: Kalau namanya kosong, tidak ada huruf yang terkumpul, jadi kita tampilkan "?".
[5]: new Date() adalah waktu sekarang di HP, getHours() mengambil jamnya (0 sampai 23).
[6]: Kondisi if / else if / else dicek dari atas. Yang pertama bernilai true langsung di-return,
jadi jam 9 menghasilkan "Selamat pagi" dan jam 13 menghasilkan "Selamat siang".
[7]: Ambil kata pertama dari nama. "Budi Santoso" menjadi "Budi".
[8]: startsWith() mengecek awal teks. Kalau nama sudah diawali gelar (misalnya "dr. Andi"),
gelar tidak ditulis dua kali. toLowerCase() supaya "Dr." dan "dr." dianggap sama.
[9]: Ternary: kalau ada spesialis, hasilnya "Dokter Spesialis · Anak". Kalau tidak, cukup nama profesinya.
[10]: filter() membuang bagian yang kosong, lalu join(", ") menggabungkan sisanya dengan koma.
["Jl. Ijen 8", "Malang"] menjadi "Jl. Ijen 8, Malang".
=================================================================*/
