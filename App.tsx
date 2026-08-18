import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import AgendamentoModal from "./src/components/AgendamentoModal";
import ConsultaCard from "./src/components/ConsultaCard";
import FiltrosStatus, { FiltroStatus } from "./src/components/FiltrosStatus";
import { useAgenda } from "./src/hooks/useAgenda";
import { API_BASE_URL } from "./src/services/api";

export default function App() {
  const agenda = useAgenda();
  const [modalVisible, setModalVisible] = useState(false);
  const [filtro, setFiltro] = useState<FiltroStatus>("todas");
  const [refreshing, setRefreshing] = useState(false);

  const consultasFiltradas = useMemo(
    () => agenda.consultas.filter((item) => filtro === "todas" || item.status === filtro),
    [agenda.consultas, filtro]
  );

  const podeAgendar = agenda.medicos.some((item) => item.ativo)
    && agenda.pacientes.some((item) => item.ativo);

  async function refresh() {
    setRefreshing(true);
    await agenda.carregar();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#6d28d9" />}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>CLÍNICA DIGITAL</Text>
          <Text style={styles.title}>Sua agenda, sem complicação.</Text>
          <Text style={styles.subtitle}>Consultas, pacientes e profissionais em um só lugar.</Text>
          <Pressable
            accessibilityRole="button"
            disabled={!podeAgendar}
            style={[styles.newButton, !podeAgendar && styles.disabled]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.newButtonIcon}>＋</Text>
            <Text style={styles.newButtonText}>Nova consulta</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.metrics}>
            <Metric value={agenda.totais.agendadas} label="Agendadas" accent="#f59e0b" />
            <Metric value={agenda.totais.confirmadas} label="Confirmadas" accent="#16a66a" />
            <Metric value={agenda.totais.concluidas} label="Realizadas" accent="#4f72d8" />
          </View>

          {agenda.feedback && (
            <Pressable
              style={[
                styles.feedback,
                agenda.feedback.tipo === "erro" ? styles.feedbackError : styles.feedbackSuccess,
              ]}
              onPress={agenda.limparFeedback}
            >
              <Text style={styles.feedbackText}>{agenda.feedback.mensagem}</Text>
              <Text style={styles.feedbackClose}>×</Text>
            </Pressable>
          )}

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>AGENDA</Text>
              <Text style={styles.sectionTitle}>Consultas</Text>
            </View>
            <Text style={styles.count}>{consultasFiltradas.length}</Text>
          </View>

          <FiltrosStatus value={filtro} onChange={setFiltro} />

          {agenda.carregando ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color="#6d28d9" />
              <Text style={styles.stateText}>Carregando sua agenda...</Text>
            </View>
          ) : agenda.erro ? (
            <View style={styles.errorState}>
              <Text style={styles.errorTitle}>Não conseguimos acessar a agenda</Text>
              <Text style={styles.errorText}>{agenda.erro}</Text>
              <Text style={styles.apiText}>{API_BASE_URL}</Text>
              <Pressable style={styles.retry} onPress={agenda.carregar}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : consultasFiltradas.length === 0 ? (
            <View style={styles.centerState}>
              <Text style={styles.emptyIcon}>◷</Text>
              <Text style={styles.emptyTitle}>Nenhuma consulta por aqui</Text>
              <Text style={styles.stateText}>Altere o filtro ou crie um novo agendamento.</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {consultasFiltradas.map((consulta) => (
                <ConsultaCard
                  key={consulta.id}
                  consulta={consulta}
                  busy={agenda.atualizandoId === consulta.id}
                  onStatusChange={(status) => agenda.alterarStatus(consulta.id, status)}
                />
              ))}
            </View>
          )}

          {!podeAgendar && !agenda.carregando && !agenda.erro && (
            <Text style={styles.warning}>Cadastre ao menos um médico e um paciente ativos para agendar.</Text>
          )}
        </View>
      </ScrollView>

      <AgendamentoModal
        visible={modalVisible}
        medicos={agenda.medicos}
        pacientes={agenda.pacientes}
        onClose={() => setModalVisible(false)}
        onSubmit={agenda.agendar}
      />
    </SafeAreaView>
  );
}

