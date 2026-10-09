/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Default Function
    2.1: Main Render
        3.1: Pengaturan Tab Bawah
        3.2: Tab Beranda
========================================================= */

// 1.1: Import Section
import { warna } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router/js-tabs";

// 1.2: Default Function
export default function RootLayout() {

    // 2.1: Main Render
    return (
    <Tabs
        // 3.1: Pengaturan Tab Bawah
        screenOptions={{
            headerShown: false, // [1]
            tabBarActiveTintColor: warna.primary,
            tabBarInactiveTintColor: warna.textFaint,
            tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
            tabBarStyle: { backgroundColor: warna.surface, borderTopColor: warna.border },
            sceneStyle: { backgroundColor: warna.background },
        }}
    >
        {/* 3.2: Tab Beranda */}
        <Tabs.Screen
            name="index" // [2]
            options={{
                title: "Beranda",
                tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
                ), // [3]
            }}
        />
    </Tabs>
    );
}

/* ======================== EXPLANATION ========================
[1]: Header bawaan disembunyikan karena setiap halaman menulis judulnya sendiri, sama seperti app lama.
[2]: name harus sama dengan nama file di folder app/: "index" untuk app/index.tsx.
Tab Janji Temu dan Profil ditambahkan dengan bentuk yang sama oleh pemilik halamannya
(lihat STANDAR.md bagian 4 untuk judul dan ikonnya).
[3]: tabBarIcon menerima function (callback) yang dipanggil oleh Tabs. Tabs mengirim color, size,
dan focused (true kalau tab sedang dibuka). Dengan ternary, ikon penuh dipakai saat tab aktif
dan ikon outline saat tidak aktif.
=================================================================*/
