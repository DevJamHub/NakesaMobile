/* =================== TABLE OF CONTENT =================
1.1: Import Section
1.2: Default Function
    2.1: Main Render
        3.1: Header "Nakesa"
        3.2: Jumlah Nakes
        3.3: Map Praktik Data
========================================================= */

// 1.1: Import Section
import { PraktikCard } from "@/components";
import { praktiks } from "@/constants";
import { praktikStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

// 1.2: Default Function
export default function Index() {

    // 2.1: Main Render
    return (
    <ScrollView style={praktikStyles.container} contentContainerStyle={praktikStyles.content}>{/*[1]*/}

        {/* 3.1: Header "Nakesa" */}
        <View style={praktikStyles.header}>
            <Ionicons name="heart-circle" size={36} color="#0F766E" />
            <Text style={praktikStyles.title}>Nakesa</Text>
        </View>

        {/* 3.2: Jumlah Nakes */}
        <Text style={praktikStyles.subtitle}>{praktiks.length} tenaga kesehatan siap membantu kamu</Text>{/*[2]*/}

        {/* 3.3: Map Praktik Data */}
        {praktiks.map(
            (praktik) => ( <PraktikCard key={praktik.idPraktik} praktik={praktik} /> ) // [3]
        )}

    </ScrollView>
    );
}

/* ======================== EXPLANATION ========================
[1]: ScrollView membuat layar bisa digulir, karena 5 card tidak muat di satu layar HP.
style mengatur ScrollView-nya, sedangkan contentContainerStyle mengatur isi di dalamnya (padding, dll).
[2]: praktiks.length adalah jumlah item di dalam array praktiks.
[3]: Kita mengambil semua data praktik dan menampilkannya satu-satu dengan map() menggunakan component
PraktikCard yang sudah kita buat sebelumnya di @/components. key wajib diisi dengan nilai unik (idPraktik)
supaya React bisa membedakan setiap card.
=================================================================*/
