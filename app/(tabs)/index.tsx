/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Default Function
    2.1: State
    2.2: Effect Pencarian
    2.3: Function Saat Ditekan
    2.4: Bagian Atas Halaman
        3.1: Sapaan
        3.2: Kolom Cari
        3.3: Kategori
        3.4: Janji Temu Berikutnya
        3.5: Judul "Praktik untuk Anda"
    2.5: Main Render
        3.6: Daftar Praktik
========================================================= */

// Halaman milik Sigit. Isinya mengikuti TUGAS.md dan STANDAR.md.

// 1.1: Import Section
import { EmptyState, JanjiTemuCard, KategoriCard, PraktikCard, SearchBar, SectionHeader } from "@/components";
import { pasien, praktiks, profesis } from "@/constants";
import { cariPraktik, getJanjiBerikutnya, namaDepan, sapaan, tampilkanPesan } from "@/functions";
import { berandaStyles } from "@/styles";
import type { Praktik, Profesi } from "@/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1.2: Default Function
export default function Beranda() {

    // 2.1: State
    const [kataKunci, setKataKunci] = useState<string>(""); // [1]
    const [hasilPraktik, setHasilPraktik] = useState<Praktik[]>(praktiks);

    // 2.2: Effect Pencarian
    useEffect(() => {
        setHasilPraktik(cariPraktik(kataKunci));
    }, [kataKunci]); // [2]

    // 2.3: Function Saat Ditekan
    const pilihKategori = (profesi: Profesi) => {
        tampilkanPesan(profesi.namaProfesi);
    };

    const bukaPraktik = (praktik: Praktik) => {
        router.push(`/praktik/${praktik.idPraktik}`);
    }; // [3]

    const janjiBerikutnya = getJanjiBerikutnya();

    // 2.4: Bagian Atas Halaman
    const bagianAtas = (
        <View style={berandaStyles.bagianAtas}>{/*[4]*/}

            {/* 3.1: Sapaan */}
            <View style={berandaStyles.kotakSapaan}>
                <Text style={berandaStyles.sapaan}>{sapaan()}, {namaDepan(pasien.namaLengkap)} 👋</Text>
                <Text style={berandaStyles.subSapaan}>Apa yang Anda butuhkan hari ini?</Text>
            </View>

            {/* 3.2: Kolom Cari */}
            <SearchBar value={kataKunci} onChangeText={setKataKunci} />{/*[5]*/}

            {/* 3.3: Kategori */}
            <View>
                <Text style={berandaStyles.judulSection}>Kategori</Text>
                <View style={berandaStyles.gridKategori}>
                    {profesis.map((profesi) => (
                        <KategoriCard key={profesi.idProfesi} profesi={profesi} onPress={() => pilihKategori(profesi)} />
                    ))}
                </View>
            </View>

            {/* 3.4: Janji Temu Berikutnya */}
            {janjiBerikutnya ? (
                <View>
                    <SectionHeader judul="Janji temu berikutnya" aksi="Lihat semua" onAksi={() => router.push("/janji-temu")} />
                    <JanjiTemuCard janji={janjiBerikutnya} />
                </View>
            ) : null}{/*[6]*/}

            {/* 3.5: Judul "Praktik untuk Anda" */}
            <Text style={berandaStyles.judulSection}>Praktik untuk Anda</Text>

        </View>
    );

    // 2.5: Main Render
    return (
    <SafeAreaView edges={["top"]} style={berandaStyles.layar}>

        {/* 3.6: Daftar Praktik */}
        <FlatList
            data={hasilPraktik}
            keyExtractor={(praktik) => praktik.idPraktik.toString()}
            renderItem={({ item }) => <PraktikCard praktik={item} onPress={() => bukaPraktik(item)} />}
            ListHeaderComponent={bagianAtas}
            ListEmptyComponent={<EmptyState judul="Belum ada praktik" />}
            contentContainerStyle={berandaStyles.isi}
            showsVerticalScrollIndicator={false}
        />{/*[7]*/}

    </SafeAreaView>
    );
}

/* ======================== EXPLANATION ========================
[1]: useState membuat state, yaitu variabel yang kalau berubah membuat layar di-render ulang.
Polanya [nilai, functionPengubah] = useState<tipe>(nilaiAwal).
- kataKunci: isi kolom cari, awalnya "" (kosong). Hanya boleh diubah lewat setKataKunci.
- hasilPraktik: daftar praktik yang tampil, awalnya semua praktik.
[2]: useEffect menjalankan function di dalamnya setiap kali nilai di dependency [kataKunci] berubah.
Urutannya: huruf diketik → kataKunci berubah → layar render ulang → useEffect jalan →
setHasilPraktik diisi hasil cariPraktik() → daftar praktik di layar ikut berubah.
[3]: router.push() membuka halaman baru di atas halaman ini (tumpukan Stack), jadi bisa kembali lagi dengan
router.back(). Alamat `/praktik/1` membuka file app/praktik/[idPraktik].tsx dengan idPraktik bernilai "1".
[4]: JSX juga bisa disimpan di variabel. bagianAtas berisi semua yang ada di atas daftar praktik,
lalu diberikan ke FlatList lewat ListHeaderComponent (lihat [7]).
[5]: Isi kolom cari diambil dari state kataKunci (value). Setiap ada ketikan, SearchBar memanggil
setKataKunci dengan teks terbaru (onChangeText).
[6]: Ternary: section ini hanya tampil kalau getJanjiBerikutnya() menemukan janji. "Lihat semua" membuka
tab Janji Temu dengan router.push("/janji-temu").
[7]: FlatList menampilkan isi state hasilPraktik. ListEmptyComponent tampil kalau hasilnya kosong.
Bagian atas dimasukkan ke ListHeaderComponent supaya ikut tergulir. Menaruh FlatList di dalam
ScrollView memunculkan peringatan merah di Expo Go.
=================================================================*/
