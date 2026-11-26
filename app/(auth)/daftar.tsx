/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Function Cek Kata Sandi
1.3: Default Function
    2.1: State
    2.2: Function Daftar
    2.3: Function Kembali ke Masuk
    2.4: Main Render
        3.1: Judul
        3.2: Kolom Isian
        3.3: Pesan Salah
        3.4: Tombol Daftar
        3.5: Pindah ke Masuk
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

// 1.2: Function Cek Kata Sandi
function cekKataSandi(kataSandi: string, ulangi: string): string {
    if (kataSandi.length < 8) return "Kata sandi minimal 8 karakter.";
    if (kataSandi !== ulangi) return "Kata sandi baru tidak sama.";
    return "";
} // [1]

// 1.3: Default Function
export default function HalamanDaftar() {

    // 2.1: State
    const [namaLengkap, setNamaLengkap] = useState("");
    const [email, setEmail] = useState("");
    const [nomorHp, setNomorHp] = useState("");
    const [kataSandi, setKataSandi] = useState("");
    const [ulangiKataSandi, setUlangiKataSandi] = useState("");
    const [memuat, setMemuat] = useState(false);
    const [pesanSalah, setPesanSalah] = useState("");

    // 2.2: Function Daftar
    async function daftar() {
        const emailBersih = email.trim();
        const namaBersih = namaLengkap.trim();

        if (!namaBersih || !emailBersih || !kataSandi) {
            tampilkanPesan("Lengkapi semua kolom dengan benar.");
            return;
        }

        const salah = cekKataSandi(kataSandi, ulangiKataSandi);
        setPesanSalah(salah);
        if (salah) return; // [2]

        setMemuat(true);
        const { data, error } = await supabase.auth.signUp({
            email: emailBersih,
            password: kataSandi,
            options: {
                data: {
                    app: "nakesa_patient",
                    full_name: namaBersih,
                    phone: nomorHp.trim(),
                },
            },
        }); // [3]
        setMemuat(false);

        if (error) {
            tampilkanPesan("Gagal mendaftar", error.message);
            return;
        }

        if (!data.session) {
            tampilkanPesan("Akun berhasil dibuat", "Cek email Anda untuk konfirmasi, lalu masuk.");
            router.replace("/masuk");
        } // [4]
    }

    // 2.3: Function Kembali ke Masuk
    function kembaliKeMasuk() {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/masuk");
        }
    } // [5]

    // 2.4: Main Render
    return (
    <SafeAreaView style={akunStyles.layar}>
        <ScrollView contentContainerStyle={akunStyles.isi} keyboardShouldPersistTaps="handled">

            {/* 3.1: Judul */}
            <View style={{ gap: 4 }}>
                <Text style={akunStyles.judul}>Buat akun Anda</Text>
                <Text style={akunStyles.keterangan}>Gratis, dan siap dipakai dalam beberapa menit.</Text>
            </View>

            <View style={akunStyles.card}>
                {/* 3.2: Kolom Isian */}
                <Text style={akunStyles.label}>Nama lengkap</Text>
                <TextInput style={akunStyles.kolom} value={namaLengkap} onChangeText={setNamaLengkap} placeholder="Nama lengkap" placeholderTextColor={warna.textFaint} />

                <Text style={akunStyles.label}>Email</Text>
                <TextInput style={akunStyles.kolom} value={email} onChangeText={setEmail} placeholder="nama@email.com" placeholderTextColor={warna.textFaint} autoCapitalize="none" keyboardType="email-address" />

                <Text style={akunStyles.label}>Nomor HP</Text>
                <TextInput style={akunStyles.kolom} value={nomorHp} onChangeText={setNomorHp} placeholder="08xxxxxxxxxx" placeholderTextColor={warna.textFaint} keyboardType="phone-pad" />

                <Text style={akunStyles.label}>Kata sandi</Text>
                <TextInput style={akunStyles.kolom} value={kataSandi} onChangeText={setKataSandi} placeholder="Minimal 8 karakter" placeholderTextColor={warna.textFaint} secureTextEntry autoCapitalize="none" />

                <Text style={akunStyles.label}>Ulangi kata sandi</Text>
                <TextInput style={akunStyles.kolom} value={ulangiKataSandi} onChangeText={setUlangiKataSandi} placeholder="Ulangi kata sandi" placeholderTextColor={warna.textFaint} secureTextEntry autoCapitalize="none" />

                {/* 3.3: Pesan Salah */}
                {pesanSalah ? (
                    <Text style={{ fontSize: 14, lineHeight: 20, color: warna.danger }}>{pesanSalah}</Text>
                ) : null}{/*[6]*/}

                {/* 3.4: Tombol Daftar */}
                {memuat ? (
                    <View style={akunStyles.memuat}>
                        <ActivityIndicator color={warna.primary} />
                    </View>
                ) : (
                    <Tombol judul="Daftar" onPress={daftar} />
                )}
            </View>

            {/* 3.5: Pindah ke Masuk */}
            <Tombol judul="Sudah punya akun? Masuk" jenis="polos" onPress={kembaliKeMasuk} />

            <Text style={akunStyles.catatan}>Data Anda terlindungi dan hanya bisa diakses oleh Anda.</Text>

        </ScrollView>
    </SafeAreaView>
    );
}

/* ======================== EXPLANATION ========================
[1]: Custom function validasi kata sandi, polanya sama dengan Ubah Kata Sandi di Modul 2. Hasilnya teks
pesan salah, atau teks kosong "" kalau semuanya benar. Setiap if langsung return, jadi pengecekan
berhenti di kesalahan pertama.
[2]: Pesan salah disimpan di state supaya tampil di bawah kolom. Teks kosong dianggap false, jadi
if (salah) hanya berhenti kalau memang ada kesalahan.
[3]: signUp() membuat akun baru di Supabase Auth. options.data adalah user metadata, data tambahan yang
ikut disimpan bersama akun (bisa dibaca lagi lewat user.user_metadata). Di project NAKESA, trigger
database handle_new_user membaca app: "nakesa_patient" lalu memberi peran PATIENT dan membuat baris di
tabel patient_profiles. Karena itu kunci app WAJIB ditulis persis begitu. full_name dan phone juga dibaca
trigger itu.
[4]: Kalau "Confirm email" di Supabase MATI, signUp langsung memberi sesi, jadi data.session terisi dan
route guard langsung membawa ke Beranda (sama seperti Masuk). Kalau "Confirm email" NYALA, data.session
bernilai null: akun sudah dibuat tapi harus dikonfirmasi lewat email dulu, jadi kita beri tahu pengguna
lalu kembali ke halaman Masuk.
[5]: router.canGoBack() bernilai true kalau ada halaman di bawah tumpukan (halaman Masuk yang membuka
Daftar dengan push). Kalau ada, router.back(). Kalau tidak ada (misalnya Daftar dibuka langsung dari
alamat), router.replace("/masuk").
[6]: Pesan salah memakai inline style: ukuran small (14/20) dengan warna danger, sesuai STANDAR bagian 7.
Ternary dengan null artinya tidak menggambar apa pun kalau pesanSalah kosong.
=================================================================*/
