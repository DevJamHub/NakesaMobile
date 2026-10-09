import { warna } from "@/constants";
import { StyleSheet } from "react-native";

export const emptyStateStyles = StyleSheet.create({
    wadah: {
        alignItems: "center",
        padding: 24,
        gap: 8,
    },

    lingkaran: {
        width: 64,
        height: 64,
        borderRadius: 999,
        backgroundColor: warna.primarySoft,
        alignItems: "center", // [1]
        justifyContent: "center",
    },

    judul: {
        fontSize: 17,
        lineHeight: 23,
        fontWeight: "600",
        color: warna.text,
        textAlign: "center",
    },

    pesan: {
        fontSize: 14,
        lineHeight: 20,
        color: warna.textMuted,
        textAlign: "center",
        maxWidth: 300, // [2]
    },
});

/* ======================== EXPLANATION ========================
[1]: alignItems mengatur posisi isi secara mendatar dan justifyContent secara tegak, jadi kalau
keduanya "center" ikonnya tepat di tengah lingkaran.
[2]: maxWidth membatasi lebar teks pesan supaya baris kalimatnya tidak terlalu panjang di layar lebar.
=================================================================*/
