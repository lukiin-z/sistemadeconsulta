import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Consulta } from "../interfaces/consulta";
import { StatusConsulta } from "../types/statusConsulta";
import { formatarDataHora, formatarMoeda } from "../utils/date";

const statusVisual: Record<StatusConsulta, { label: string; background: string; color: string }> = {
  agendada: { label: "Agendada", background: "#fff4d6", color: "#8a5a00" },
  confirmada: { label: "Confirmada", background: "#e7f8ef", color: "#147a45" },
  realizada: { label: "Realizada", background: "#e8efff", color: "#2556a8" },
  cancelada: { label: "Cancelada", background: "#ffebed", color: "#b42332" },
};

type Props = {
  consulta: Consulta;
  busy?: boolean;
  onStatusChange?: (status: StatusConsulta) => void;
};

export default function ConsultaCard({ consulta, busy = false, onStatusChange }: Props) {
  const visual = statusVisual[consulta.status];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.status, { backgroundColor: visual.background }]}>
          <Text style={[styles.statusText, { color: visual.color }]}>{visual.label}</Text>
        </View>
        <Text style={styles.date}>{formatarDataHora(consulta.dataHora)}</Text>
      </View>

      <View style={styles.professionalRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{consulta.medico.nome.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.grow}>
          <Text style={styles.doctor}>{consulta.medico.nome}</Text>
          <Text style={styles.specialty}>
            {consulta.medico.especialidade.nome} · {consulta.medico.crm}
          </Text>
        </View>
        <Text style={styles.price}>{formatarMoeda(consulta.valor)}</Text>
      </View>

      <View style={styles.divider} />
      <View style={styles.patientRow}>
        <Text style={styles.patientLabel}>Paciente</Text>
        <Text style={styles.patient}>{consulta.paciente.nome}</Text>
      </View>

      {consulta.observacoes && (
        <View style={styles.note}>
          <Text style={styles.noteText}>{consulta.observacoes}</Text>
        </View>
      )}

      {busy ? (
        <ActivityIndicator color="#6d28d9" style={styles.loading} />
      ) : onStatusChange ? (
        <Actions status={consulta.status} onStatusChange={onStatusChange} />
      ) : null}
    </View>
  );
}

function Actions({
  status,
  onStatusChange,
}: {
  status: StatusConsulta;
  onStatusChange: (status: StatusConsulta) => void;
}) {
  if (status === "cancelada" || status === "realizada") {
    return null;
  }

  return (
    <View style={styles.actions}>
      <ActionButton label="Cancelar" secondary onPress={() => onStatusChange("cancelada")} />
      {status === "agendada" ? (
        <ActionButton label="Confirmar" onPress={() => onStatusChange("confirmada")} />
      ) : (
        <ActionButton label="Marcar realizada" onPress={() => onStatusChange("realizada")} />
      )}
    </View>
  );
}

function ActionButton({
  label,
  secondary = false,
  onPress,
}: {
  label: string;
  secondary?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.button, secondary && styles.buttonSecondary]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderColor: "#eee9f2",
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
    padding: 18,
    shadowColor: "#251334",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  topRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
  status: { borderRadius: 999, paddingHorizontal: 11, paddingVertical: 6 },
  statusText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.4, textTransform: "uppercase" },
  date: { color: "#6e667a", fontSize: 12, fontWeight: "600" },
  professionalRow: { alignItems: "center", flexDirection: "row" },
  avatar: { alignItems: "center", backgroundColor: "#efe7ff", borderRadius: 24, height: 48, justifyContent: "center", marginRight: 12, width: 48 },
  avatarText: { color: "#6d28d9", fontSize: 19, fontWeight: "800" },
  grow: { flex: 1 },
  doctor: { color: "#241b2f", fontSize: 16, fontWeight: "800" },
  specialty: { color: "#756b80", fontSize: 12, marginTop: 3 },
  price: { color: "#241b2f", fontSize: 14, fontWeight: "800" },
  divider: { backgroundColor: "#eee9f2", height: 1, marginVertical: 14 },
  patientRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  patientLabel: { color: "#82788d", fontSize: 12 },
  patient: { color: "#3d3348", fontSize: 13, fontWeight: "700" },
  note: { backgroundColor: "#f8f5fb", borderRadius: 10, marginTop: 13, padding: 11 },
  noteText: { color: "#62586f", fontSize: 12, lineHeight: 18 },
  loading: { marginTop: 16 },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  button: { alignItems: "center", backgroundColor: "#6d28d9", borderRadius: 11, flex: 1, padding: 12 },
  buttonSecondary: { backgroundColor: "#f1ecf5" },
  buttonText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  buttonTextSecondary: { color: "#6e667a" },
});
