import { warna } from "@/constants";
import { StyleSheet } from "react-native";

export const janjiTemuStyles = StyleSheet.create({
    layar: {
        flex: 1,
        backgroundColor: warna.background,
    },

    isi: {
        padding: 16,
        paddingBottom: 32,
        gap: 16,
    },

    judul: {
        fontSize: 26,
        lineHeight: 32,
        letterSpacing: -0.3,
        fontWeight: "700",
        color: warna.text,
    },

    daftar: {
        gap: 12,
    },

    card: {
        backgroundColor: warna.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: warna.border,
        shadowColor: warna.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2, // [1]
    },

    cardDitekan: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }], // [2]
    },

    atas: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    infoPraktik: {
        flex: 1, // [3]
    },

    namaPraktik: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "600",
        color: warna.text,
    },

    layanan: {
        fontSize: 14,
        lineHeight: 20,
        color: warna.textMuted,
    },

    jadwal: {
        flexDirection: "row",
        flexWrap: "wrap", // [4]
        columnGap: 16,
        rowGap: 4,
        backgroundColor: warna.background,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 12,
    },

    jadwalItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    jadwalTeks: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "600",
        color: warna.text,
    },
});

/* ======================== EXPLANATION ========================
[1]: shadow... adalah bayangan untuk iPhone, sedangkan elevation adalah bayangan untuk Android.
[2]: Saat card ditekan, card dibuat sedikit transparan (opacity) dan sedikit mengecil (scale 0.99),
supaya pengguna tahu card-nya tertekan.
[3]: flex: 1 membuat kolom nama praktik mengambil sisa lebar di sebelah avatar, jadi nama yang panjang
turun ke baris berikutnya dan tidak keluar dari card.
[4]: flexWrap: "wrap" membuat jam turun ke baris kedua kalau tanggal dan jam tidak muat dalam satu baris.
columnGap adalah jarak mendatar (antara tanggal dan jam), rowGap adalah jarak antar baris.
=================================================================*/
