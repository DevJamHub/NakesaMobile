import { warna } from "@/constants";
import { StyleSheet } from "react-native";

export const akunStyles = StyleSheet.create({
    layar: {
        flex: 1,
        backgroundColor: warna.background,
    },

    isi: {
        flexGrow: 1,
        justifyContent: "center", // [1]
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

    keterangan: {
        fontSize: 16,
        lineHeight: 22,
        color: warna.textMuted,
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
        elevation: 2,
        gap: 12,
    },

    label: {
        fontSize: 12,
        lineHeight: 16,
        color: warna.textMuted,
    }, // [2]

    namaProfil: {
        fontSize: 20,
        lineHeight: 26,
        fontWeight: "700",
        color: warna.text,
    },

    kolom: {
        minHeight: 54,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: warna.border,
        backgroundColor: warna.surface,
        fontSize: 16,
        color: warna.text,
    }, // [3]

    memuat: {
        minHeight: 54,
        justifyContent: "center",
    },

    catatan: {
        fontSize: 14,
        lineHeight: 20,
        color: warna.textMuted,
        textAlign: "center",
    },
});

/* ======================== EXPLANATION ========================
[1]: flexGrow: 1 membuat isi ScrollView mengisi seluruh tinggi layar, lalu justifyContent: "center"
menaruh form di tengah layar secara vertikal.
[2]: Label di atas kolom memakai jenis caption (12 / 16, textMuted), sama seperti label kolom di halaman
Ubah Kata Sandi (TUGAS.md Modul 2).
[3]: Kolom isian (TextInput). Bentuknya sama dengan kolom cari tanpa ikon dan bayangan (TUGAS.md Modul 2,
Ubah Kata Sandi): tinggi minimal 54, padding samping 16, garis tepi 1 warna border, sudut 16, teks 16.
File style ini dipakai bersama oleh halaman Masuk, Daftar, dan kerangka Profil (semua halaman akun).
=================================================================*/
