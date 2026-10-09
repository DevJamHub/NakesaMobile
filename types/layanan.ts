export type Layanan = {
    idLayanan: number;
    namaLayanan: string;
    harga: number | null; // [1]
};

/* ======================== EXPLANATION ========================
[1]: Union type number | null. null artinya harganya belum diketahui ("Tanya harga ke praktik").
=================================================================*/
