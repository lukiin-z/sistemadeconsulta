import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import ConsultaCard from "../../components/ConsultaCard";
import { Consulta } from "../../interfaces/consulta";
import { RootStackParamList } from "../../navigation/types";
import { listarConsultasPorPaciente } from "../../services/consultaService";
import { screenStyles as s } from "../styles";

type Props = NativeStackScreenProps<RootStackParamList, "MinhasConsultas">;

export default function MinhasConsultasScreen({ navigation, route }: Props) {
  const { pacienteId, pacienteNome } = route.params;
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try { setConsultas(await listarConsultasPorPaciente(pacienteId)); }
    finally { setCarregando(false); }
  }, [pacienteId]);

  useFocusEffect(useCallback(() => { void carregar(); }, [carregar]));

  return (
    <View style={s.page}>
      <View style={s.hero}>
        <Text style={s.eyebrow}>ÁREA DO PACIENTE</Text>
        <Text style={s.title}>Olá, {pacienteNome.split(" ")[0]}</Text>
        <View style={styles.actions}>
          <Pressable style={styles.newButton} onPress={() => navigation.navigate("EscolhaEspecialidade", { pacienteId, pacienteNome })}><Text style={styles.newText}>＋ Agendar</Text></Pressable>
          <Pressable onPress={() => navigation.reset({ index: 0, routes: [{ name: "Home" }] })}><Text style={styles.exit}>Sair</Text></Pressable>
        </View>
      </View>
      {carregando ? <ActivityIndicator color="#6d28d9" size="large" style={{ marginTop: 50 }} /> : (
        <FlatList data={consultas} keyExtractor={(item) => String(item.id)} contentContainerStyle={s.list} onRefresh={carregar} refreshing={false}
          ListEmptyComponent={<Text style={s.empty}>Você ainda não possui consultas. Toque em Agendar para começar.</Text>}
          renderItem={({ item }) => <ConsultaCard consulta={item} />} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  newButton: { backgroundColor: "#fff", borderRadius: 11, paddingHorizontal: 15, paddingVertical: 11 },
  newText: { color: "#5b21b6", fontWeight: "800" },
  exit: { color: "#d9c8e7", fontWeight: "700", padding: 10 },
});
