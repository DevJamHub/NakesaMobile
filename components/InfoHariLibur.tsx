/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Props Declaration
1.3: Default Function
    2.1: State
    2.2: Effect (ambil data dari API)
    2.3: Function Coba Lagi
    2.4: Main Render
        3.1: Ikon
        3.2: Sedang Memuat
        3.3: Gagal
        3.4: Hari Libur
        3.5: Bukan Hari Libur
========================================================= */

// 1.1: Import Section
import Badge from "@/components/Badge"; // [8]
import Tombol from "@/components/Tombol";
import { warna } from "@/constants";
import { cekHariLibur } from "@/functions/hariLibur";
import { hariLiburStyles, janjiTemuStyles } from "@/styles";
import type { HariLibur, StatusCekLibur } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

// 1.2: Props Declaration
type Props = { tanggal: string }; // [1]

// 1.3: Default Function
export default function InfoHariLibur({ tanggal }: Props) {

    // 2.1: State
    const [status, setStatus] = useState<StatusCekLibur>("memuat");
    const [hariLibur, setHariLibur] = useState<HariLibur | undefined>(undefined);
    const [percobaan, setPercobaan] = useState(0); // [2]

    // 2.2: Effect (ambil data dari API)
    useEffect(() => {
        cekHariLibur(tanggal)
            .then((hasil) => {
                setHariLibur(hasil);
                setStatus("berhasil");
            })
            .catch((error) => {
                console.log("Gagal memeriksa hari libur:", error);
                setStatus("gagal");
            }); // [3]
    }, [tanggal, percobaan]); // [4]

    // 2.3: Function Coba Lagi
    const cobaLagi = () => {
        setStatus("memuat");
        setPercobaan(percobaan + 1);
    }; // [5]

    // 2.4: Main Render
    return (
    <View style={janjiTemuStyles.card}>
        <View style={hariLiburStyles.baris}>

            {/* 3.1: Ikon */}
            <View style={hariLiburStyles.lingkaranIkon}>
                <Ionicons name="calendar-outline" size={18} color={warna.primary} />
            </View>

            <View style={hariLiburStyles.isi}>
                <Text style={hariLiburStyles.label}>Hari libur nasional</Text>

                {/* 3.2: Sedang Memuat */}
                {status === "memuat" ? (
                    <View style={hariLiburStyles.barisMemuat}>
                        <ActivityIndicator size="small" color={warna.primary} />
                        <Text style={hariLiburStyles.keterangan}>Memeriksa hari libur…</Text>
                    </View>
                ) : null}{/*[6]*/}

                {/* 3.3: Gagal */}
                {status === "gagal" ? (
                    <>
                        <Text style={hariLiburStyles.pesanGagal}>Gagal memeriksa hari libur. Periksa koneksi internet Anda.</Text>
                        <Tombol judul="Coba lagi" jenis="polos" onPress={cobaLagi} />
                    </>
                ) : null}

                {/* 3.4: Hari Libur */}
                {status === "berhasil" && hariLibur !== undefined ? (
                    <>
                        <Badge label="Hari libur" tone="warning" titik={true} />
                        <Text style={hariLiburStyles.nilai}>{hariLibur.name}</Text>
                        <Text style={hariLiburStyles.keterangan}>Pastikan praktik tetap buka di tanggal ini.</Text>
                    </>
                ) : null}{/*[7]*/}

                {/* 3.5: Bukan Hari Libur */}
                {status === "berhasil" && hariLibur === undefined ? (
                    <Text style={hariLiburStyles.nilai}>Bukan hari libur nasional</Text>
                ) : null}
            </View>
        </View>
    </View>
    );
}

/* ======================== EXPLANATION ========================
[1]: Component ini menerima satu props: tanggal janji temu ("YYYY-MM-DD").
Contoh pemakaian di halaman Detail Janji Temu: <InfoHariLibur tanggal={janji.tanggal} />
[2]: Tiga state:
- status: tahap pengecekan ("memuat" | "berhasil" | "gagal", union type di types/hariLibur.ts).
  Nilai awalnya "memuat" karena request langsung dikirim saat component tampil.
- hariLibur: object HariLibur dari API kalau tanggalnya hari libur, atau undefined kalau bukan.
- percobaan: angka yang bertambah setiap tombol "Coba lagi" ditekan, supaya useEffect jalan lagi.
[3]: cekHariLibur() mengembalikan Promise (functions/hariLibur.ts), jadi hasilnya ditangkap dengan:
- .then(): jalan kalau Promise resolve. hasil berisi object HariLibur atau undefined. Disimpan ke state,
  lalu status diubah ke "berhasil" sehingga halaman digambar ulang dengan hasilnya.
- .catch(): jalan kalau Promise reject (tidak ada internet, server error, atau lebih dari 8 detik).
  status diubah ke "gagal" supaya pesan gagal dan tombol "Coba lagi" muncul. App tidak crash.
Sementara menunggu server, kode lain tetap jalan dan halaman tetap bisa dipakai (asynchronous).
[4]: Dependency array: useEffect jalan sekali saat component pertama tampil, lalu jalan lagi setiap
tanggal atau percobaan berubah. Kalau ditulis [] saja, tombol "Coba lagi" tidak akan mengambil ulang data.
[5]: Arrow function untuk tombol "Coba lagi": status dikembalikan ke "memuat" (loading muncul lagi),
lalu percobaan ditambah 1 supaya useEffect di [4] mengirim request baru ke API.
[6]: Conditional rendering dengan ternary: bagian ini hanya tampil kalau status "memuat".
ActivityIndicator adalah lingkaran loading bawaan React Native. <> </> (fragment) membungkus beberapa
element tanpa menambah View baru.
[7]: Data dari API ditampilkan lewat field object-nya, misalnya hariLibur.name ("Christmas Day" untuk 25 Desember).
Badge buatan Bayhaqy dipakai dengan tone warning supaya terlihat sebagai peringatan.
[8]: Badge, Tombol, dan cekHariLibur diimpor langsung dari file-nya, bukan dari "@/components" atau
"@/functions". Alasannya sama seperti di JanjiTemuCard.tsx: index.ts juga mengekspor file ini, jadi kalau
mengimpor dari index, keduanya saling memanggil berputar (require cycle) dan Expo memberi warning kuning.
=================================================================*/
