import { Alert, Platform } from "react-native";

export function konfirmasiKeluar(saatYa: () => void): void {
    const judul = "Keluar dari akun?";
    const pesan = "Anda perlu masuk lagi dengan email dan kata sandi untuk membuka janji temu Anda.";

    if (Platform.OS === "web") {
        if (window.confirm(`${judul}\n\n${pesan}`)) saatYa(); // [1]
        return;
    }

    Alert.alert(judul, pesan, [
        { text: "Tidak", style: "cancel" },
        { text: "Ya, keluar", style: "destructive", onPress: saatYa },
    ]); // [2]
}

/* ======================== EXPLANATION ========================
[1]: Di web, Alert dengan dua tombol tidak muncul, jadi dipakai window.confirm() yang punya tombol OK dan
Cancel. confirm() bernilai true kalau OK ditekan, lalu saatYa() dijalankan.
[2]: Alert.alert() menerima judul, pesan, dan array tombol. Tombol "Tidak" (cancel) hanya menutup pop-up.
Tombol "Ya, keluar" menjalankan callback saatYa yang dikirim dari halaman Profil. Teksnya sesuai STANDAR
bagian 7 (Konfirmasi keluar).
=================================================================*/
