/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Props Declaration
1.3: Default Function
    2.1: Variable & Condition
    2.2: Main Render
        3.1: Nama Nakes & Profesi
        3.2: Layanan, Lokasi & Tarif
        3.3: Badge Kunjungan Rumah
        3.4: Tombol "Buat Janji"
========================================================= */

// 1.1: Import Section
import { buatJanji, formatRupiah, getLayanan, getLokasi, getNakes, getProfesi } from "@/functions";
import { praktikStyles } from "@/styles";
import type { Praktik } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

// 1.2: Props Declaration
type Props = { praktik: Praktik }; // [1]

// 1.3: Default Function
export default function PraktikCard({ praktik }: Props) {

    // 2.1: Variable & Condition
    const warnaIkon = "#0F766E";
    const namaNakes = getNakes(praktik.idNakes); // [2]
    const labelKunjungan = praktik.kunjunganRumah ? "Bisa kunjungan rumah" : "Hanya di tempat praktik"; // [3]
    const warnaKunjungan = praktik.kunjunganRumah ? "#15803D" : "#5B6C69"; // [3]

    // 2.2: Main Render
    return (
    <View style={praktikStyles.card}>
        {/* 3.1: Nama Nakes & Profesi */}
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#10201D" }}>{namaNakes}</Text>{/*[4]*/}
        <Text style={praktikStyles.profesi}>{getProfesi(praktik.idProfesi)}</Text>

        {/* 3.2: Layanan, Lokasi & Tarif */}
        <View style={praktikStyles.row}>
            <Ionicons name="medkit-outline" size={18} color={warnaIkon} />
            <Text style={praktikStyles.text}>{getLayanan(praktik.idLayanan)}</Text>
        </View>
        <View style={praktikStyles.row}>
            <Ionicons name="location-outline" size={18} color={warnaIkon} />
            <Text style={praktikStyles.text}>{getLokasi(praktik.idLokasi)}</Text>
        </View>
        <View style={praktikStyles.row}>
            <Ionicons name="cash-outline" size={18} color={warnaIkon} />
            <Text style={praktikStyles.text}>{formatRupiah(praktik.tarif)}</Text>
        </View>

        {/* 3.3: Badge Kunjungan Rumah */}
        <View style={[praktikStyles.badge, { borderColor: warnaKunjungan }]}>{/*[5]*/}
            <Text style={{ color: warnaKunjungan, fontWeight: "600" }}>{labelKunjungan}</Text>
        </View>

        {/* 3.4: Tombol "Buat Janji" */}
        <Pressable style={praktikStyles.button} onPress={() => buatJanji(namaNakes)}>{/*[6]*/}
            <Text style={praktikStyles.buttonText}>Buat Janji</Text>
        </Pressable>
    </View>
    );
}

/* ======================== EXPLANATION ========================
[1]:
const props: Props = {
  praktik: { idPraktik: number, idNakes: number, idProfesi: number, idLayanan: number, idLokasi: number, tarif: number, kunjunganRumah: boolean }
};
Artinya component ini menerima 1 props bernama "praktik" yang bentuknya harus sesuai type Praktik di @/types.
[2]: Di constants/praktik.ts hanya ada id-nya saja, bukan nama. Jadi kita pakai function dari @/functions
untuk mencocokkan id itu dengan nama di constants/nakes.ts (begitu juga getProfesi, getLayanan, getLokasi).
Nama nakes disimpan ke variabel karena dipakai 2 kali: di judul dan di tombol.
[3]: Ternary operator: kondisi ? nilaiJikaTrue : nilaiJikaFalse. Teks dan warna badge berubah
tergantung praktik.kunjunganRumah bernilai true atau false.
[4]: Inline styling, style ditulis langsung di dalam tag dengan style={{ ... }}.
[5]: Gabungan external + inline styling. Style dalam array [ ] digabung dari kiri ke kanan, jadi
praktikStyles.badge dipakai dulu, lalu borderColor dari inline style ditambahkan di atasnya.
Inline cocok di sini karena warnanya bergantung pada variabel.
[6]: onPress diberi arrow function () => buatJanji(namaNakes), artinya kita MENERUSKAN function,
bukan langsung memanggilnya. buatJanji baru dijalankan ketika tombol ditekan.
Kalau ditulis onPress={buatJanji(namaNakes)}, function itu langsung jalan saat card dirender.
=================================================================*/
