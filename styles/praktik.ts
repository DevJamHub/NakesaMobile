import { Platform, StyleSheet } from "react-native";

export const praktikStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F7F6",
    },

    content: {
        padding: 20,
        paddingTop: Platform.OS === "android" ? 60 : 20, // [1]
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0F766E",
    },

    subtitle: {
        fontSize: 16,
        color: "#5B6C69",
        marginTop: 4,
        marginBottom: 20,
    },

    card: {
        backgroundColor: "white",
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },

    profesi: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0F766E",
        marginTop: 2,
        marginBottom: 12,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },

    text: {
        fontSize: 16,
        color: "#10201D",
    },

    badge: {
        alignSelf: "flex-start",
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginTop: 6,
    },

    button: {
        backgroundColor: "#0F766E",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 14,
    },

    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

/* ======================== EXPLANATION ========================
[1]: Ternary operator. Di iPhone, Expo Router sudah memberi jarak aman di bawah notch, jadi cukup 20.
Di Android tidak, jadi kita beri 60 supaya judul tidak tertutup status bar.
=================================================================*/
