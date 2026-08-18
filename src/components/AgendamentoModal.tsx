import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { Medico } from "../interfaces/medico";
import { NovaConsulta } from "../services/consultaService";
import { Paciente } from "../types/paciente";
import { proximoHorarioDisponivel, toLocalDateTimeString } from "../utils/date";
import CampoDataHora from "./CampoDataHora";

type Props = {
  visible: boolean;
  medicos: Medico[];
  pacientes: Paciente[];
  onClose: () => void;
  onSubmit: (consulta: NovaConsulta) => Promise<void>;
};

export default function AgendamentoModal({ visible, medicos, pacientes, onClose, onSubmit }: Props) {
  const [medicoId, setMedicoId] = useState(0);
  const [pacienteId, setPacienteId] = useState(0);
  const [dataHora, setDataHora] = useState(proximoHorarioDisponivel);
  const [valor, setValor] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const medicosAtivos = useMemo(() => medicos.filter((item) => item.ativo), [medicos]);
  const pacientesAtivos = useMemo(() => pacientes.filter((item) => item.ativo), [pacientes]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setMedicoId(medicosAtivos[0]?.id ?? 0);
    setPacienteId(pacientesAtivos[0]?.id ?? 0);
    setDataHora(proximoHorarioDisponivel());
    setValor("");
    setObservacoes("");
    setErro(null);
  }, [visible, medicosAtivos, pacientesAtivos]);

  async function submit() {
    const parsedValue = Number(valor.replace(",", "."));
    if (!medicoId || !pacienteId) {
      setErro("Selecione um médico e um paciente ativos.");
      return;
    }
    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      setErro("Informe um valor válido, maior ou igual a zero.");
      return;
    }
    if (dataHora.getTime() <= Date.now()) {
      setErro("Escolha um horário futuro.");
      return;
    }

    try {
      setSalvando(true);
      setErro(null);
      await onSubmit({
        medicoId,
        pacienteId,
        dataHora: toLocalDateTimeString(dataHora),
        valor: parsedValue,
        observacoes: observacoes.trim() || undefined,
      });
      onClose();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível agendar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>NOVO AGENDAMENTO</Text>
              <Text style={styles.title}>Marcar consulta</Text>
            </View>
            <Pressable accessibilityLabel="Fechar" style={styles.close} onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Médico</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={medicoId} onValueChange={(value) => setMedicoId(Number(value))}>
                {medicosAtivos.map((medico) => (
                  <Picker.Item
                    key={medico.id}
                    label={`${medico.nome} · ${medico.especialidade.nome}`}
                    value={medico.id}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Paciente</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={pacienteId} onValueChange={(value) => setPacienteId(Number(value))}>
                {pacientesAtivos.map((paciente) => (
                  <Picker.Item key={paciente.id} label={paciente.nome} value={paciente.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Data e horário</Text>
            <CampoDataHora value={dataHora} onChange={setDataHora} />

            <Text style={styles.label}>Valor</Text>
            <TextInput
              accessibilityLabel="Valor da consulta"
              style={styles.input}
              placeholder="R$ 250,00"
              keyboardType="decimal-pad"
              value={valor}
              onChangeText={setValor}
            />

            <Text style={styles.label}>Observações</Text>
            <TextInput
              accessibilityLabel="Observações"
              style={[styles.input, styles.textarea]}
              placeholder="Motivo ou informações importantes"
              value={observacoes}
              onChangeText={setObservacoes}
              multiline
              maxLength={1000}
            />

            {erro && <Text style={styles.error}>{erro}</Text>}

            <Pressable
              accessibilityRole="button"
              disabled={salvando}
              style={[styles.submit, salvando && styles.disabled]}
              onPress={submit}
            >
              {salvando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Confirmar agendamento</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: "rgba(20, 12, 30, 0.58)", flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "92%",
    padding: 22,
  },
  handle: { alignSelf: "center", backgroundColor: "#d7d0df", borderRadius: 3, height: 5, width: 46 },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 22, marginTop: 14 },
  eyebrow: { color: "#7c3aed", fontSize: 11, fontWeight: "800", letterSpacing: 1.4 },
  title: { color: "#241b2f", fontSize: 26, fontWeight: "800", marginTop: 3 },
  close: { alignItems: "center", backgroundColor: "#f2eef6", borderRadius: 18, height: 36, justifyContent: "center", width: 36 },
  closeText: { color: "#62586f", fontSize: 25, lineHeight: 27 },
  label: { color: "#4b4256", fontSize: 13, fontWeight: "700", marginBottom: 7 },
  pickerContainer: { borderColor: "#d9d4e5", borderRadius: 12, borderWidth: 1, marginBottom: 16, overflow: "hidden" },
  input: { borderColor: "#d9d4e5", borderRadius: 12, borderWidth: 1, color: "#241b2f", fontSize: 15, marginBottom: 16, padding: 13 },
  textarea: { height: 86, textAlignVertical: "top" },
  error: { backgroundColor: "#fff0f1", borderRadius: 10, color: "#b42332", marginBottom: 14, padding: 12 },
  submit: { alignItems: "center", backgroundColor: "#6d28d9", borderRadius: 14, marginBottom: 8, padding: 16 },
  disabled: { opacity: 0.55 },
  submitText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
