import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import ConsultaCard from "../../components/ConsultaCard";
import { Consulta } from "../../interfaces/consulta";
import { RootStackParamList } from "../../navigation/types";
import { atualizarStatusConsulta, listarConsultasPorMedico } from "../../services/consultaService";
import { StatusConsulta } from "../../types/statusConsulta";
import { screenStyles as s } from "../styles";

type Props = NativeStackScreenProps<RootStackParamList, "ConsultasMedico">;

export default function ConsultasMedicoScreen({ navigation, route }: Props) {
  const [consultas, setConsultas] = useState<Consulta[]>([]); const [carregando, setCarregando] = useState(true); const [processando, setProcessando] = useState<number | null>(null);
  const carregar = useCallback(async () => { try { setConsultas(await listarConsultasPorMedico(route.params.medicoId)); } finally { setCarregando(false); } }, [route.params.medicoId]);
  useFocusEffect(useCallback(() => { void carregar(); }, [carregar]));
  async function alterar(id: number, status: StatusConsulta) { try { setProcessando(id); const atualizada = await atualizarStatusConsulta(id, status); setConsultas((items) => items.map((item) => item.id === id ? atualizada : item)); } finally { setProcessando(null); } }
  return <View style={s.page}><View style={s.hero}><Text style={s.eyebrow}>ÁREA DO MÉDICO</Text><Text style={s.title}>{route.params.medicoNome}</Text><Pressable onPress={() => navigation.reset({ index: 0, routes: [{ name: "Home" }] })}><Text style={styles.exit}>Sair</Text></Pressable></View>
    {carregando ? <ActivityIndicator color="#6d28d9" size="large" style={{ marginTop: 50 }} /> : <FlatList data={consultas} keyExtractor={(item) => String(item.id)} contentContainerStyle={s.list} onRefresh={carregar} refreshing={false}
      ListEmptyComponent={<Text style={s.empty}>Nenhuma consulta agendada para você.</Text>}
      renderItem={({ item }) => <ConsultaCard consulta={item} busy={processando === item.id} onStatusChange={(status) => alterar(item.id, status)} />} />}
  </View>;
}

const styles = StyleSheet.create({ exit: { color: "#d9c8e7", fontWeight: "700", marginTop: 14 } });
