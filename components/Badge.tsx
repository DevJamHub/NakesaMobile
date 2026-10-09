/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Props Declaration
1.3: Warna Latar per Tone
1.4: Default Function
    2.1: Variable
    2.2: Main Render
        3.1: Titik Status
        3.2: Label
========================================================= */

// 1.1: Import Section
import { warna } from "@/constants";
import { badgeStyles } from "@/styles";
import type { Tone } from "@/types";
import { Text, View } from "react-native";

// 1.2: Props Declaration
type Props = { label: string; tone: Tone; titik?: boolean }; // [1]

// 1.3: Warna Latar per Tone
const warnaLatars = { // [2]
    success: warna.successSoft,
    warning: warna.warningSoft,
    danger: warna.dangerSoft,
    info: warna.infoSoft,
    neutral: warna.neutralSoft,
};

// 1.4: Default Function
export default function Badge({ label, tone, titik }: Props) {

    // 2.1: Variable
    const warnaTeks = warna[tone]; // [3]
    const warnaLatar = warnaLatars[tone];

    // 2.2: Main Render
    return (
    <View style={[badgeStyles.badge, { backgroundColor: warnaLatar }]}>{/*[4]*/}

        {/* 3.1: Titik Status */}
        {titik ? <View style={[badgeStyles.titik, { backgroundColor: warnaTeks }]} /> : null}{/*[5]*/}

        {/* 3.2: Label */}
        <Text style={[badgeStyles.label, { color: warnaTeks }]}>{label}</Text>
    </View>
    );
}

/* ======================== EXPLANATION ========================
[1]: Component ini menerima 3 props. tone hanya boleh salah satu dari "success", "warning", "danger",
"info", atau "neutral" (type Tone). Tanda ? pada titik berarti props itu boleh tidak dikirim.
Contoh pemakaian: <Badge label="Dikonfirmasi" tone="success" titik={true} />
[2]: Object untuk mencari warna latar dari nama tone. Isinya tetap diambil dari constants/warna.ts,
jadi tidak ada hex yang ditulis di sini. warnaLatars["success"] hasilnya warna.successSoft.
[3]: Nama tone sama dengan nama warna di constants/warna.ts, jadi warna["success"] langsung memberi
warna teks hijau. Kurung siku [ ] dipakai karena nama warnanya ada di dalam variabel tone.
[4]: Gabungan external + inline styling. badgeStyles.badge berisi bentuk badge, lalu backgroundColor
ditambahkan lewat inline style karena warnanya bergantung pada tone.
[5]: Ternary operator. Kalau titik bernilai true, tampilkan lingkaran kecil. Kalau tidak, tampilkan null
(tidak ada apa-apa).
=================================================================*/
