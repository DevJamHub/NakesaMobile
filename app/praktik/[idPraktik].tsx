/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Default Function
    2.1: Ambil Id dari Alamat
    2.2: Function Kembali
    2.3: Praktik Tidak Ditemukan
    2.4: Main Render
        3.1: Card Praktik
        3.2: Tombol Kembali
========================================================= */

// Halaman milik Sigit. Isinya mengikuti TUGAS.md dan STANDAR.md.

// 1.1: Import Section
import { EmptyState, PraktikCard, Tombol } from "@/components";
import { getPraktik } from "@/functions";
import { berandaStyles } from "@/styles";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

// 1.2: Default Function
export default function DetailPraktik() {

    // 2.1: Ambil Id dari Alamat
    const { idPraktik } = useLocalSearchParams<{ idPraktik: string }>(); // [1]
    const praktik = getPraktik(Number(idPraktik));

    // 2.2: Function Kembali
    const kembali = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/");
        }
    }; // [2]

    // 2.3: Praktik Tidak Ditemukan
    if (praktik === undefined) {
        return (
        <View style={berandaStyles.isiDetail}>
            <EmptyState judul="Praktik tidak ditemukan" />
            <Tombol judul="Kembali" jenis="kedua" onPress={kembali} />
        </View>
        );
    } // [3]

    // 2.4: Main Render
    return (
    <View style={berandaStyles.isiDetail}>

        {/* 3.1: Card Praktik */}
        <PraktikCard praktik={praktik} />

        {/* 3.2: Tombol Kembali */}
        <Tombol judul="Kembali" jenis="kedua" onPress={kembali} />

    </View>
    );
}

/* ======================== EXPLANATION ========================
[1]: Alamat /praktik/3 membuka file ini, dan useLocalSearchParams() mengambil idPraktik dari alamat itu
("3"). Isinya selalu string, jadi diubah dulu ke angka dengan Number() sebelum dicari dengan getPraktik().
[2]: router.canGoBack() mengecek apakah ada halaman sebelumnya (true / false). Kalau ada, router.back()
kembali ke Beranda. Kalau tidak ada (halaman dibuka langsung lewat alamat atau di-refresh di browser),
router.replace("/") mengganti halaman ini dengan Beranda.
[3]: Kalau id di alamat salah (misalnya /praktik/99), praktik bernilai undefined, jadi yang tampil
tulisan "Praktik tidak ditemukan" dan tombol Kembali. App tidak error.
=================================================================*/
