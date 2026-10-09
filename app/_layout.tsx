/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Default Function
    2.1: Main Render
        3.1: Kolom Aplikasi
        3.2: Pengaturan Tab Bawah
        3.3: Tab Beranda
========================================================= */

// 1.1: Import Section
import { warna } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router/js-tabs";
import { View } from "react-native";

// 1.2: Default Function
export default function RootLayout() {

    // 2.1: Main Render
    return (
    // 3.1: Kolom Aplikasi
    <View style={{ flex: 1, alignItems: "center", backgroundColor: warna.background }}>
        <View style={{ flex: 1, width: "100%", maxWidth: 600 }}>{/*[1]*/}
            <Tabs
                // 3.2: Pengaturan Tab Bawah
                screenOptions={{
                    headerShown: false, // [2]
                    tabBarActiveTintColor: warna.primary,
                    tabBarInactiveTintColor: warna.textFaint,
                    tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
                    tabBarStyle: { backgroundColor: warna.surface, borderTopColor: warna.border },
                    sceneStyle: { backgroundColor: warna.background },
                }}
            >
                {/* 3.3: Tab Beranda */}
                <Tabs.Screen
                    name="index" // [3]
                    options={{
                        title: "Beranda",
                        tabBarIcon: ({ color, size, focused }) => (
                            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
                        ), // [4]
                    }}
                />
            </Tabs>
        </View>
    </View>
    );
}

/* ======================== EXPLANATION ========================
[1]: Seluruh aplikasi dibungkus kolom dengan lebar maksimal 600. Di HP layarnya lebih kecil dari 600,
jadi tidak ada yang berubah. Di browser laptop, aplikasi tampil seperti layar HP di tengah,
tidak melebar sampai ujung. Ini berlaku untuk semua halaman.
[2]: Header bawaan disembunyikan karena setiap halaman menulis judulnya sendiri, sama seperti app lama.
[3]: name harus sama dengan nama file di folder app/: "index" untuk app/index.tsx.
Tab Janji Temu dan Profil ditambahkan dengan bentuk yang sama oleh pemilik halamannya
(lihat STANDAR.md bagian 4 untuk judul dan ikonnya).
[4]: tabBarIcon menerima function (callback) yang dipanggil oleh Tabs. Tabs mengirim color, size,
dan focused (true kalau tab sedang dibuka). Dengan ternary, ikon penuh dipakai saat tab aktif
dan ikon outline saat tidak aktif.
=================================================================*/
