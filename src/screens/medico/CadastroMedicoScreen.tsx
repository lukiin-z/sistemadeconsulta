import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../navigation/types";
import { cadastrarMedico } from "../../services/medicoService";
import { listarEspecialidades } from "../../services/especialidadeService";
import { obterMensagemErro } from "../../services/errors";
import { Especialidade } from "../../types/especialidade";
import { screenStyles as s } from "../styles";

type Props = NativeStackScreenProps<RootStackParamList, "CadastroMedico">;

export default function CadastroMedicoScreen({ navigation }: Props) {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [especialidadeId, setEspecialidadeId] = useState(0);
  const [nome, setNome] = useState(""); const [crm, setCrm] = useState(""); const [valor, setValor] = useState("");
  const [erro, setErro] = useState(""); const [salvando, setSalvando] = useState(false);
  useEffect(() => { listarEspecialidades().then((items) => { setEspecialidades(items); setEspecialidadeId(items[0]?.id ?? 0); }); }, []);

  async function salvar() {
    const especialidade = especialidades.find((item) => item.id === especialidadeId);
    const valorNumero = valor.trim() ? Number(valor.replace(",", ".")) : null;
    if (!nome.trim() || !crm.trim() || !especialidade) return setErro("Preencha nome, CRM e especialidade.");
    if (valorNumero != null && (!Number.isFinite(valorNumero) || valorNumero <= 0)) return setErro("Informe um valor válido.");
    try {
      setSalvando(true); setErro("");
      const medico = await cadastrarMedico({ nome: nome.trim(), crm: crm.trim().toUpperCase(), especialidade, ativo: true, valorConsulta: valorNumero });
      navigation.replace(valorNumero == null ? "PerfilMedico" : "ConsultasMedico", { medicoId: medico.id, medicoNome: medico.nome });
    } catch (error) { setErro(obterMensagemErro(error)); } finally { setSalvando(false); }
  }

  return <KeyboardAvoidingView style={s.page} behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <Text style={s.sectionTitle}>Novo médico</Text>
    <Text style={s.label}>Nome completo</Text><TextInput style={s.input} placeholder="Dra. Ana Martins" value={nome} onChangeText={setNome} />
    <Text style={s.label}>CRM</Text><TextInput style={s.input} autoCapitalize="characters" value={crm} onChangeText={setCrm} />
    <Text style={s.label}>Especialidade</Text><View style={[s.input, { padding: 0 }]}><Picker selectedValue={especialidadeId} onValueChange={(v) => setEspecialidadeId(Number(v))}>{especialidades.map((item) => <Picker.Item key={item.id} label={item.nome} value={item.id} />)}</Picker></View>
    <Text style={s.label}>Valor da consulta (opcional)</Text><TextInput style={s.input} keyboardType="decimal-pad" placeholder="250,00" value={valor} onChangeText={setValor} />
    {erro ? <Text style={s.error}>{erro}</Text> : null}<Pressable style={[s.button, salvando && s.disabled]} disabled={salvando} onPress={salvar}>{salvando ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Cadastrar</Text>}</Pressable>
  </ScrollView></KeyboardAvoidingView>;
}
