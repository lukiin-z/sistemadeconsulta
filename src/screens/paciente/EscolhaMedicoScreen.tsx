import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Medico } from "../../interfaces/medico";
import { RootStackParamList } from "../../navigation/types";
import { listarMedicosPorEspecialidade } from "../../services/medicoService";
import { formatarMoeda } from "../../utils/date";
import { screenStyles as s } from "../styles";

type Props = NativeStackScreenProps<RootStackParamList, "EscolhaMedico">;

export default function EscolhaMedicoScreen({ navigation, route }: Props) {
  const [items, setItems] = useState<Medico[]>([]);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => { listarMedicosPorEspecialidade(route.params.especialidadeId).then(setItems).finally(() => setCarregando(false)); }, [route.params.especialidadeId]);
  return <View style={s.page}>{carregando ? <ActivityIndicator color="#6d28d9" size="large" style={{ marginTop: 50 }} /> : (
    <FlatList data={items} keyExtractor={(item) => String(item.id)} contentContainerStyle={s.list}
      ListHeaderComponent={<Text style={s.sectionTitle}>Profissionais de {route.params.especialidadeNome}</Text>}
      ListEmptyComponent={<Text style={s.empty}>Nenhum médico ativo nesta especialidade.</Text>}
      renderItem={({ item }) => <Pressable style={[s.card, s.row]} onPress={() => navigation.navigate("AgendarConsulta", { pacienteId: route.params.pacienteId, pacienteNome: route.params.pacienteNome, medicoId: item.id, medicoNome: item.nome, medicoValor: item.valorConsulta })}>
        <View><Text style={s.itemTitle}>{item.nome}</Text><Text style={s.itemMeta}>{item.crm}{item.valorConsulta != null ? ` · ${formatarMoeda(item.valorConsulta)}` : ""}</Text></View><Text style={s.secondaryText}>›</Text>
      </Pressable>} />
  )}</View>;
}
