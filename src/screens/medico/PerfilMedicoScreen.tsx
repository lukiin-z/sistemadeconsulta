import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Medico } from "../../interfaces/medico";
import { RootStackParamList } from "../../navigation/types";
import { atualizarMedico, buscarMedicoPorId } from "../../services/medicoService";
import { obterMensagemErro } from "../../services/errors";
import { screenStyles as s } from "../styles";

type Props = NativeStackScreenProps<RootStackParamList, "PerfilMedico">;

export default function PerfilMedicoScreen({ navigation, route }: Props) {
  const [medico, setMedico] = useState<Medico | null>(null);
  const [valor, setValor] = useState(""); const [erro, setErro] = useState(""); const [salvando, setSalvando] = useState(false);
  useEffect(() => { buscarMedicoPorId(route.params.medicoId).then((item) => { setMedico(item); if (item.valorConsulta != null) setValor(String(item.valorConsulta).replace(".", ",")); }).catch((e) => setErro(obterMensagemErro(e))); }, [route.params.medicoId]);

  async function salvar() {
    const valorNumero = Number(valor.replace(",", "."));
    if (!medico || !Number.isFinite(valorNumero) || valorNumero <= 0) return setErro("Informe um valor válido para a consulta.");
    try {
      setSalvando(true); setErro("");
      const atualizado = await atualizarMedico(medico.id, { ...medico, valorConsulta: valorNumero });
      navigation.replace("ConsultasMedico", { medicoId: atualizado.id, medicoNome: atualizado.nome });
    } catch (error) { setErro(obterMensagemErro(error)); } finally { setSalvando(false); }
  }

  if (!medico && !erro) return <ActivityIndicator color="#6d28d9" size="large" style={{ marginTop: 50 }} />;
  return <KeyboardAvoidingView style={s.page} behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView contentContainerStyle={s.content}>
    <Text style={s.sectionTitle}>Complete seu perfil</Text>
    {medico ? <Text style={[s.card, s.itemTitle]}>{medico.nome}{"\n"}<Text style={s.itemMeta}>{medico.especialidade.nome} · {medico.crm}</Text></Text> : null}
    <Text style={s.label}>Valor da consulta</Text><TextInput style={s.input} keyboardType="decimal-pad" placeholder="250,00" value={valor} onChangeText={setValor} />
    {erro ? <Text style={s.error}>{erro}</Text> : null}<Pressable style={[s.button, salvando && s.disabled]} disabled={salvando} onPress={salvar}>{salvando ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Salvar e abrir agenda</Text>}</Pressable>
  </ScrollView></KeyboardAvoidingView>;
}
