/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Default Function
    2.1: State
    2.2: Function Masuk
    2.3: Main Render
        3.1: Judul
        3.2: Kolom Email
        3.3: Kolom Kata Sandi
        3.4: Tombol Masuk
        3.5: Pindah ke Daftar
========================================================= */

// 1.1: Import Section
import { Tombol } from "@/components";
import { warna } from "@/constants";
import { tampilkanPesan } from "@/functions";
import { supabase } from "@/lib/supabase";
import { akunStyles } from "@/styles";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1.2: Default Function
export default function HalamanMasuk() {

    // 2.1: State
    const [email, setEmail] = useState("");
    const [kataSandi, setKataSandi] = useState("");
    const [memuat, setMemuat] = useState(false); // [1]

    // 2.2: Function Masuk
    async function masuk() {
        const emailBersih = email.trim(); // [2]

        if (!emailBersih || !kataSandi) {
            tampilkanPesan("Lengkapi semua kolom dengan benar.");
            return;
        } // [3]

        setMemuat(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: emailBersih,
            password: kataSandi,
        }); // [4]
        setMemuat(false);

        if (error) {
            tampilkanPesan("Gagal masuk", error.message); // [5]
        }
    } // [6]

    // 2.3: Main Render
    return (
    <SafeAreaView style={akunStyles.layar}>
        <ScrollView contentContainerStyle={akunStyles.isi} keyboardShouldPersistTaps="handled">{/*[7]*/}

            {/* 3.1: Judul */}
            <View style={{ gap: 4 }}>
                <Text style={akunStyles.judul}>Selamat datang kembali</Text>
                <Text style={akunStyles.keterangan}>Masuk untuk melanjutkan ke NAKESA.</Text>
            </View>

            <View style={akunStyles.card}>
                {/* 3.2: Kolom Email */}
                <Text style={akunStyles.label}>Email</Text>
                <TextInput
                    style={akunStyles.kolom}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="nama@email.com"
                    placeholderTextColor={warna.textFaint}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                />{/*[8]*/}

                {/* 3.3: Kolom Kata Sandi */}
                <Text style={akunStyles.label}>Kata sandi</Text>
                <TextInput
                    style={akunStyles.kolom}
                    value={kataSandi}
                    onChangeText={setKataSandi}
                    placeholder="Kata sandi"
                    placeholderTextColor={warna.textFaint}
                    secureTextEntry
                    autoCapitalize="none"
                />{/*[9]*/}

                {/* 3.4: Tombol Masuk */}
                {memuat ? (
                    <View style={akunStyles.memuat}>
                        <ActivityIndicator color={warna.primary} />
                    </View>
                ) : (
                    <Tombol judul="Masuk" onPress={masuk} />
                )}{/*[10]*/}
            </View>

            {/* 3.5: Pindah ke Daftar */}
            <Tombol judul="Belum punya akun? Daftar" jenis="polos" onPress={() => router.push("/daftar")} />{/*[11]*/}

            <Text style={akunStyles.catatan}>Data Anda terlindungi dan hanya bisa diakses oleh Anda.</Text>

        </ScrollView>
    </SafeAreaView>
    );
}

/* ======================== EXPLANATION ========================
[1]: Tiga state. email dan kataSandi menyimpan isi kolom (nilai awal teks kosong). memuat bernilai true
selama app menunggu jawaban Supabase, dipakai untuk menampilkan spinner (loading state).
[2]: trim() membuang spasi di awal dan akhir. Pengguna sering tidak sengaja menambah spasi saat mengetik
atau menempel email, dan Supabase akan menganggap email itu salah.
[3]: Validasi sebelum mengirim. !emailBersih bernilai true kalau teksnya kosong. Kalau ada kolom kosong,
tampilkan pop-up lalu return (berhenti), jadi permintaan ke Supabase tidak dikirim sama sekali.
Pop-up memakai tampilkanPesan (functions/pesan.ts) supaya muncul juga di web.
[4]: signInWithPassword() mengirim email dan kata sandi ke Supabase Auth. await artinya menunggu sampai
Supabase menjawab, karena itu function masuk ditulis async. Hasilnya object berisi data dan error;
di sini kita hanya mengambil error dengan destructuring { error }.
[5]: Kalau error berisi sesuatu (misalnya "Invalid login credentials" karena kata sandi salah), pesan dari
Supabase ditampilkan dan app tidak crash. Pengguna tetap di halaman Masuk dan bisa mencoba lagi.
[6]: Kalau BERHASIL, kita tidak memanggil router sama sekali. Supabase menyimpan sesi ke SecureStore,
onAuthStateChange di AuthContext menerima SIGNED_IN dan mengisi session, lalu route guard di
app/_layout.tsx melihat "sudah masuk tapi masih di halaman tamu" dan memanggil router.replace("/").
[7]: keyboardShouldPersistTaps="handled" membuat tombol tetap bisa ditekan sekali saat keyboard masih
terbuka. Tanpa ini, ketukan pertama hanya menutup keyboard.
[8]: TextInput adalah kolom isian. value={email} dan onChangeText={setEmail} membuat controlled input:
isi kolom selalu sama dengan state. Setiap huruf diketik, setEmail dipanggil dengan teks terbaru.
autoCapitalize="none" mencegah huruf pertama menjadi kapital, dan keyboardType="email-address" memunculkan
keyboard yang punya tombol @.
[9]: secureTextEntry menyembunyikan kata sandi menjadi titik-titik.
[10]: Ternary. Selama memuat, tombol diganti spinner, jadi tombol Masuk tidak bisa ditekan dua kali
(mencegah permintaan ganda). Setelah Supabase menjawab, setMemuat(false) mengembalikan tombolnya.
[11]: router.push("/daftar") membuka halaman Daftar (app/(auth)/daftar.tsx) di atas halaman
Masuk, jadi dari Daftar bisa kembali dengan router.back().
=================================================================*/
