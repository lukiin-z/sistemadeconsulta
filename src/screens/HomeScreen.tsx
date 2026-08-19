import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.page}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>CLÍNICA DIGITAL</Text>
        <Text style={styles.title}>Cuidado conectado, do seu jeito.</Text>
        <Text style={styles.subtitle}>Escolha como deseja acessar o sistema de consultas.</Text>

        <Pressable style={styles.primary} onPress={() => navigation.navigate("LoginPaciente")}>
          <Text style={styles.icon}>♡</Text>
          <View style={styles.grow}>
            <Text style={styles.primaryTitle}>Sou paciente</Text>
            <Text style={styles.primaryText}>Agende e acompanhe suas consultas</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable style={styles.outline} onPress={() => navigation.navigate("LoginMedico")}>
          <Text style={styles.icon}>＋</Text>
          <View style={styles.grow}>
            <Text style={styles.outlineTitle}>Sou médico</Text>
            <Text style={styles.outlineText}>Gerencie sua agenda de atendimentos</Text>
          </View>
          <Text style={styles.outlineTitle}>›</Text>
        </Pressable>

        <Pressable style={styles.admin} onPress={() => navigation.navigate("Agenda")}>
          <Text style={styles.adminText}>Abrir visão geral da clínica</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: "#3b1261", flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: 24 },
  eyebrow: { color: "#c4a7e7", fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#fff", fontSize: 36, fontWeight: "900", letterSpacing: -1, lineHeight: 41, marginTop: 12 },
  subtitle: { color: "#d9c8e7", fontSize: 15, lineHeight: 22, marginBottom: 34, marginTop: 12 },
  primary: { alignItems: "center", backgroundColor: "#fff", borderRadius: 18, flexDirection: "row", marginBottom: 14, padding: 20 },
  outline: { alignItems: "center", borderColor: "#bfa5da", borderRadius: 18, borderWidth: 1, flexDirection: "row", padding: 20 },
  icon: { color: "#8b5bc2", fontSize: 26, fontWeight: "800", marginRight: 14 },
  grow: { flex: 1 },
  primaryTitle: { color: "#32104f", fontSize: 17, fontWeight: "900" },
  primaryText: { color: "#756b80", fontSize: 12, marginTop: 4 },
  outlineTitle: { color: "#fff", fontSize: 17, fontWeight: "900" },
  outlineText: { color: "#d9c8e7", fontSize: 12, marginTop: 4 },
  arrow: { color: "#6d28d9", fontSize: 28 },
  admin: { alignItems: "center", marginTop: 24, padding: 10 },
  adminText: { color: "#c4a7e7", fontSize: 13, fontWeight: "700", textDecorationLine: "underline" },
});
