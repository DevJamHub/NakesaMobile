/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Function Kembali
1.3: Default Function
    2.1: Ambil idJanji dari Alamat
    2.2: Kalau Janji Tidak Ditemukan
    2.3: Variable & Function Tombol
    2.4: Main Render
        3.1: Card Janji Temu
        3.2: Card Status
        3.3: Tombol WhatsApp & Kembali
========================================================= */

// 1.1: Import Section
import { Badge, EmptyState, JanjiTemuCard, Tombol } from "@/components";
import { pasien } from "@/constants";
import { getJanji, getStatusJanji, pesanWhatsApp, tampilkanPesan } from "@/functions";
import { janjiTemuStyles } from "@/styles";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";

// 1.2: Function Kembali
function kembali() {
    if (router.canGoBack()) {
        router.back();
    } else {
        router.replace("/janji-temu");
    }
} // [1]

// 1.3: Default Function
export default function DetailJanjiTemu() {

    // 2.1: Ambil idJanji dari Alamat
    const { idJanji } = useLocalSearchParams<{ idJanji: string }>(); // [2]
    const janji = getJanji(Number(idJanji)); // [3]

    // 2.2: Kalau Janji Tidak Ditemukan
    if (janji === undefined) {
        return (
        <ScrollView style={janjiTemuStyles.layar} contentContainerStyle={janjiTemuStyles.isi}>
            <EmptyState judul="Janji temu tidak ditemukan" />
            <Tombol judul="Kembali" jenis="kedua" onPress={kembali} />
        </ScrollView>
        ); // [4]
    }

    // 2.3: Variable & Function Tombol
    const status = getStatusJanji(janji);

    const tanyaWhatsApp = () => {
        tampilkanPesan("Pesan WhatsApp", pesanWhatsApp(janji, pasien.namaLengkap));
    }; // [5]

    // 2.4: Main Render
    return (
    <ScrollView style={janjiTemuStyles.layar} contentContainerStyle={janjiTemuStyles.isi}>{/*[6]*/}

        {/* 3.1: Card Janji Temu */}
        <JanjiTemuCard janji={janji} />{/*[7]*/}

        {/* 3.2: Card Status */}
        <View style={[janjiTemuStyles.card, janjiTemuStyles.cardStatus]}>
            <Badge label={status.label} tone={status.tone} titik={true} />
            <Text style={janjiTemuStyles.penjelasan}>{status.penjelasan}</Text>
        </View>{/*[8]*/}

        {/* 3.3: Tombol WhatsApp & Kembali */}
        <Tombol judul="Tanya lewat WhatsApp" jenis="whatsapp" ikon="logo-whatsapp" onPress={tanyaWhatsApp} />
        <Tombol judul="Kembali" jenis="kedua" onPress={kembali} />{/*[9]*/}

    </ScrollView>
    );
}

/* ======================== EXPLANATION ========================
[1]: Function untuk tombol Kembali, memakai 3 fungsi router dari expo-router:
- router.canGoBack(): mengecek apakah masih ada halaman di bawah halaman ini di tumpukan Stack.
  Hasilnya true atau false.
- router.back(): kembali ke halaman sebelumnya (halaman paling atas diambil dari tumpukan).
  Dipakai kalau halaman ini dibuka dari daftar Janji Temu dengan router.push().
- router.replace("/janji-temu"): MENGGANTI halaman ini dengan halaman Janji Temu, tanpa menambah tumpukan.
  Dipakai kalau tidak ada halaman sebelumnya, misalnya alamat /janji/1 dibuka langsung atau di-refresh di
  browser. Tanpa ini, router.back() tidak punya tujuan dan pengguna terjebak di halaman ini.
[2]: Nama file ini [idJanji].tsx (dynamic route), jadi alamat /janji/1, /janji/2, dan seterusnya dibuka oleh
file yang sama. useLocalSearchParams() mengambil nilai di dalam kurung siku dari alamat yang sedang dibuka.
<{ idJanji: string }> memberi tahu TypeScript bentuknya. Nilai dari alamat selalu berupa teks, misalnya "1".
[3]: Number() mengubah teks "1" menjadi angka 1, lalu getJanji() mencari janjinya dengan find().
Hasilnya object JanjiTemu, atau undefined kalau tidak ada janji dengan id itu.
[4]: Kalau id tidak ditemukan (misalnya /janji/99), tampilkan EmptyState dan tombol Kembali supaya app
tidak error. return di sini menghentikan function, jadi kode di bawahnya tidak dijalankan.
Setelah blok if ini, TypeScript tahu janji pasti ada (bukan undefined).
[5]: Arrow function untuk tombol WhatsApp. pesanWhatsApp() membuat teks pesan dari janji ini dan nama pasien
(pasien.namaLengkap dari @/constants, yaitu "Budi Santoso"). tampilkanPesan() memunculkan pop-up berjudul
"Pesan WhatsApp", dan tetap muncul di web. Membuka aplikasi WhatsApp sungguhan menunggu modul berikutnya.
[6]: Halaman ini ada di luar tab, jadi judul "Detail Janji Temu" dan panah kembali sudah ditampilkan oleh
header Stack (didaftarkan di app/_layout.tsx bagian Bayhaqy). Karena itu tidak perlu SafeAreaView.
[7]: JanjiTemuCard tanpa onPress, jadi card ini hanya tampilan dan tidak bisa ditekan.
[8]: Card status: gabungan dua external style (card + cardStatus). Badge menampilkan label dan warna status,
lalu teks penjelasan diambil dari getStatusJanji() (STANDAR bagian 9).
[9]: Tombol buatan Sigit (components/Tombol.tsx). jenis menentukan warnanya: "whatsapp" hijau dengan
ikon logo-whatsapp, "kedua" putih bergaris primary. onPress={kembali} meneruskan function dari [1].
=================================================================*/
