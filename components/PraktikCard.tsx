/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Props Declaration
1.3: Default Function
    2.1: Variable & Condition
    2.2: Main Render
        3.1: Avatar Emoji Profesi
        3.2: Nama Praktik, Profesi, Nakes
        3.3: Alamat
        3.4: Badge Buka / Tutup
        3.5: Panah Kanan
========================================================= */

// 1.1: Import Section
import { warna } from "@/constants";
import { alamatPraktik, getNakes, getProfesi, namaBergelar, subjudulPraktik } from "@/functions";
import { berandaStyles } from "@/styles";
import type { Praktik } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import Avatar from "@/components/Avatar";

// 1.2: Props Declaration
type Props = {
    praktik: Praktik;
    onPress: () => void;
};

// 1.3: Default Function
export default function PraktikCard({ praktik, onPress }: Props) {

    // 2.1: Variable & Condition
    const profesi = getProfesi(praktik.idProfesi); // [1]
    const nakes = getNakes(praktik.idNakes);
    const warnaProfesi = profesi?.warna ?? warna.primary; // [2]
    const namaNakes = namaBergelar(nakes?.namaNakes ?? "", profesi?.gelar ?? "");
    const labelBuka = praktik.sedangBuka ? "Sedang buka" : "Sedang tutup"; // [3]
    const warnaBuka = praktik.sedangBuka ? warna.success : warna.neutral;
    const latarBuka = praktik.sedangBuka ? warna.successSoft : warna.neutralSoft;

    // 2.2: Main Render
    return (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [berandaStyles.kartuPraktik, pressed && berandaStyles.kartuDitekan]}
    >
        <View style={berandaStyles.barisPraktik}>
            {/* 3.1: Avatar Emoji Profesi */}
            <Avatar ukuran={52} emoji={profesi?.emoji ?? "🏥"} warnaAvatar={warnaProfesi} />

            <View style={berandaStyles.isiPraktik}>
                {/* 3.2: Nama Praktik, Profesi, Nakes */}
                <Text style={berandaStyles.namaPraktik} numberOfLines={2}>{praktik.namaPraktik}</Text>
                <Text style={[berandaStyles.subjudulPraktik, { color: warnaProfesi }]} numberOfLines={1}>
                    {subjudulPraktik(profesi?.namaProfesi ?? "Tenaga kesehatan", praktik.spesialis)}
                </Text>{/*[4]*/}
                <Text style={berandaStyles.teksKecil} numberOfLines={1}>{namaNakes}</Text>

                {/* 3.3: Alamat */}
                <View style={berandaStyles.barisAlamat}>
                    <Ionicons name="location-outline" size={15} color={warna.textMuted} />
                    <Text style={[berandaStyles.teksKecil, { flex: 1 }]} numberOfLines={1}>
                        {alamatPraktik(praktik.alamat, praktik.kota)}
                    </Text>
                </View>

                {/* 3.4: Badge Buka / Tutup */}
                <View style={[berandaStyles.badge, { backgroundColor: latarBuka }]}>{/*[5]*/}
                    <View style={[berandaStyles.titikBadge, { backgroundColor: warnaBuka }]} />
                    <Text style={[berandaStyles.teksBadge, { color: warnaBuka }]}>{labelBuka}</Text>
                </View>
            </View>

            {/* 3.5: Panah Kanan */}
            <Ionicons name="chevron-forward" size={20} color={warna.textFaint} />
        </View>
    </Pressable>
    );
}

/* ======================== EXPLANATION ========================
[1]: Data praktik hanya menyimpan idProfesi dan idNakes. getProfesi() dan getNakes() mencari datanya
di constants/ dengan find(), lalu mengembalikan objeknya (atau undefined kalau tidak ketemu).
[2]: profesi?.warna adalah optional chaining: ambil warna kalau profesi ada. Tanda ?? memberi nilai
cadangan, jadi kalau profesi tidak ketemu, dipakai warna utama app.
[3]: Ternary operator: kondisi ? nilaiJikaTrue : nilaiJikaFalse. Teks dan warna badge berubah
tergantung praktik.sedangBuka bernilai true atau false.
[4]: Gabungan external + inline styling. Ukuran teks dari berandaStyles, warnanya inline karena
setiap profesi punya warna sendiri (Bidan merah muda, Dokter Umum biru, dan seterusnya).
[5]: Badge "Sedang buka" (hijau) atau "Sedang tutup" (abu-abu), dengan titik kecil di depannya.
Bentuknya dari berandaStyles, warnanya inline karena bergantung pada praktik.sedangBuka (lihat [3]).
=================================================================*/
