/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Props Declaration
1.3: Default Function
    2.1: Main Render
        3.1: Ikon dalam Lingkaran
        3.2: Judul & Pesan
========================================================= */

// 1.1: Import Section
import { warna } from "@/constants";
import { emptyStateStyles } from "@/styles";
import type { NamaIkon } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

// 1.2: Props Declaration
type Props = { judul: string; pesan?: string; ikon?: NamaIkon }; // [1]

// 1.3: Default Function
export default function EmptyState({ judul, pesan, ikon = "leaf-outline" }: Props) { // [2]

    // 2.1: Main Render
    return (
    <View style={emptyStateStyles.wadah}>

        {/* 3.1: Ikon dalam Lingkaran */}
        <View style={emptyStateStyles.lingkaran}>
            <Ionicons name={ikon} size={30} color={warna.primary} />
        </View>

        {/* 3.2: Judul & Pesan */}
        <Text style={emptyStateStyles.judul}>{judul}</Text>
        {pesan ? <Text style={emptyStateStyles.pesan}>{pesan}</Text> : null}{/*[3]*/}
    </View>
    );
}

/* ======================== EXPLANATION ========================
[1]: NamaIkon adalah daftar semua nama ikon Ionicons yang valid, jadi kalau nama ikonnya salah ketik,
TypeScript langsung memberi error sebelum app dijalankan.
[2]: ikon = "leaf-outline" adalah nilai bawaan (default). Kalau props ikon tidak dikirim, yang dipakai
ikon daun "leaf-outline".
[3]: Ternary operator. Teks pesan hanya ditampilkan kalau props pesan diisi.
Contoh pemakaian: <EmptyState judul="Belum ada janji temu" />
=================================================================*/
