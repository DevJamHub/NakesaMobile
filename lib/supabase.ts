/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Adapter Penyimpanan Aman
1.3: Alamat dan Kunci Supabase
1.4: Klien Supabase
========================================================= */

// 1.1: Import Section
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// 1.2: Adapter Penyimpanan Aman
const diWeb = Platform.OS === "web"; // [1]

const penyimpananAman = {
    getItem: (kunci: string) =>
        diWeb ? Promise.resolve(localStorage.getItem(kunci)) : SecureStore.getItemAsync(kunci),
    setItem: (kunci: string, nilai: string) =>
        diWeb ? Promise.resolve(localStorage.setItem(kunci, nilai)) : SecureStore.setItemAsync(kunci, nilai),
    removeItem: (kunci: string) =>
        diWeb ? Promise.resolve(localStorage.removeItem(kunci)) : SecureStore.deleteItemAsync(kunci),
}; // [2]

// 1.3: Alamat dan Kunci Supabase
const alamatSupabase = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const kunciSupabase = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""; // [3]

if (!alamatSupabase || !kunciSupabase) {
    console.warn("Alamat atau kunci Supabase belum diisi di file .env");
}

// 1.4: Klien Supabase
export const supabase = createClient(alamatSupabase, kunciSupabase, {
    auth: {
        storage: penyimpananAman,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
}); // [4]

/* ======================== EXPLANATION ========================
[1]: Platform.OS berisi "ios", "android", atau "web". expo-secure-store hanya ada di HP, tidak ada di
browser. Jadi kita catat dulu apakah app sedang berjalan di web, supaya di web memakai localStorage.
[2]: Adapter adalah object penghubung. Supabase hanya tahu 3 function: getItem (ambil), setItem (simpan),
dan removeItem (hapus). Kita isi ketiganya dengan SecureStore, sehingga token login disimpan di
penyimpanan terenkripsi milik HP (Keychain di iPhone, Keystore di Android), bukan di file biasa.
Ternary diWeb ? ... : ... memilih localStorage kalau di web. Promise.resolve() dipakai karena
Supabase menunggu (await) hasilnya, sedangkan localStorage langsung memberi hasil tanpa Promise.
[3]: process.env.EXPO_PUBLIC_... dibaca dari file .env saat Metro menyusun app. Hanya variabel yang
diawali EXPO_PUBLIC_ yang ikut masuk ke app. || "" artinya kalau kosong, pakai teks kosong. Setelah
mengubah .env, app wajib dijalankan ulang dengan npx expo start --go -c (c = hapus cache).
Kunci yang dipakai adalah publishable key (sb_publishable_...), bukan secret key, karena kunci ini ikut
terbawa di dalam app dan bisa dilihat orang lain.
[4]: createClient() membuat satu klien Supabase untuk seluruh app (diekspor, lalu di-import di file lain).
storage: tempat menyimpan sesi (adapter di atas).
autoRefreshToken: token login diperbarui otomatis sebelum kedaluwarsa.
persistSession: sesi disimpan, jadi setelah app ditutup lalu dibuka pengguna tetap masuk.
detectSessionInUrl: false, karena di HP tidak ada alamat browser yang berisi token.
=================================================================*/
