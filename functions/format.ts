export function formatRupiah(angka: number): string {
    return `Rp ${angka.toLocaleString("id-ID")}`; // [1]
}

/* ======================== EXPLANATION ========================
[1]: toLocaleString("id-ID") adalah function bawaan yang memberi titik pemisah ribuan sesuai format
Indonesia, jadi 75000 menjadi "75.000". Tanda backtick ` ` adalah template literal, jadi kita bisa
menyisipkan variabel langsung ke dalam string dengan ${...}.
=================================================================*/
