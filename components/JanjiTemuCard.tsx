/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Props Declaration
1.3: Default Function
    2.1: Variable & Condition
    2.2: Main Render
        3.1: Avatar, Nama Praktik & Layanan
        3.2: Kotak Tanggal & Jam
        3.3: Badge Status
========================================================= */

// 1.1: Import Section
import Avatar from "@/components/Avatar"; // [7]
import Badge from "@/components/Badge";
import { warna } from "@/constants";
import { formatJam, getLayanan, getPraktik, getProfesi, getStatusJanji, tanggalRamah } from "@/functions";
import { janjiTemuStyles } from "@/styles";
import type { JanjiTemu } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, Text, View } from "react-native";

// 1.2: Props Declaration
type Props = { janji: JanjiTemu }; // [1]

// 1.3: Default Function
export default function JanjiTemuCard({ janji }: Props) {

    // 2.1: Variable & Condition
    const praktik = getPraktik(janji.idPraktik); // [2]
    if (praktik === undefined) {
        return null; // [3]
    }

    const profesi = getProfesi(praktik.idProfesi);
    const status = getStatusJanji(janji);

    let namaLayanan = profesi?.namaProfesi; // [4]
    if (janji.idLayanan !== undefined) {
        namaLayanan = getLayanan(janji.idLayanan)?.namaLayanan;
    }

    // 2.2: Main Render
    return (
    <Pressable
        style={({ pressed }) => [janjiTemuStyles.card, pressed ? janjiTemuStyles.cardDitekan : null]}
        onPress={() => Alert.alert(status.label, status.penjelasan)}
    >{/*[5]*/}

        {/* 3.1: Avatar, Nama Praktik & Layanan */}
        <View style={janjiTemuStyles.atas}>
            <Avatar ukuran={44} emoji={profesi?.emoji} warnaAvatar={profesi?.warna} />{/*[6]*/}
            <View style={janjiTemuStyles.infoPraktik}>
                <Text style={janjiTemuStyles.namaPraktik}>{praktik.namaPraktik}</Text>
                <Text style={janjiTemuStyles.layanan}>{namaLayanan}</Text>
            </View>
        </View>

        {/* 3.2: Kotak Tanggal & Jam */}
        <View style={janjiTemuStyles.jadwal}>
            <View style={janjiTemuStyles.jadwalItem}>
                <Ionicons name="calendar-outline" size={16} color={warna.primary} />
                <Text style={janjiTemuStyles.jadwalTeks}>{tanggalRamah(janji.tanggal)}</Text>
            </View>
            <View style={janjiTemuStyles.jadwalItem}>
                <Ionicons name="time-outline" size={16} color={warna.primary} />
                <Text style={janjiTemuStyles.jadwalTeks}>{formatJam(janji.jamMulai, janji.jamSelesai)}</Text>
            </View>
        </View>

        {/* 3.3: Badge Status */}
        <Badge label={status.label} tone={status.tone} titik={true} />
    </Pressable>
    );
}

/* ======================== EXPLANATION ========================
[1]: Component ini menerima 1 props bernama "janji" yang bentuknya harus sesuai type JanjiTemu di @/types.
Contoh pemakaian: <JanjiTemuCard janji={janji} />. Card ini dipakai di halaman Janji Temu dan Beranda.
[2]: Data janji temu hanya menyimpan idPraktik. getPraktik() mencari object praktiknya di constants/praktik.ts.
Hasilnya object Praktik, atau undefined kalau id-nya tidak ditemukan.
[3]: Kalau praktiknya tidak ditemukan, component mengembalikan null, artinya card tidak ditampilkan.
Setelah baris ini TypeScript tahu bahwa praktik pasti ada, jadi praktik.idProfesi aman dipakai.
[4]: Kalau janji tidak punya layanan, yang ditulis nama profesinya. Kita isi dulu dengan nama profesi
(let, karena nilainya bisa diganti), lalu diganti nama layanan kalau idLayanan ada.
?. adalah optional chaining: ambil namaProfesi hanya kalau profesi tidak undefined.
[5]: Pressable membuat card bisa ditekan.
- style diberi function yang menerima { pressed }. Saat ditekan, pressed bernilai true, jadi style
  cardDitekan ditambahkan. Saat tidak ditekan, yang ditambahkan null (tidak ada).
- onPress memunculkan Alert dengan judul label status dan isi penjelasan status dari getStatusJanji().
[6]: Avatar buatan Sigit. Karena tidak ada foto, yang tampil emoji profesi di lingkaran berwarna profesi.
[7]: Avatar dan Badge diimpor langsung dari file-nya, bukan dari "@/components". Alasannya,
components/index.ts juga mengekspor JanjiTemuCard. Kalau JanjiTemuCard mengimpor dari index itu,
file-file ini saling memanggil berputar (require cycle) dan Expo memberi warning kuning.
=================================================================*/
