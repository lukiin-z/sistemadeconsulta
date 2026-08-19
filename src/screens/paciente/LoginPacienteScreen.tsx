import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../navigation/types";
import { buscarPacientePorCpf } from "../../services/pacienteService";
import { obterMensagemErro } from "../../services/errors";
import { screenStyles as s } from "../styles";

type Props = NativeStackScreenProps<RootStackParamList, "LoginPaciente">;

export default function LoginPacienteScreen({ navigation }: Props) {
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    const limpo = cpf.replace(/\D/g, "");
    if (limpo.length !== 11) return setErro("Informe um CPF com 11 dígitos.");
    try {
      setCarregando(true);
      setErro("");
      const paciente = await buscarPacientePorCpf(limpo);
      navigation.replace("MinhasConsultas", { pacienteId: paciente.id, pacienteNome: paciente.nome });
    } catch (error) {
      setErro(obterMensagemErro(error));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={s.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.sectionTitle}>Olá, paciente</Text>
        <Text style={s.label}>CPF</Text>
        <TextInput accessibilityLabel="CPF" style={s.input} keyboardType="numeric" maxLength={11} placeholder="12345678900" value={cpf} onChangeText={(value) => { setCpf(value.replace(/\D/g, "")); setErro(""); }} />
        {erro ? <Text style={s.error}>{erro}</Text> : null}
        <Pressable style={[s.button, carregando && s.disabled]} disabled={carregando} onPress={entrar}>
          {carregando ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Entrar</Text>}
        </Pressable>
        <Pressable style={s.secondaryButton} onPress={() => navigation.navigate("CadastroPaciente")}>
          <Text style={s.secondaryText}>Criar cadastro</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
