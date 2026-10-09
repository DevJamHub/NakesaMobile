import { Alert, Platform } from "react-native";

export function tampilkanPesan(judul: string, pesan?: string): void {
    if (Platform.OS === "web") {
        window.alert(pesan ? `${judul}\n\n${pesan}` : judul); // [1]
    } else {
        Alert.alert(judul, pesan); // [2]
    }
}

/* ======================== EXPLANATION ========================
[1]: Platform.OS berisi "android", "ios", atau "web". Alert dari React Native tidak muncul di browser,
jadi di web kita pakai window.alert(), pop-up bawaan browser. \n adalah baris baru.
[2]: Di HP (Expo Go) tetap memakai Alert.alert(), function bawaan React Native untuk pop-up.
=================================================================*/
