import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../navigation/types";
import { buscarMedicoPorCrm } from "../../services/medicoService";
import { obterMensagemErro } from "../../services/errors";
import { screenStyles as s } from "../styles";

type Props = NativeStackScreenProps<RootStackParamList, "LoginMedico">;

export default function LoginMedicoScreen({ navigation }: Props) {
  const [crm, setCrm] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!crm.trim()) return setErro("Informe seu CRM.");
    try {
      setCarregando(true);
      setErro("");
      const medico = await buscarMedicoPorCrm(crm.trim());
      const destino = medico.valorConsulta == null ? "PerfilMedico" : "ConsultasMedico";
      navigation.replace(destino, { medicoId: medico.id, medicoNome: medico.nome });
    } catch (error) {
      setErro(obterMensagemErro(error));
    } finally { setCarregando(false); }
  }

  return <KeyboardAvoidingView style={s.page} behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <Text style={s.sectionTitle}>Olá, médico</Text><Text style={s.label}>CRM</Text>
    <TextInput accessibilityLabel="CRM" style={s.input} autoCapitalize="characters" placeholder="CRM-SP 123456" value={crm} onChangeText={(v) => { setCrm(v); setErro(""); }} />
    {erro ? <Text style={s.error}>{erro}</Text> : null}
    <Pressable style={[s.button, carregando && s.disabled]} disabled={carregando} onPress={entrar}>{carregando ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Entrar</Text>}</Pressable>
    <Pressable style={s.secondaryButton} onPress={() => navigation.navigate("CadastroMedico")}><Text style={s.secondaryText}>Criar cadastro profissional</Text></Pressable>
  </ScrollView></KeyboardAvoidingView>;
}
