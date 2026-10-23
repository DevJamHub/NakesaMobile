import { StyleSheet } from "react-native";

export const tombolStyles = StyleSheet.create({
    tombol: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // [1]
        gap: 8,
        minHeight: 54,
        paddingHorizontal: 20,
        borderRadius: 12,
    },

    teks: {
        fontSize: 16,
        fontWeight: "700",
    },
});

/* ======================== EXPLANATION ========================
[1]: Ikon dan teks disusun berbaris (row) dan diletakkan di tengah tombol, dengan jarak 8 di antaranya.
Warna latar, warna teks, dan garis tepi tidak ditulis di sini karena berubah sesuai jenis tombol,
jadi diberikan lewat inline style di components/Tombol.tsx.
=================================================================*/