function Metric({ value, label, accent }: { value: number; label: string; accent: string }) {
  return (
    <View style={styles.metric}>
      <View style={[styles.metricAccent, { backgroundColor: accent }]} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#3b1261", flex: 1 },
  page: { backgroundColor: "#f7f4fa", flex: 1 },
  content: { flexGrow: 1 },
  hero: { backgroundColor: "#3b1261", paddingBottom: 42, paddingHorizontal: 22, paddingTop: 42 },
  eyebrow: { color: "#c4a7e7", fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  title: { color: "#fff", fontSize: 34, fontWeight: "900", letterSpacing: -1, lineHeight: 39, marginTop: 10, maxWidth: 330 },
  subtitle: { color: "#d9c8e7", fontSize: 14, lineHeight: 21, marginTop: 10, maxWidth: 330 },
  newButton: { alignItems: "center", alignSelf: "flex-start", backgroundColor: "#fff", borderRadius: 14, flexDirection: "row", marginTop: 24, paddingHorizontal: 17, paddingVertical: 13 },
  newButtonIcon: { color: "#6d28d9", fontSize: 20, fontWeight: "700", marginRight: 6 },
  newButtonText: { color: "#4c1d7b", fontSize: 14, fontWeight: "800" },
  disabled: { opacity: 0.45 },
  body: { backgroundColor: "#f7f4fa", borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -24, minHeight: 500, paddingHorizontal: 18, paddingTop: 22 },
  metrics: { flexDirection: "row", gap: 10, marginBottom: 26 },
  metric: { backgroundColor: "#fff", borderRadius: 16, flex: 1, overflow: "hidden", padding: 13 },
  metricAccent: { borderRadius: 2, height: 4, marginBottom: 10, width: 26 },
  metricValue: { color: "#241b2f", fontSize: 23, fontWeight: "900" },
  metricLabel: { color: "#82788d", fontSize: 10, fontWeight: "700", marginTop: 2 },
  feedback: { alignItems: "center", borderRadius: 13, flexDirection: "row", justifyContent: "space-between", marginBottom: 18, padding: 13 },
  feedbackSuccess: { backgroundColor: "#e4f7ed" },
  feedbackError: { backgroundColor: "#ffebed" },
  feedbackText: { color: "#3d3348", flex: 1, fontSize: 13, fontWeight: "700" },
  feedbackClose: { color: "#62586f", fontSize: 20, marginLeft: 8 },
  sectionHeader: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between", marginBottom: 11 },
  sectionEyebrow: { color: "#7c3aed", fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  sectionTitle: { color: "#241b2f", fontSize: 26, fontWeight: "900", marginTop: 2 },
  count: { backgroundColor: "#e9e2ef", borderRadius: 999, color: "#62586f", fontSize: 12, fontWeight: "800", minWidth: 30, paddingHorizontal: 9, paddingVertical: 6, textAlign: "center" },
  list: { marginTop: 14 },
  centerState: { alignItems: "center", paddingHorizontal: 25, paddingVertical: 54 },
  stateText: { color: "#82788d", fontSize: 13, lineHeight: 19, marginTop: 10, textAlign: "center" },
  emptyIcon: { color: "#8b5bc2", fontSize: 42 },
  emptyTitle: { color: "#3d3348", fontSize: 17, fontWeight: "800", marginTop: 10 },
  errorState: { alignItems: "center", backgroundColor: "#fff", borderRadius: 18, marginTop: 18, padding: 24 },
  errorTitle: { color: "#3d3348", fontSize: 16, fontWeight: "800", textAlign: "center" },
  errorText: { color: "#82788d", fontSize: 13, lineHeight: 19, marginTop: 8, textAlign: "center" },
  apiText: { color: "#9b91a5", fontSize: 11, marginTop: 7 },
  retry: { backgroundColor: "#6d28d9", borderRadius: 10, marginTop: 16, paddingHorizontal: 16, paddingVertical: 11 },
  retryText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  warning: { color: "#8a5a00", fontSize: 12, lineHeight: 18, paddingBottom: 24, textAlign: "center" },
});
