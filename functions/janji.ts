import { Alert } from "react-native";

export function buatJanji(namaNakes: string): void {
    Alert.alert(
        "Buat Janji",
        `Kamu memilih ${namaNakes}. Fitur buat janji segera hadir.`
    ); // [1]
}

/* ======================== EXPLANATION ========================
[1]: Alert.alert() adalah function bawaan React Native untuk memunculkan pop-up. Kita bungkus di dalam
custom function buatJanji() supaya component cukup memanggil buatJanji(nama) tanpa perlu tahu isi pop-up-nya.
Return type-nya void karena function ini tidak mengembalikan nilai apa pun.
=================================================================*/
