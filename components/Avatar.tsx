/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Props Declaration
1.3: Default Function
    2.1: Variable
    2.2: Main Render
        3.1: Foto
        3.2: Emoji atau Inisial
========================================================= */

// 1.1: Import Section
import { warna } from "@/constants";
import { getInisial } from "@/functions";
import { Image, Text, View } from "react-native";

// 1.2: Props Declaration
type Props = {
    ukuran: number;
    foto?: string;
    nama?: string;
    emoji?: string;
    warnaAvatar?: string;
}; // [1]

// 1.3: Default Function
export default function Avatar({ ukuran, foto, nama, emoji, warnaAvatar = warna.primary }: Props) { // [2]

    // 2.1: Variable
    const bulat = { width: ukuran, height: ukuran, borderRadius: ukuran / 2 }; // [3]

    // 2.2: Main Render
    // 3.1: Foto
    if (foto) {
        return <Image source={{ uri: foto }} style={[bulat, { backgroundColor: warna.border }]} />; // [4]
    }

    // 3.2: Emoji atau Inisial
    return (
    <View style={[bulat, { backgroundColor: `${warnaAvatar}1F`, alignItems: "center", justifyContent: "center" }]}>{/*[5]*/}
        <Text style={{ fontSize: emoji ? ukuran * 0.48 : ukuran * 0.38, fontWeight: "700", color: warnaAvatar }}>
            {emoji ?? getInisial(nama ?? "")}{/*[6]*/}
        </Text>
    </View>
    );
}

/* ======================== EXPLANATION ========================
[1]: Hanya ukuran yang wajib. Props lain opsional (tanda ?), jadi Avatar bisa dipakai untuk foto profil,
emoji profesi, atau inisial nama. Contoh: <Avatar ukuran={52} emoji="🤰" warnaAvatar="#b8456e" />
[2]: warnaAvatar = warna.primary adalah nilai default: kalau props warnaAvatar tidak diisi,
yang dipakai warna utama app.
[3]: Lingkaran dibuat dari kotak yang borderRadius-nya setengah dari ukurannya.
[4]: Kondisi if. Kalau ada foto, component langsung return gambar dan baris di bawahnya tidak dijalankan.
[5]: Inline style karena ukuran dan warnanya bergantung pada props. Tambahan "1F" di belakang kode warna
membuat warna latar transparan 12%, jadi lingkarannya berwarna lembut.
[6]: Kalau ada emoji, emoji yang tampil. Kalau tidak, inisial nama (lihat getInisial di functions/format.ts).
=================================================================*/
