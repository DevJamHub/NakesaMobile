import type { Ionicons } from "@expo/vector-icons";

export type NamaIkon = keyof typeof Ionicons.glyphMap; // [1]

/* ======================== EXPLANATION ========================
[1]: Ionicons.glyphMap adalah daftar semua ikon Ionicons. keyof typeof mengambil semua nama di daftar itu,
jadi NamaIkon hanya menerima nama ikon yang benar-benar ada, misalnya "home-outline".
Kalau salah ketik nama ikon, TypeScript langsung memberi error.
=================================================================*/
