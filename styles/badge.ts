import { StyleSheet } from "react-native";

export const badgeStyles = StyleSheet.create({
    badge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start", // [1]
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },

    titik: {
        width: 7,
        height: 7,
        borderRadius: 999, // [2]
    },

    label: {
        fontSize: 13,
        fontWeight: "600",
    },
});

/* ======================== EXPLANATION ========================
[1]: alignSelf: "flex-start" membuat badge selebar isinya saja. Tanpa ini badge akan melebar
memenuhi lebar card.
[2]: borderRadius yang lebih besar dari setengah ukuran kotak membuat kotak menjadi bulat.
Warna titik dan latar badge tidak ditulis di sini karena berubah sesuai tone, jadi diberikan
lewat inline style di components/Badge.tsx.
=================================================================*/
