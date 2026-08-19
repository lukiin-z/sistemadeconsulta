import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../navigation/types";
import { cadastrarPaciente } from "../../services/pacienteService";
import { obterMensagemErro } from "../../services/errors";
import { screenStyles as s } from "../styles";

type Props = NativeStackScreenProps<RootStackParamList, "CadastroPaciente">;

export default function CadastroPacienteScreen({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (!nome.trim() || cpf.length !== 11 || !email.includes("@")) return setErro("Preencha nome, CPF e e-mail corretamente.");
    try {
      setSalvando(true);
      setErro("");
      const paciente = await cadastrarPaciente({ nome: nome.trim(), cpf, email: email.trim().toLowerCase(), telefone: telefone || undefined, ativo: true });
      navigation.replace("MinhasConsultas", { pacienteId: paciente.id, pacienteNome: paciente.nome });
    } catch (error) {
      setErro(obterMensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={s.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.sectionTitle}>Novo paciente</Text>
        <Text style={s.label}>Nome completo</Text><TextInput style={s.input} value={nome} onChangeText={setNome} />
        <Text style={s.label}>CPF</Text><TextInput style={s.input} keyboardType="numeric" maxLength={11} value={cpf} onChangeText={(v) => setCpf(v.replace(/\D/g, ""))} />
        <Text style={s.label}>E-mail</Text><TextInput style={s.input} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <Text style={s.label}>Telefone</Text><TextInput style={s.input} keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
        {erro ? <Text style={s.error}>{erro}</Text> : null}
        <Pressable style={[s.button, salvando && s.disabled]} disabled={salvando} onPress={salvar}>
          {salvando ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Cadastrar e entrar</Text>}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
