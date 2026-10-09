/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Props Declaration
1.3: Default Function
    2.1: Main Render
        3.1: Emoji Profesi
        3.2: Nama Profesi
========================================================= */

// 1.1: Import Section
import { berandaStyles } from "@/styles";
import type { Profesi } from "@/types";
import { Pressable, Text } from "react-native";

// 1.2: Props Declaration
type Props = {
    profesi: Profesi;
    onPress: () => void;
}; // [1]

// 1.3: Default Function
export default function KategoriCard({ profesi, onPress }: Props) {

    // 2.1: Main Render
    return (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [berandaStyles.kartuKategori, pressed && berandaStyles.kartuKategoriDitekan]}
    >{/*[2]*/}
        {/* 3.1: Emoji Profesi */}
        <Text style={[berandaStyles.emojiKategori, { backgroundColor: `${profesi.warna}1A` }]}>
            {profesi.emoji}
        </Text>{/*[3]*/}

        {/* 3.2: Nama Profesi */}
        <Text style={berandaStyles.labelKategori} numberOfLines={2}>
            {profesi.namaProfesi}
        </Text>
    </Pressable>
    );
}

/* ======================== EXPLANATION ========================
[1]: Component ini menerima 2 props: data profesi yang ditampilkan, dan onPress, yaitu function
yang dijalankan saat kartu ditekan. Tipe () => void artinya function tanpa parameter yang tidak
mengembalikan nilai.
[2]: style di Pressable bisa berupa function (callback). Pressable mengirim pressed (true saat sedang
ditekan). Kalau pressed bernilai true, style kartuKategoriDitekan ditambahkan, jadi latarnya
berubah hijau muda selama ditekan.
[3]: Gabungan external + inline styling. Warna latar lingkaran berbeda untuk tiap profesi, jadi ditulis
inline. Tambahan "1A" di belakang kode warna membuatnya transparan sekitar 10%.
=================================================================*/
