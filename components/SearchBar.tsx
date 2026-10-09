/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Default Function
    2.1: Main Render
        3.1: Ikon Cari
        3.2: Kolom Ketik
========================================================= */

// 1.1: Import Section
import { warna } from "@/constants";
import { berandaStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

// 1.2: Default Function
export default function SearchBar() {

    // 2.1: Main Render
    return (
    <View style={berandaStyles.kolomCari}>
        {/* 3.1: Ikon Cari */}
        <Ionicons name="search" size={20} color={warna.primary} />

        {/* 3.2: Kolom Ketik */}
        <TextInput
            placeholder="Cari dokter, bidan, praktik, layanan…"
            placeholderTextColor={warna.textFaint}
            returnKeyType="search"
            autoCorrect={false}
            style={berandaStyles.inputCari}
        />{/*[1]*/}
    </View>
    );
}

/* ======================== EXPLANATION ========================
[1]: TextInput adalah komponen bawaan React Native untuk mengetik teks.
placeholder adalah teks abu-abu yang tampil saat kolom masih kosong.
Di Modul 1 kolom ini baru tampilan: hasil ketikan belum dipakai untuk menyaring,
karena untuk mengingat isi ketikan dibutuhkan useState yang baru dipelajari di Modul 2.
=================================================================*/
