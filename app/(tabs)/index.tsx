/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Default Function
    2.1: Function Saat Ditekan
    2.2: Bagian Atas Halaman
        3.1: Sapaan
        3.2: Kolom Cari
        3.3: Kategori
        3.4: Judul "Praktik untuk Anda"
    2.3: Main Render
        3.5: Daftar Praktik
========================================================= */

// Halaman milik Sigit. Isinya mengikuti TUGAS.md dan STANDAR.md.

// 1.1: Import Section
import { KategoriCard, PraktikCard, SearchBar } from "@/components";
import { praktiks, profesis } from "@/constants";
import { alamatPraktik, sapaan, tampilkanPesan } from "@/functions";
import { berandaStyles } from "@/styles";
import type { Praktik, Profesi } from "@/types";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1.2: Default Function
export default function Beranda() {

    // 2.1: Function Saat Ditekan
    const pilihKategori = (profesi: Profesi) => {
        tampilkanPesan(profesi.namaProfesi);
    }; // [1]

    const pilihPraktik = (praktik: Praktik) => {
        tampilkanPesan(praktik.namaPraktik, alamatPraktik(praktik.alamat, praktik.kota));
    };

    // 2.2: Bagian Atas Halaman
    const bagianAtas = (
        <View style={berandaStyles.bagianAtas}>{/*[2]*/}

            {/* 3.1: Sapaan */}
            <View style={berandaStyles.kotakSapaan}>
                <Text style={berandaStyles.sapaan}>{sapaan()} 👋</Text>{/*[3]*/}
                <Text style={berandaStyles.subSapaan}>Apa yang Anda butuhkan hari ini?</Text>
            </View>

            {/* 3.2: Kolom Cari */}
            <SearchBar />

            {/* 3.3: Kategori */}
            <View>
                <Text style={berandaStyles.judulSection}>Kategori</Text>
                <View style={berandaStyles.gridKategori}>
                    {profesis.map((profesi) => (
                        <KategoriCard key={profesi.idProfesi} profesi={profesi} onPress={() => pilihKategori(profesi)} />
                    ))}{/*[4]*/}
                </View>
            </View>

            {/* 3.4: Judul "Praktik untuk Anda" */}
            <Text style={berandaStyles.judulSection}>Praktik untuk Anda</Text>

        </View>
    );

    // 2.3: Main Render
    return (
    <SafeAreaView edges={["top"]} style={berandaStyles.layar}>{/*[5]*/}

        {/* 3.5: Daftar Praktik */}
        <FlatList
            data={praktiks}
            keyExtractor={(praktik) => praktik.idPraktik.toString()}
            renderItem={({ item }) => <PraktikCard praktik={item} onPress={() => pilihPraktik(item)} />}
            ListHeaderComponent={bagianAtas}
            contentContainerStyle={berandaStyles.isi}
            showsVerticalScrollIndicator={false}
        />{/*[6]*/}

    </SafeAreaView>
    );
}

/* ======================== EXPLANATION ========================
[1]: Arrow function yang disimpan di variabel. Isinya memanggil tampilkanPesan() dari @/functions,
yang memunculkan pop-up di HP maupun di browser. Function ini baru dijalankan saat kartu ditekan.
[2]: JSX juga bisa disimpan di variabel. bagianAtas berisi semua yang ada di atas daftar praktik,
lalu diberikan ke FlatList lewat ListHeaderComponent (lihat [6]).
[3]: sapaan() dari @/functions memilih "Selamat pagi/siang/sore/malam" sesuai jam di HP.
[4]: Loop dengan map(): setiap profesi di array profesis diubah menjadi satu KategoriCard.
key wajib diisi nilai unik (idProfesi) supaya React bisa membedakan setiap kartu.
onPress={() => pilihKategori(profesi)} artinya kita MENERUSKAN function, bukan langsung memanggilnya.
[5]: SafeAreaView memberi jarak supaya sapaan tidak tertutup notch atau status bar HP.
edges={["top"]} artinya jarak hanya di atas, karena bagian bawah sudah ada tab bar.
[6]: FlatList menampilkan daftar dengan efisien. 3 props utamanya:
- data: array yang ditampilkan (praktiks)
- keyExtractor: mengambil key unik tiap item, harus berupa string
- renderItem: function yang membuat component untuk tiap item ({ item } adalah satu praktik)
FlatList dipakai sebagai wadah utama halaman, dan bagian atas dimasukkan ke ListHeaderComponent supaya
ikut tergulir. Menaruh FlatList di dalam ScrollView memunculkan peringatan merah di Expo Go.
=================================================================*/
