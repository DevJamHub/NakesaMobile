/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Props Declaration
1.3: getWarnaTombol
1.4: Default Function
    2.1: Variable
    2.2: Main Render
        3.1: Ikon
        3.2: Judul
========================================================= */

// 1.1: Import Section
import { warna } from "@/constants";
import { tombolStyles } from "@/styles";
import type { NamaIkon } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

// 1.2: Props Declaration
type JenisTombol = "utama" | "kedua" | "polos" | "bahaya" | "whatsapp"; // [1]

type Props = {
    judul: string;
    onPress: () => void;
    jenis?: JenisTombol;
    ikon?: NamaIkon;
};

type WarnaTombol = { latar: string; latarDitekan: string; teks: string; garis?: string };

// 1.3: getWarnaTombol
function getWarnaTombol(jenis: JenisTombol): WarnaTombol {
    switch (jenis) {
        case "kedua":
            return { latar: warna.surface, latarDitekan: warna.primarySoft, teks: warna.primary, garis: warna.primary };
        case "polos":
            return { latar: "transparent", latarDitekan: warna.primarySoft, teks: warna.primary };
        case "bahaya":
            return { latar: warna.surface, latarDitekan: warna.dangerSoft, teks: warna.danger, garis: warna.danger };
        case "whatsapp":
            return { latar: warna.whatsapp, latarDitekan: warna.whatsappPressed, teks: warna.white };
        default:
            return { latar: warna.primary, latarDitekan: warna.primaryPressed, teks: warna.white };
    } // [2]
}

// 1.4: Default Function
export default function Tombol({ judul, onPress, jenis = "utama", ikon }: Props) { // [3]

    // 2.1: Variable
    const warnaTombol = getWarnaTombol(jenis);

    // 2.2: Main Render
    return (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            tombolStyles.tombol,
            {
                backgroundColor: pressed ? warnaTombol.latarDitekan : warnaTombol.latar,
                borderWidth: warnaTombol.garis ? 1.5 : 0,
                borderColor: warnaTombol.garis,
            },
        ]}
    >{/*[4]*/}
        {/* 3.1: Ikon */}
        {ikon ? <Ionicons name={ikon} size={20} color={warnaTombol.teks} /> : null}

        {/* 3.2: Judul */}
        <Text style={[tombolStyles.teks, { color: warnaTombol.teks }]}>{judul}</Text>
    </Pressable>
    );
}

/* ======================== EXPLANATION ========================
[1]: Union type. jenis hanya boleh salah satu dari 5 teks ini (STANDAR.md bagian 5, tabel tombol).
Tanda ? pada jenis dan ikon artinya props itu boleh tidak dikirim.
Contoh pemakaian: <Tombol judul="Kembali" jenis="kedua" onPress={kembali} />
[2]: switch memilih warna sesuai jenis tombol. Setiap case langsung return, jadi tidak perlu break.
default dipakai untuk jenis "utama". Hanya "kedua" dan "bahaya" yang punya garis tepi.
"transparent" artinya tanpa warna latar, jadi warna layar di belakangnya yang terlihat.
[3]: jenis = "utama" di parameter adalah nilai default: kalau props jenis tidak dikirim, tombol
memakai jenis "utama".
[4]: Pressable mengirim pressed (true saat tombol sedang ditekan) ke function style. Dengan ternary,
warna latar berganti saat ditekan. Kalau warnaTombol.garis kosong, tebal garisnya 0 (tanpa garis).
=================================================================*/
