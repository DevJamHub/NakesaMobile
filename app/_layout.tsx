/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Default Function
    2.1: Main Render
        3.1: Kolom Aplikasi
        3.2: Pengaturan Header Stack
        3.3: Halaman Tab
        3.4: Halaman di Luar Tab
========================================================= */

// 1.1: Import Section
import { warna } from "@/constants";
import { Stack } from "expo-router";
import { View } from "react-native";

// 1.2: Default Function
export default function RootLayout() {

    // 2.1: Main Render
    return (
    // 3.1: Kolom Aplikasi
    <View style={{ flex: 1, alignItems: "center", backgroundColor: warna.background }}>
        <View style={{ flex: 1, width: "100%", maxWidth: 600 }}>{/*[1]*/}
            <Stack
                // 3.2: Pengaturan Header Stack
                screenOptions={{
                    headerStyle: { backgroundColor: warna.surface },
                    headerTintColor: warna.primary, // [2]
                    headerBackTitle: "Kembali",
                    headerTitleStyle: { color: warna.text, fontWeight: "600" },
                    contentStyle: { backgroundColor: warna.background },
                }}
            >{/*[3]*/}
                {/* 3.3: Halaman Tab */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />{/*[4]*/}

                {/* 3.4: Halaman di Luar Tab */}
                {/* ===== Sigit ===== */}

                {/* ===== Bayhaqy ===== */}
                <Stack.Screen name="janji/[idJanji]" options={{ title: "Detail Janji Temu" }} />
                {/* ===== Aditya ===== */}
            </Stack>{/*[5]*/}
        </View>
    </View>
    );
}

/* ======================== EXPLANATION ========================
[1]: Seluruh aplikasi dibungkus kolom dengan lebar maksimal 600. Di HP layarnya lebih kecil dari 600,
jadi tidak ada yang berubah. Di browser laptop, aplikasi tampil seperti layar HP di tengah,
tidak melebar sampai ujung. Ini berlaku untuk semua halaman.
[2]: headerTintColor adalah warna tombol panah kembali di header, dan headerBackTitle adalah teks di
sampingnya (muncul di iPhone). Semua pengaturan header diambil dari STANDAR.md bagian 4.
[3]: Stack adalah navigator yang menyusun halaman seperti tumpukan. router.push() menaruh halaman baru
di atas tumpukan, dan router.back() mengambilnya lagi sehingga halaman sebelumnya terlihat kembali.
screenOptions berlaku untuk semua halaman di dalam Stack ini.
[4]: "(tabs)" adalah folder app/(tabs)/ yang berisi Beranda, Janji Temu, dan Profil beserta tab bawahnya
(app/(tabs)/_layout.tsx). Folder dalam kurung adalah route group: namanya tidak masuk ke alamat, jadi
Beranda tetap "/" dan Janji Temu tetap "/janji-temu". Header Stack disembunyikan di sini karena halaman tab
sudah menulis judulnya sendiri.
[5]: Halaman di luar tab (Detail Praktik, Detail Janji Temu, Ubah Kata Sandi) didaftarkan dengan
<Stack.Screen name="..." options={{ title: "..." }} /> di bagian nama pembuatnya. name sama dengan nama file
tanpa .tsx, misalnya "praktik/[idPraktik]". title adalah judul di header, lihat STANDAR.md bagian 4.
=================================================================*/
