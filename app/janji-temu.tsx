/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Default Function
    2.1: Variable
    2.2: Main Render
        3.1: Judul "Janji Temu"
        3.2: Section Akan Datang
        3.3: Section Riwayat
========================================================= */

// 1.1: Import Section
import { EmptyState, JanjiTemuCard, SectionHeader } from "@/components";
import { getJanjiAkanDatang, getRiwayatJanji } from "@/functions";
import { janjiTemuStyles } from "@/styles";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1.2: Default Function
export default function HalamanJanjiTemu() {

    // 2.1: Variable
    const akanDatang = getJanjiAkanDatang();
    const riwayat = getRiwayatJanji();

    // 2.2: Main Render
    return (
    <SafeAreaView style={janjiTemuStyles.layar} edges={["top"]}>{/*[1]*/}
        <ScrollView contentContainerStyle={janjiTemuStyles.isi}>{/*[2]*/}

            {/* 3.1: Judul "Janji Temu" */}
            <Text style={janjiTemuStyles.judul}>Janji Temu</Text>

            {/* 3.2: Section Akan Datang */}
            <View>
                <SectionHeader judul={`Akan Datang (${akanDatang.length})`} />{/*[3]*/}
                {akanDatang.length === 0 ? (
                    <EmptyState judul="Belum ada janji temu" />
                ) : (
                    <View style={janjiTemuStyles.daftar}>
                        {akanDatang.map(
                            (janji) => ( <JanjiTemuCard key={janji.idJanji} janji={janji} /> )
                        )}
                    </View>
                )}{/*[4]*/}
            </View>

            {/* 3.3: Section Riwayat */}
            <View>
                <SectionHeader judul="Riwayat" />
                {riwayat.length === 0 ? (
                    <EmptyState judul="Belum ada riwayat" />
                ) : (
                    <View style={janjiTemuStyles.daftar}>
                        {riwayat.map(
                            (janji) => ( <JanjiTemuCard key={janji.idJanji} janji={janji} /> )
                        )}
                    </View>
                )}
            </View>

        </ScrollView>
    </SafeAreaView>
    );
}

/* ======================== EXPLANATION ========================
[1]: SafeAreaView memberi jarak di bagian atas supaya judul tidak tertutup status bar atau notch HP.
edges={["top"]} artinya jarak hanya diberikan di atas, karena bagian bawah sudah ada tab bar.
[2]: ScrollView membuat layar bisa digulir. contentContainerStyle mengatur isi di dalamnya:
padding 16, paddingBottom 32, dan gap 16 sebagai jarak antar bagian.
[3]: Template literal. ${akanDatang.length} adalah jumlah janji yang akan datang, jadi judulnya
otomatis menjadi "Akan Datang (2)".
[4]: Kondisi untuk daftar kosong memakai ternary operator. Kalau jumlahnya 0, tampilkan EmptyState.
Kalau ada isinya, tampilkan setiap janji dengan map() memakai component JanjiTemuCard.
key wajib diisi nilai unik (idJanji) supaya React bisa membedakan setiap card.
=================================================================*/
