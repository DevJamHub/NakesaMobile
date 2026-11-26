/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Default Function
    2.1: Variable
    2.2: Main Render
        3.1: Judul "Profil"
        3.2: Info Akun
        3.3: Tombol Keluar
========================================================= */
// Kerangka Profil untuk tombol Keluar (Modul 4). Isi Profil lengkap dari tugas Modul 1-2
// (avatar, info profil, Ubah profil, Ubah kata sandi, sidik jari, privasi) menyusul.

// 1.1: Import Section
import { Tombol } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { konfirmasiKeluar } from "@/functions";
import { akunStyles } from "@/styles";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1.2: Default Function
export default function HalamanProfil() {

    // 2.1: Variable
    const { user, keluar } = useAuth(); // [1]
    const nama = user?.user_metadata?.full_name ?? "Belum diisi"; // [2]

    // 2.2: Main Render
    return (
    <SafeAreaView style={akunStyles.layar} edges={["top"]}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}>

            {/* 3.1: Judul "Profil" */}
            <Text style={akunStyles.judul}>Profil</Text>

            {/* 3.2: Info Akun */}
            <View style={akunStyles.card}>
                <Text style={akunStyles.namaProfil}>{nama}</Text>
                <Text style={akunStyles.keterangan}>{user?.email}</Text>
            </View>

            {/* 3.3: Tombol Keluar */}
            <Tombol judul="Keluar" jenis="bahaya" ikon="log-out-outline" onPress={() => konfirmasiKeluar(keluar)} />{/*[3]*/}

        </ScrollView>
    </SafeAreaView>
    );
}

/* ======================== EXPLANATION ========================
[1]: useAuth() mengambil user (data akun yang sedang masuk) dan function keluar dari AuthContext.
[2]: Nama diambil dari user_metadata.full_name, yang dikirim saat daftar (app/(auth)/daftar.tsx).
?. mencegah error kalau user atau metadata kosong, dan ?? memberi teks pengganti "Belum diisi".
[3]: Tombol bahaya dengan ikon log-out-outline (STANDAR bagian 7). Saat ditekan, konfirmasiKeluar
menampilkan pop-up. Function keluar DIKIRIM (bukan dipanggil) sebagai callback, dan baru dijalankan
kalau pengguna menekan "Ya, keluar". Setelah keluar, route guard membawa ke halaman Masuk.
=================================================================*/
