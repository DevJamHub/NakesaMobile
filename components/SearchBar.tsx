/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Props Declaration
1.3: Default Function
    2.1: Main Render
        3.1: Ikon Cari
        3.2: Kolom Ketik
========================================================= */

// 1.1: Import Section
import { warna } from "@/constants";
import { berandaStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

// 1.2: Props Declaration
type Props = {
    value: string;
    onChangeText: (teks: string) => void;
}; // [1]

// 1.3: Default Function
export default function SearchBar({ value, onChangeText }: Props) {

    // 2.1: Main Render
    return (
    <View style={berandaStyles.kolomCari}>
        {/* 3.1: Ikon Cari */}
        <Ionicons name="search" size={20} color={warna.primary} />

        {/* 3.2: Kolom Ketik */}
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Cari dokter, bidan, praktik, layanan…"
            placeholderTextColor={warna.textFaint}
            returnKeyType="search"
            autoCorrect={false}
            style={berandaStyles.inputCari}
        />{/*[2]*/}
    </View>
    );
}

/* ======================== EXPLANATION ========================
[1]: Component ini tidak menyimpan ketikan sendiri. Isi kolom (value) dan function untuk mengubahnya
(onChangeText) dikirim dari halaman Beranda, yang menyimpannya di state kataKunci.
onChangeText bertipe (teks: string) => void: function yang menerima teks baru dan tidak mengembalikan nilai.
[2]: TextInput adalah komponen bawaan React Native untuk mengetik teks.
- value: teks yang tampil di kolom, diambil dari state kataKunci di Beranda.
- onChangeText: dipanggil setiap kali huruf diketik atau dihapus, dengan teks terbaru sebagai parameter.
  Beranda mengisinya dengan setKataKunci, jadi state ikut berubah dan layar di-render ulang.
- placeholder: teks abu-abu yang tampil saat kolom masih kosong.
=================================================================*/
