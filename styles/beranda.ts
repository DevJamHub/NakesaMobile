import { warna } from "@/constants";
import { StyleSheet } from "react-native";

const bayangan = {
    shadowColor: warna.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
}; // [1]

export const berandaStyles = StyleSheet.create({
    // Layar
    layar: {
        flex: 1,
        backgroundColor: warna.background,
    },

    isi: {
        padding: 16,
        paddingBottom: 32,
    },

    bagianAtas: {
        gap: 16,
    },

    // Sapaan
    kotakSapaan: {
        gap: 4,
        marginTop: 8,
    },

    sapaan: {
        fontSize: 26,
        lineHeight: 32,
        fontWeight: "700",
        letterSpacing: -0.3,
        color: warna.text,
    },

    subSapaan: {
        fontSize: 16,
        lineHeight: 22,
        color: warna.textMuted,
    },

    // Kolom cari
    kolomCari: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        minHeight: 54,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: warna.surface,
        borderWidth: 1,
        borderColor: warna.border,
        ...bayangan,
    },

    inputCari: {
        flex: 1,
        fontSize: 16,
        color: warna.text,
        paddingVertical: 12,
    },

    // Judul section
    judulSection: {
        fontSize: 17,
        lineHeight: 23,
        fontWeight: "600",
        color: warna.text,
        marginBottom: 12,
    },

    // Kategori
    gridKategori: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    kartuKategori: {
        width: "23%",
        flexGrow: 1,
        alignItems: "center",
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderRadius: 16,
        backgroundColor: warna.surface,
        borderWidth: 1,
        borderColor: warna.border,
    },

    kartuKategoriDitekan: {
        backgroundColor: warna.primarySoft,
    },

    emojiKategori: {
        fontSize: 24,
        width: 48,
        height: 48,
        lineHeight: 48,
        textAlign: "center",
        borderRadius: 24,
        overflow: "hidden",
    },

    labelKategori: {
        fontSize: 13,
        lineHeight: 17,
        fontWeight: "600",
        color: warna.text,
        textAlign: "center",
    },

    // Card praktik
    kartuPraktik: {
        backgroundColor: warna.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: warna.border,
        marginBottom: 12,
        ...bayangan,
    },

    kartuDitekan: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },

    barisPraktik: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },

    isiPraktik: {
        flex: 1,
        gap: 3,
    },

    namaPraktik: {
        fontSize: 17,
        lineHeight: 23,
        fontWeight: "600",
        color: warna.text,
    },

    subjudulPraktik: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "600",
    },

    teksKecil: {
        fontSize: 14,
        lineHeight: 20,
        color: warna.textMuted,
    },

    barisAlamat: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    // Badge buka / tutup
    badge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginTop: 4,
    },

    titikBadge: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },

    teksBadge: {
        fontSize: 13,
        fontWeight: "600",
    },
});

/* ======================== EXPLANATION ========================
[1]: Bayangan dipakai di dua tempat (kolom cari dan card praktik), jadi disimpan di satu variabel.
Tanda ...bayangan (spread) menyalin semua isinya ke dalam style yang membutuhkan.
shadow... untuk iPhone, elevation untuk Android.
=================================================================*/
