/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Type Isi Context
1.3: Membuat Context
1.4: AuthProvider
    2.1: State
    2.2: Effect Sesi
    2.3: Function Keluar
    2.4: Main Render
1.5: Custom Hook useAuth
========================================================= */

// 1.1: Import Section
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// 1.2: Type Isi Context
type IsiAuth = {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    keluar: () => Promise<void>;
}; // [1]

// 1.3: Membuat Context
const AuthContext = createContext<IsiAuth | undefined>(undefined); // [2]

// 1.4: AuthProvider
export function AuthProvider({ children }: { children: ReactNode }) { // [3]

    // 2.1: State
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // [4]

    // 2.2: Effect Sesi
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setUser(data.session?.user ?? null);
            setIsLoading(false);
        }); // [5]

        const { data: pendengar } = supabase.auth.onAuthStateChange((_peristiwa, sesiBaru) => {
            setSession(sesiBaru);
            setUser(sesiBaru?.user ?? null);
            setIsLoading(false);
        }); // [6]

        return () => {
            pendengar.subscription.unsubscribe();
        }; // [7]
    }, []);

    // 2.3: Function Keluar
    async function keluar() {
        await supabase.auth.signOut(); // [8]
    }

    // 2.4: Main Render
    return (
    <AuthContext.Provider value={{ user, session, isLoading, keluar }}>
        {children}
    </AuthContext.Provider>
    ); // [9]
}

// 1.5: Custom Hook useAuth
export function useAuth() {
    const isi = useContext(AuthContext);
    if (!isi) {
        throw new Error("useAuth harus dipakai di dalam AuthProvider");
    }
    return isi;
} // [10]

/* ======================== EXPLANATION ========================
[1]: Type untuk isi yang dibagikan ke semua halaman. User dan Session adalah type bawaan Supabase.
User | null artinya bisa berisi data pengguna atau null (belum masuk). keluar adalah function async
yang tidak mengembalikan nilai, jadi type-nya () => Promise<void>.
[2]: createContext() membuat "papan pengumuman" global. Nilai awalnya undefined, artinya belum ada
AuthProvider yang mengisi. Dengan Context, halaman mana pun bisa membaca user tanpa harus dikirim
lewat props dari halaman ke halaman (prop drilling).
[3]: AuthProvider adalah component pembungkus. children adalah semua halaman di dalamnya (Stack di
app/_layout.tsx). ReactNode adalah type untuk apa saja yang bisa digambar React.
[4]: Tiga state. isLoading dimulai dari true, karena saat app baru dibuka kita belum tahu pengguna
sudah masuk atau belum. Selama true, app/_layout.tsx menampilkan spinner, bukan halaman.
[5]: getSession() membaca sesi yang tersimpan di SecureStore (lewat adapter di lib/supabase.ts).
Inilah yang membuat pengguna tetap masuk setelah app ditutup. .then() dijalankan setelah sesi selesai
dibaca. data.session?.user ?? null: tanda ?. berarti "ambil user kalau session ada", dan ?? null
berarti "kalau hasilnya kosong, pakai null". Setelah itu isLoading menjadi false.
[6]: onAuthStateChange() memasang pendengar (subscription). Supabase memanggil function ini SETIAP
KALI status login berubah: SIGNED_IN (masuk atau daftar), SIGNED_OUT (keluar), TOKEN_REFRESHED, dan
lainnya. _peristiwa diberi garis bawah karena tidak dipakai. Karena state ikut berubah, semua halaman
yang memakai useAuth() digambar ulang, dan route guard di app/_layout.tsx langsung memindahkan halaman.
[7]: Function yang di-return dari useEffect adalah cleanup, dijalankan saat AuthProvider dilepas.
unsubscribe() melepas pendengar supaya tidak ada pendengar ganda dan memori tidak bocor.
Dependency [] artinya effect ini hanya jalan sekali saat app dibuka.
[8]: signOut() menghapus sesi di Supabase dan di SecureStore. Kita tidak perlu memindahkan halaman di
sini: onAuthStateChange menerima SIGNED_OUT, session menjadi null, lalu route guard membawa ke Masuk.
[9]: Provider membagikan value ke semua children. Object { user, session, isLoading, keluar } adalah
singkatan dari { user: user, session: session, ... }.
[10]: Custom hook adalah function yang diawali "use" dan memakai hook lain. useContext() membaca isi
AuthContext. Kalau hasilnya undefined, berarti halaman itu tidak berada di dalam AuthProvider, jadi
kita lempar error yang jelas daripada app error diam-diam. Cara pakai di halaman:
const { user, keluar } = useAuth();
=================================================================*/
