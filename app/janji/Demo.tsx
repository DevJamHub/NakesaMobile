import { Tombol } from "@/components";
import { janjiTemuStyles } from "@/styles";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function HalamanDemo() {
    return (
    <View style={janjiTemuStyles.isi}>
        <Text style={janjiTemuStyles.judul}>Halaman Demo</Text>
        <Tombol judul="Kembali" jenis="kedua" onPress={() => router.back()} />
    </View>
    );
}