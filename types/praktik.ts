export type Praktik = {
    idPraktik: number;
    namaPraktik: string;
    idNakes: number;
    idProfesi: number;
    spesialis?: string; // [1]
    alamat: string;
    kota: string;
    sedangBuka: boolean;
};

/* ======================== EXPLANATION ========================
[1]: Tanda ? artinya opsional: hanya praktik Dokter Spesialis yang punya spesialis (misalnya "Anak").
=================================================================*/
