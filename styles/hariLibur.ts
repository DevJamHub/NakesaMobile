import { warna } from "@/constants";
import { StyleSheet } from "react-native";

export const hariLiburStyles = StyleSheet.create({
    baris: {
        flexDirection: "row",
        gap: 12,
    }, // [1]

    lingkaranIkon: {
        width: 34,
        height: 34,
        borderRadius: 999,
        backgroundColor: warna.primarySoft,
        alignItems: "center",
        justifyContent: "center",
    },

    isi: {
        flex: 1,
        gap: 4,
    },

    label: {
        fontSize: 12,
        lineHeight: 16,
        color: warna.textMuted,
    }, // [2]

    nilai: {
        fontSize: 16,
        lineHeight: 22,
        color: warna.text,
    },

    keterangan: {
        fontSize: 14,
        lineHeight: 20,
        color: warna.textMuted,
    },

    pesanGagal: {
        fontSize: 14,
        lineHeight: 20,
        color: warna.danger,
    },

    barisMemuat: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
});

/* ======================== EXPLANATION ========================
[1]: Bentuk "Baris info" dari STANDAR bagian 5: susunan baris dengan jarak 12, ikon 18 primary di dalam
lingkaran 34×34 berlatar primarySoft (lingkaranIkon), lalu label dan nilai di kanannya (isi).
[2]: Ukuran teks mengikuti STANDAR bagian 2: label = caption (12/16), nilai = body (16/22),
keterangan = small (14/20). pesanGagal sama dengan small tetapi berwarna danger, seperti pesan salah
di STANDAR bagian 7.
=================================================================*/
