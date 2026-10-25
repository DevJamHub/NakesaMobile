/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Props Declaration
1.3: Default Function
    2.1: Main Render
        3.1: Label
========================================================= */

// 1.1: Import Section
import { chipStyles } from "@/styles";
import { Pressable, Text } from "react-native";

// 1.2: Props Declaration
type Props = { label: string; terpilih: boolean; onPress: () => void }; // [1]

// 1.3: Default Function
export default function Chip({ label, terpilih, onPress }: Props) {

    // 2.1: Main Render
    return (
    <Pressable
        style={[chipStyles.chip, terpilih ? chipStyles.chipTerpilih : null]}
        onPress={onPress}
    >{/*[2]*/}

        {/* 3.1: Label */}
        <Text style={[chipStyles.label, terpilih ? chipStyles.labelTerpilih : null]}>{label}</Text>{/*[3]*/}
    </Pressable>
    );
}

/* ======================== EXPLANATION ========================
[1]: Component ini menerima 3 props:
- label: teks di dalam chip, contoh "Riwayat".
- terpilih: true kalau chip ini sedang dipilih, false kalau tidak.
- onPress: function yang dijalankan saat chip ditekan. () => void artinya function tanpa parameter
  yang tidak mengembalikan apa-apa.
Contoh pemakaian: <Chip label="Riwayat" terpilih={pilihan === "riwayat"} onPress={() => setPilihan("riwayat")} />
Chip sendiri tidak menyimpan state. Yang menyimpan pilihan adalah halaman yang memakainya.
[2]: Pressable membuat chip bisa ditekan, lalu memanggil onPress dari props.
style diberi array: style chip selalu dipakai, lalu ternary menambahkan chipTerpilih kalau terpilih bernilai
true, atau null (tidak menambah apa-apa) kalau false. Style yang ditulis belakangan menimpa yang di depan.
[3]: Polanya sama untuk teks: label selalu dipakai, labelTerpilih (teks putih) ditambahkan hanya kalau terpilih.
=================================================================*/
