import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { listarMedicos } from "./src/services/medicoService";
import { listarPacientes } from "./src/services/pacienteService";
import {
  listarConsultas,
  agendarConsulta,
  confirmarConsulta,
  cancelarConsulta,
  NovaConsulta,
} from "./src/services/consultaService";
import { Medico } from "./src/interface/medico";
import { Paciente } from "./src/types/paciente";
import { Consulta } from "./src/interface/consulta";

const STATUS_CORES: Record<string, string> = {
  agendada: "#e3f2fd",
  confirmada: "#d4edda",
  realizada: "#e8f5e9",
  cancelada: "#f8d7da",
};

const STATUS_TEXTO_CORES: Record<string, string> = {
  agendada: "#1565c0",
  confirmada: "#155724",
  realizada: "#1b5e20",
  cancelada: "#721c24",
};

export default function App() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [formMedicoId, setFormMedicoId] = useState("");
  const [formPacienteId, setFormPacienteId] = useState("");
  const [formDataHora, setFormDataHora] = useState("2026-05-20T10:00:00");
  const [formValor, setFormValor] = useState("");
  const [formObservacoes, setFormObservacoes] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro(null);

      const [listaMedicos, listaPacientes, listaConsultas] = await Promise.all([
        listarMedicos(),
        listarPacientes(),
        listarConsultas(),
      ]);

      setMedicos(listaMedicos);
      setPacientes(listaPacientes);
      setConsultas(listaConsultas);
    } catch (error) {
      setErro(
        "Não foi possível carregar os dados.\nVerifique se o backend está rodando em http://localhost:8080"
      );
    } finally {
      setCarregando(false);
    }
  }

  function formatarDataHora(dataHora: string): string {
    const data = new Date(dataHora);
    const dia = data.toLocaleDateString("pt-BR");
    const hora = data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dia} às ${hora}`;
  }

  async function handleAgendarConsulta() {
    if (!formMedicoId || !formPacienteId || !formDataHora || !formValor) {
      alert("Preencha todos os campos obrigatórios (*).");
      return;
    }

    try {
      setSalvando(true);

      const novaConsulta: NovaConsulta = {
        medicoId: Number(formMedicoId),
        pacienteId: Number(formPacienteId),
        dataHora: formDataHora,
        status: "agendada",
        valor: Number(formValor),
        observacoes: formObservacoes || undefined,
      };

      const consultaCriada = await agendarConsulta(novaConsulta);
      setConsultas((prev) => [...prev, consultaCriada]);

      setFormMedicoId("");
      setFormPacienteId("");
      setFormDataHora("2026-05-20T10:00:00");
      setFormValor("");
      setFormObservacoes("");
      setMostrarForm(false);
    } catch (error) {
      alert(
        "Erro ao agendar consulta.\nVerifique os IDs de médico e paciente."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function handleConfirmarConsulta(consulta: Consulta) {
    try {
      const atualizada = await confirmarConsulta(consulta);
      setConsultas((prev) =>
        prev.map((c) => (c.id === atualizada.id ? atualizada : c))
      );
    } catch {
      alert("Erro ao confirmar consulta.");
    }
  }

  async function handleCancelarConsulta(consulta: Consulta) {
    try {
      const atualizada = await cancelarConsulta(consulta);
      setConsultas((prev) =>
        prev.map((c) => (c.id === atualizada.id ? atualizada : c))
      );
    } catch {
      alert("Erro ao cancelar consulta.");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        contentContainerStyle={styles.scrollContent}
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.titulo}>Sistema de Consultas</Text>
              <Text style={styles.subtitulo}>Dados do Backend</Text>
            </View>

            {carregando && (
              <ActivityIndicator
                size="large"
                color="#fff"
                style={{ marginTop: 40 }}
              />
            )}

            {erro && (
              <View style={styles.erroContainer}>
                <Text style={styles.erroTexto}>{erro}</Text>
              </View>
            )}

            {!carregando && !erro && (
              <>
                <Text style={styles.secaoTitulo}>
                  👨‍⚕️ Médicos ({medicos.length})
                </Text>
                {medicos.map((medico) => (
                  <View key={medico.id} style={styles.card}>
                    <Text style={styles.cardNome}>{medico.nome}</Text>
                    <Text style={styles.cardInfo}>CRM: {medico.crm}</Text>
                    <Text style={styles.cardInfo}>
                      {medico.especialidade?.nome ?? " - "}
                    </Text>
                    <View
                      style={[
                        styles.badge,
                        medico.ativo ? styles.badgeAtivo : styles.badgeInativo,
                      ]}
                    >
                      <Text style={styles.badgeTexto}>
                        {medico.ativo ? "Ativo" : "Inativo"}
                      </Text>
                    </View>
                  </View>
                ))}

                <Text style={[styles.secaoTitulo, { marginTop: 24 }]}>
                  👤 Pacientes ({pacientes.length})
                </Text>
                {pacientes.map((paciente) => (
                  <View key={paciente.id} style={styles.card}>
                    <Text style={styles.cardNome}>{paciente.nome}</Text>
                    <Text style={styles.cardInfo}>CPF: {paciente.cpf}</Text>
                    <Text style={styles.cardInfo}>{paciente.email}</Text>
                    {paciente.telefone && (
                      <Text style={styles.cardInfo}>
                        Tel: {paciente.telefone}
                      </Text>
                    )}
                  </View>
                ))}

                <View style={styles.secaoHeader}>
                  <Text style={styles.secaoTituloConsultas}>
                    📅 Consultas ({consultas.length})
                  </Text>
                  <TouchableOpacity
                    style={styles.botaoAgendar}
                    onPress={() => setMostrarForm(true)}
                  >
                    <Text style={styles.botaoAgendarTexto}>+ Agendar</Text>
                  </TouchableOpacity>
                </View>

                {consultas.map((consulta) => (
                  <View key={consulta.id} style={styles.card}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            STATUS_CORES[consulta.status] ?? "#f0f0f0",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusTexto,
                          {
                            color:
                              STATUS_TEXTO_CORES[consulta.status] ?? "#333",
                          },
                        ]}
                      >
                        {consulta.status.toUpperCase()}
                      </Text>
                    </View>

                    <Text style={styles.cardNome}>
                      Dr(a). {consulta.medico?.nome}
                    </Text>
                    <Text style={styles.cardInfo}>
                      👤 {consulta.paciente?.nome}
                    </Text>
                    <Text style={styles.cardInfo}>
                      📅 {formatarDataHora(consulta.dataHora)}
                    </Text>
                    <Text style={styles.cardInfo}>
                      💰{" "}
                      {Number(consulta.valor).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Text>
                    {consulta.observacoes && (
                      <Text style={styles.cardObservacoes}>
                        📝 {consulta.observacoes}
                      </Text>
                    )}

                    {consulta.status === "agendada" && (
                      <View style={styles.acoesContainer}>
                        <TouchableOpacity
                          style={[styles.botaoAcao, styles.botaoConfirmar]}
                          onPress={() => handleConfirmarConsulta(consulta)}
                        >
                          <Text style={styles.botaoAcaoTexto}>✓ Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.botaoAcao, styles.botaoCancelarAcao]}
                          onPress={() => handleCancelarConsulta(consulta)}
                        >
                          <Text style={styles.botaoAcaoTexto}>✗ Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </>
            )}
          </>
        }
      />

      <Modal
        visible={mostrarForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMostrarForm(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Nova Consulta</Text>
            <ScrollView>
              <Text style={styles.inputLabel}>ID do Médico *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1"
                keyboardType="numeric"
                value={formMedicoId}
                onChangeText={setFormMedicoId}
              />

              <Text style={styles.inputLabel}>ID do Paciente *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1"
                keyboardType="numeric"
                value={formPacienteId}
                onChangeText={setFormPacienteId}
              />

              <Text style={styles.inputLabel}>
                Data e Hora * (YYYY-MM-DDTHH:MM:SS)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="2026-05-25T10:00:00"
                value={formDataHora}
                onChangeText={setFormDataHora}
              />

              <Text style={styles.inputLabel}>Valor (R$) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 250"
                keyboardType="numeric"
                value={formValor}
                onChangeText={setFormValor}
              />

              <Text style={styles.inputLabel}>Observações (opcional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultilinha]}
                placeholder="Ex: Consulta de rotina"
                value={formObservacoes}
                onChangeText={setFormObservacoes}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={[
                  styles.botaoSalvar,
                  salvando && styles.botaoDesabilitado,
                ]}
                onPress={handleAgendarConsulta}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.botaoSalvarTexto}>Agendar Consulta</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoCancelarModal}
                onPress={() => setMostrarForm(false)}
              >
                <Text style={styles.botaoCancelarModalTexto}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#79059C" },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 24 },
  titulo: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  subtitulo: { fontSize: 18, color: "#fff", opacity: 0.9 },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  secaoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
  },
  secaoTituloConsultas: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardInfo: { fontSize: 14, color: "#666", marginBottom: 2 },
  cardObservacoes: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
    marginTop: 4,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 8,
  },
  badgeAtivo: { backgroundColor: "#d4edda" },
  badgeInativo: { backgroundColor: "#f8d7da" },
  badgeTexto: { fontSize: 12, fontWeight: "bold", color: "#333" },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  statusTexto: { fontSize: 11, fontWeight: "bold" },
  acoesContainer: { flexDirection: "row", gap: 8, marginTop: 10 },
  botaoAcao: { flex: 1, borderRadius: 8, padding: 10, alignItems: "center" },
  botaoConfirmar: { backgroundColor: "#28a745" },
  botaoCancelarAcao: { backgroundColor: "#dc3545" },
  botaoAcaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  botaoAgendar: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  botaoAgendarTexto: { color: "#79059C", fontWeight: "bold", fontSize: 14 },
  erroContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "rgba(255,80,80,0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,80,80,0.5)",
  },
  erroTexto: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "85%",
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    color: "#333",
  },
  inputMultilinha: { height: 80, textAlignVertical: "top" },
  botaoSalvar: {
    backgroundColor: "#79059C",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoSalvarTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  botaoCancelarModal: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  botaoCancelarModalTexto: { color: "#666", fontSize: 15 },
});
