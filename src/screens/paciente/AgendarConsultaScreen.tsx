import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import CampoDataHora from "../../components/CampoDataHora";
import { RootStackParamList } from "../../navigation/types";
import { agendarConsulta } from "../../services/consultaService";
import { obterMensagemErro } from "../../services/errors";
import { formatarMoeda, proximoHorarioDisponivel, toLocalDateTimeString } from "../../utils/date";
import { screenStyles as s } from "../styles";

type Props = NativeStackScreenProps<RootStackParamList, "AgendarConsulta">;

export default function AgendarConsultaScreen({ navigation, route }: Props) {
  const { pacienteId, pacienteNome, medicoId, medicoNome, medicoValor } = route.params;
  const [dataHora, setDataHora] = useState(proximoHorarioDisponivel);
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function agendar() {
    if (dataHora.getTime() <= Date.now()) return setErro("Escolha uma data e um horário futuros.");
    try {
      setSalvando(true);
      setErro("");
      await agendarConsulta({ medicoId, pacienteId, dataHora: toLocalDateTimeString(dataHora), valor: medicoValor ?? 0, observacoes: observacoes.trim() || undefined });
      navigation.popTo("MinhasConsultas", { pacienteId, pacienteNome });
    } catch (error) {
      setErro(obterMensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={s.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.sectionTitle}>Confirme o agendamento</Text>
        <View style={s.card}><Text style={styles.caption}>MÉDICO SELECIONADO</Text><Text style={s.itemTitle}>{medicoNome}</Text><Text style={styles.price}>{medicoValor != null ? formatarMoeda(medicoValor) : "Valor a definir"}</Text></View>
        <Text style={s.label}>Data e horário</Text><CampoDataHora value={dataHora} onChange={setDataHora} />
        <Text style={s.label}>Observações</Text><TextInput style={[s.input, styles.textarea]} multiline maxLength={1000} placeholder="Motivo da consulta" value={observacoes} onChangeText={setObservacoes} />
        {erro ? <Text style={s.error}>{erro}</Text> : null}
        <Pressable style={[s.button, salvando && s.disabled]} disabled={salvando} onPress={agendar}>{salvando ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Confirmar agendamento</Text>}</Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  caption: { color: "#7c3aed", fontSize: 10, fontWeight: "900", letterSpacing: 1.2, marginBottom: 6 },
  price: { color: "#147a45", fontSize: 14, fontWeight: "800", marginTop: 5 },
  textarea: { height: 95, textAlignVertical: "top" },
});
