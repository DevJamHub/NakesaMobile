import { warna } from "@/constants";
import { StyleSheet } from "react-native";

export const sectionHeaderStyles = StyleSheet.create({
    baris: {
        flexDirection: "row",
        justifyContent: "space-between", // [1]
        alignItems: "center",
        marginBottom: 12,
    },

    judul: {
        fontSize: 17,
        lineHeight: 23,
        fontWeight: "600",
        color: warna.text,
    },

    aksi: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "600",
        color: warna.primary,
    },
});

/* ======================== EXPLANATION ========================
[1]: space-between menaruh item pertama (judul) di kiri dan item terakhir (aksi) di kanan.
=================================================================*/
