/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Function PenjagaHalaman (route guard)
    2.1: Variable
    2.2: Effect Penjaga
    2.3: Layar Memuat
    2.4: Main Render
        3.1: Kolom Aplikasi
        3.2: Pengaturan Header Stack
        3.3: Halaman Tab
        3.4: Halaman di Luar Tab
        3.5: Halaman Masuk dan Daftar
1.3: Default Function
========================================================= */

// 1.1: Import Section
import { warna } from "@/constants";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { router, Stack, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

// 1.2: Function PenjagaHalaman (route guard)
function PenjagaHalaman() {

    // 2.1: Variable
    const { session, isLoading } = useAuth(); // [1]
    const segments = useSegments(); // [2]

    // 2.2: Effect Penjaga
    useEffect(() => {
        if (isLoading) return;

        const diHalamanTamu = segments[0] === "(auth)";

        if (!session && !diHalamanTamu) {
            router.replace("/masuk");
        } else if (session && diHalamanTamu) {
            router.replace("/");
        }
    }, [session, isLoading, segments]); // [3]

    // 2.3: Layar Memuat
    if (isLoading) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: warna.background }}>
            <ActivityIndicator size="large" color={warna.primary} />
        </View>
        ); // [4]
    }

    // 2.4: Main Render
    return (
    // 3.1: Kolom Aplikasi
    <View style={{ flex: 1, alignItems: "center", backgroundColor: warna.background }}>
        <View style={{ flex: 1, width: "100%", maxWidth: 600 }}>{/*[5]*/}
            <Stack
                // 3.2: Pengaturan Header Stack
                screenOptions={{
                    headerStyle: { backgroundColor: warna.surface },
                    headerTintColor: warna.primary, // [6]
                    headerBackTitle: "Kembali",
                    headerTitleStyle: { color: warna.text, fontWeight: "600" },
                    contentStyle: { backgroundColor: warna.background },
                }}
            >{/*[7]*/}
                {/* 3.3: Halaman Tab */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />{/*[8]*/}

                {/* 3.4: Halaman di Luar Tab */}
                {/* 3.5: Halaman Masuk dan Daftar */}
                {/* ===== Sigit ===== */}
                <Stack.Screen name="praktik/[idPraktik]" options={{ title: "Detail Praktik" }} />

                {/* ===== Bayhaqy ===== */}
                <Stack.Screen name="janji/[idJanji]" options={{ title: "Detail Janji Temu" }} />
                <Stack.Screen name="(auth)/masuk" options={{ headerShown: false }} />{/*[9]*/}
                <Stack.Screen name="(auth)/daftar" options={{ headerShown: false }} />

                {/* ===== Aditya ===== */}
            </Stack>{/*[10]*/}
        </View>
    </View>
    );
}

// 1.3: Default Function
export default function RootLayout() {
    return (
    <AuthProvider>
        <PenjagaHalaman />
    </AuthProvider>
    ); // [11]
}

/* ======================== EXPLANATION ========================
[1]: useAuth() (dari context/AuthContext.tsx) memberi session (null kalau belum masuk) dan
isLoading (true selama sesi lama masih dibaca dari SecureStore).
[2]: useSegments() adalah hook expo-router yang memberi potongan alamat halaman yang sedang dibuka,
dalam bentuk array. Contoh: di halaman Masuk hasilnya ["(auth)", "masuk"], di Beranda ["(tabs)"].
Jadi segments[0] memberi tahu kita sedang berada di grup mana.
[3]: Inilah route guard (penjaga halaman). Effect jalan setiap kali session, isLoading, atau
segments berubah. Selama isLoading, tunggu dulu (return). Kalau BELUM masuk dan bukan di halaman tamu,
paksa ke "/masuk". Kalau SUDAH masuk tapi masih di halaman tamu (misalnya baru berhasil login), antar
ke "/" (Beranda). router.replace() dipakai, bukan push(), supaya halaman lama diganti dan tombol
kembali tidak bisa membuka halaman yang dilindungi lagi. Alamatnya "/masuk", bukan "/(auth)/masuk",
karena nama folder dalam kurung (route group) tidak masuk ke alamat.
[4]: Selama sesi belum selesai dibaca, tampilkan spinner (ActivityIndicator) di tengah layar, supaya
halaman Beranda tidak sempat terlihat sekejap sebelum dipindah ke Masuk.
[5]: Seluruh aplikasi dibungkus kolom dengan lebar maksimal 600. Di HP layarnya lebih kecil dari 600,
jadi tidak ada yang berubah. Di browser laptop, aplikasi tampil seperti layar HP di tengah,
tidak melebar sampai ujung. Ini berlaku untuk semua halaman.
[6]: headerTintColor adalah warna tombol panah kembali di header, dan headerBackTitle adalah teks di
sampingnya (muncul di iPhone). Semua pengaturan header diambil dari STANDAR.md bagian 4.
[7]: Stack adalah navigator yang menyusun halaman seperti tumpukan. router.push() menaruh halaman baru
di atas tumpukan, dan router.back() mengambilnya lagi sehingga halaman sebelumnya terlihat kembali.
screenOptions berlaku untuk semua halaman di dalam Stack ini.
[8]: "(tabs)" adalah folder app/(tabs)/ yang berisi Beranda, Janji Temu, dan Profil beserta tab bawahnya
(app/(tabs)/_layout.tsx). Folder dalam kurung adalah route group: namanya tidak masuk ke alamat, jadi
Beranda tetap "/" dan Janji Temu tetap "/janji-temu". Header Stack disembunyikan di sini karena halaman tab
sudah menulis judulnya sendiri.
[9]: Halaman Masuk ada di app/(auth)/masuk.tsx. (auth) adalah route group untuk halaman tamu (yang boleh
dibuka tanpa login). headerShown: false karena halaman Masuk dan Daftar tidak punya tombol kembali.
[10]: Halaman di luar tab (Detail Praktik, Detail Janji Temu, Ubah Kata Sandi) didaftarkan dengan
<Stack.Screen name="..." options={{ title: "..." }} /> di bagian nama pembuatnya. name sama dengan nama file
tanpa .tsx, misalnya "praktik/[idPraktik]". title adalah judul di header, lihat STANDAR.md bagian 4.
[11]: AuthProvider harus membungkus PenjagaHalaman. useAuth() hanya bisa dipakai DI DALAM AuthProvider,
jadi penjaga dipisah menjadi component sendiri. Kalau useAuth() dipanggil langsung di RootLayout, hasilnya
error "useAuth harus dipakai di dalam AuthProvider", karena RootLayout sendiri berada di luar Provider.
=================================================================*/
