/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Default Function
    2.1: Main Render
        3.1: Pengaturan Tab Bawah
        3.2: Tab Beranda
        3.3: Tab Janji Temu
========================================================= */

// 1.1: Import Section
import { warna } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router/js-tabs";

// 1.2: Default Function
export default function TabsLayout() {

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
        {/* ===== Sigit ===== */}
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

        {/* ===== Bayhaqy ===== */}
        {/* 3.3: Tab Janji Temu */}
        <Tabs.Screen
            name="janji-temu"
            options={{
                title: "Janji Temu",
                tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons name={focused ? "calendar" : "calendar-outline"} size={size} color={color} />
                ),
            }}
        />

        {/* ===== Aditya ===== */}
    </Tabs>
    );
}

/* ======================== EXPLANATION ========================
[1]: Header bawaan Tabs disembunyikan karena setiap halaman tab menulis judulnya sendiri, sama seperti
app lama.
[2]: name harus sama dengan nama file di folder app/(tabs)/: "index" untuk app/(tabs)/index.tsx dan
"janji-temu" untuk app/(tabs)/janji-temu.tsx. Setiap halaman tab baru wajib didaftarkan di sini, di bagian
nama pembuatnya. Kalau tidak, tab-nya tetap muncul tapi dengan nama file dan ikon segitiga. Tab Profil
ditambahkan di bagian Aditya dengan bentuk yang sama (judul "Profil", ikon person / person-outline,
lihat STANDAR.md bagian 4).
[3]: tabBarIcon menerima function (callback) yang dipanggil oleh Tabs. Tabs mengirim color, size,
dan focused (true kalau tab sedang dibuka). Dengan ternary, ikon penuh dipakai saat tab aktif
dan ikon outline saat tidak aktif.
=================================================================*/
