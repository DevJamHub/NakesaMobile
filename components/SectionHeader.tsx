/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Props Declaration
1.3: Default Function
    2.1: Main Render
        3.1: Judul Section
        3.2: Aksi (kalau ada)
========================================================= */

// 1.1: Import Section
import { sectionHeaderStyles } from "@/styles";
import { Pressable, Text, View } from "react-native";

// 1.2: Props Declaration
type Props = { judul: string; aksi?: string; onAksi?: () => void }; // [1]

// 1.3: Default Function
export default function SectionHeader({ judul, aksi, onAksi }: Props) {

    // 2.1: Main Render
    return (
    <View style={sectionHeaderStyles.baris}>

        {/* 3.1: Judul Section */}
        <Text style={sectionHeaderStyles.judul}>{judul}</Text>

        {/* 3.2: Aksi (kalau ada) */}
        {aksi ? (
            <Pressable onPress={onAksi}>
                <Text style={sectionHeaderStyles.aksi}>{aksi}</Text>
            </Pressable>
        ) : null}{/*[2]*/}
    </View>
    );
}

/* ======================== EXPLANATION ========================
[1]: judul wajib diisi. aksi dan onAksi boleh tidak diisi (tanda ?). onAksi bertipe () => void,
artinya isinya function tanpa parameter yang tidak mengembalikan nilai.
Contoh pemakaian: <SectionHeader judul="Janji temu berikutnya" aksi="Lihat semua" onAksi={...} />
[2]: Ternary operator. Teks aksi di kanan hanya ditampilkan kalau props aksi diisi. Kalau tidak,
yang tampil hanya judulnya.
=================================================================*/
