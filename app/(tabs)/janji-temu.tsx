/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Type Pilihan
1.3: Function Buka Detail
1.4: Default Function
    2.1: State
    2.2: Effect
    2.3: Variable
    2.4: Main Render
        3.1: Judul "Janji Temu"
        3.2: Pilihan Akan Datang / Riwayat
        3.3: Daftar Janji
========================================================= */
// 1.1: Import Section
import { Chip, EmptyState, JanjiTemuCard } from "@/components";
import { getJanjiAkanDatang, getRiwayatJanji } from "@/functions";
import { janjiTemuStyles } from "@/styles";
import type { JanjiTemu } from "@/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1.2: Type Pilihan
type Pilihan = "akanDatang" | "riwayat"; // [1]

// 1.3: Function Buka Detail
function bukaDetail(idJanji: number) {
    router.push(`/janji/${idJanji}`); // [2]
}

// 1.4: Default Function
export default function HalamanJanjiTemu() {

    // 2.1: State
    const [pilihan, setPilihan] = useState<Pilihan>("akanDatang"); // [3]
    const [daftarJanji, setDaftarJanji] = useState<JanjiTemu[]>(getJanjiAkanDatang()); // [4]

    // 2.2: Effect
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (pilihan === "akanDatang") {
            setDaftarJanji(getJanjiAkanDatang());
        } else {
            setDaftarJanji(getRiwayatJanji());
        }
    }, [pilihan]); // [5]
    /* eslint-enable react-hooks/set-state-in-effect */

    // 2.3: Variable
    const jumlahAkanDatang = getJanjiAkanDatang().length;
    const judulKosong = pilihan === "akanDatang" ? "Belum ada janji temu" : "Belum ada riwayat"; // [6]

    // 2.4: Main Render
    return (
    <SafeAreaView style={janjiTemuStyles.layar} edges={["top"]}>{/*[7]*/}
        <ScrollView contentContainerStyle={janjiTemuStyles.isi}>

            {/* 3.1: Judul "Janji Temu" */}
            <Text style={janjiTemuStyles.judul}>Janji Temu</Text>

            {/* 3.2: Pilihan Akan Datang / Riwayat */}
            <View style={janjiTemuStyles.barisChip}>
                <Chip
                    label={`Akan Datang (${jumlahAkanDatang})`}
                    terpilih={pilihan === "akanDatang"}
                    onPress={() => setPilihan("akanDatang")}
                />
                <Chip
                    label="Riwayat"
                    terpilih={pilihan === "riwayat"}
                    onPress={() => setPilihan("riwayat")}
                />
            </View>{/*[8]*/}

            {/* 3.3: Daftar Janji */}
            {daftarJanji.length === 0 ? (
                <EmptyState judul={judulKosong} />
            ) : (
                <View style={janjiTemuStyles.daftar}>
                    {daftarJanji.map(
                        (janji) => ( <JanjiTemuCard key={janji.idJanji} janji={janji} onPress={() => bukaDetail(janji.idJanji)} /> )
                    )}
                </View>
            )}{/*[9]*/}

        </ScrollView>
    </SafeAreaView>
    );
}

/* ======================== EXPLANATION ========================
[1]: Union type. Pilihan hanya boleh "akanDatang" atau "riwayat". Kalau salah ketik, TypeScript langsung error.
[2]: router.push() membuka halaman baru dan menaruhnya DI ATAS halaman ini di tumpukan Stack (app/_layout.tsx).
Karena halaman Janji Temu masih ada di bawahnya, tombol kembali di halaman detail bisa memakai router.back().
Template literal `/janji/${idJanji}` menghasilkan alamat seperti "/janji/1", yang dibuka oleh file
app/janji/[idJanji].tsx (dynamic route). Angka 1 itu nanti dibaca di sana dengan useLocalSearchParams().
[3]: useState membuat state, yaitu variabel yang kalau diubah membuat halaman digambar ulang (re-render).
Hasilnya array 2 isi yang kita pecah (destructuring): pilihan = nilai sekarang, setPilihan = function
untuk mengubahnya. <Pilihan> adalah type-nya, dan "akanDatang" adalah nilai awal saat halaman pertama dibuka.
[4]: State kedua menyimpan daftar janji yang sedang ditampilkan (array of objects JanjiTemu).
Nilai awalnya langsung daftar akan datang, supaya saat pertama dibuka daftarnya sudah terisi.
[5]: useEffect menjalankan function di dalamnya SETELAH halaman tampil. [pilihan] adalah dependency:
function ini jalan sekali saat halaman pertama dibuka, lalu jalan lagi SETIAP KALI pilihan berubah.
Urutannya: Chip ditekan → setPilihan() mengubah pilihan → halaman re-render → useEffect jalan →
setDaftarJanji() mengisi daftar baru → halaman re-render lagi dengan daftar yang baru.
Kalau [pilihan] dihapus, useEffect jalan setiap render. Kalau diganti [], hanya jalan sekali saat dibuka,
jadi menekan Chip tidak mengubah daftar.
Komentar eslint-disable / eslint-enable di atas dan bawah useEffect mematikan satu aturan lint
(react-hooks/set-state-in-effect) khusus di bagian ini. Aturan itu menyarankan tidak memanggil set state langsung
di dalam useEffect karena membuat render dua kali. Kita tetap memakai pola ini karena memang diminta TUGAS.md
dan sama dengan contoh asisten, dan datanya kecil sehingga tidak berpengaruh ke kecepatan app.
[6]: Ternary operator. Teks tampilan kosong menyesuaikan pilihan (STANDAR bagian 7).
jumlahAkanDatang dipakai di label Chip, jadi teksnya "Akan Datang (2)" sesuai jumlah data.
[7]: SafeAreaView memberi jarak di bagian atas supaya judul tidak tertutup status bar atau notch HP.
edges={["top"]} artinya jarak hanya di atas, karena bagian bawah sudah ada tab bar.
[8]: Dua Chip buatan Bayhaqy (components/Chip.tsx). terpilih bernilai true kalau pilihan sama dengan chip itu,
jadi chip yang aktif berwarna primary. onPress memanggil setPilihan() dengan pilihan baru.
[9]: Kalau daftarnya kosong, tampilkan EmptyState. Kalau ada isinya, setiap janji ditampilkan dengan map()
memakai JanjiTemuCard. key wajib diisi nilai unik (idJanji). onPress={() => bukaDetail(janji.idJanji)}
artinya kita MENERUSKAN function ke card, yang baru dijalankan saat card ditekan.
=================================================================*/
