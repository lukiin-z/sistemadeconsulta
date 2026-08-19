import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../navigation/types";
import { listarEspecialidades } from "../../services/especialidadeService";
import { Especialidade } from "../../types/especialidade";
import { screenStyles as s } from "../styles";

type Props = NativeStackScreenProps<RootStackParamList, "EscolhaEspecialidade">;

export default function EscolhaEspecialidadeScreen({ navigation, route }: Props) {
  const [items, setItems] = useState<Especialidade[]>([]);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => { listarEspecialidades().then(setItems).finally(() => setCarregando(false)); }, []);
  return <View style={s.page}>{carregando ? <ActivityIndicator color="#6d28d9" size="large" style={{ marginTop: 50 }} /> : (
    <FlatList data={items} keyExtractor={(item) => String(item.id)} contentContainerStyle={s.list}
      ListHeaderComponent={<Text style={s.sectionTitle}>Qual especialidade você procura?</Text>}
      ListEmptyComponent={<Text style={s.empty}>Nenhuma especialidade cadastrada.</Text>}
      renderItem={({ item }) => <Pressable style={[s.card, s.row]} onPress={() => navigation.navigate("EscolhaMedico", { ...route.params, especialidadeId: item.id, especialidadeNome: item.nome })}>
        <View><Text style={s.itemTitle}>{item.nome}</Text>{item.descricao ? <Text style={s.itemMeta}>{item.descricao}</Text> : null}</View><Text style={s.secondaryText}>›</Text>
      </Pressable>} />
  )}</View>;
}
