import { warna } from "@/constants";
import { StyleSheet } from "react-native";

export const chipStyles = StyleSheet.create({
    chip: {
        minHeight: 40,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: warna.border,
        backgroundColor: warna.surface,
        alignItems: "center",
        justifyContent: "center", // [1]
    },

    chipTerpilih: {
        backgroundColor: warna.primary,
        borderColor: warna.primary,
    }, // [2]

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: warna.text,
    },

    labelTerpilih: {
        color: warna.white,
    },
});

/* ======================== EXPLANATION ========================
[1]: Bentuk chip sesuai STANDAR.md bagian 5: tinggi minimal 40, sudut bulat penuh (borderRadius 999),
garis tepi 1.5 berwarna border, dan latar putih. alignItems dan justifyContent menaruh teks tepat di tengah.
[2]: Style tambahan untuk chip yang sedang dipilih: latar dan garis tepi menjadi warna primary.
Style ini ditumpuk di atas style chip (lihat components/Chip.tsx), jadi hanya warnanya yang diganti.
labelTerpilih juga ditumpuk di atas label supaya teksnya menjadi putih.
=================================================================*/
