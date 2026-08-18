import { ScrollView, Pressable, StyleSheet, Text } from "react-native";

import { StatusConsulta } from "../types/statusConsulta";

export type FiltroStatus = StatusConsulta | "todas";

const options: Array<{ value: FiltroStatus; label: string }> = [
  { value: "todas", label: "Todas" },
  { value: "agendada", label: "Agendadas" },
  { value: "confirmada", label: "Confirmadas" },
  { value: "realizada", label: "Realizadas" },
  { value: "cancelada", label: "Canceladas" },
];

export default function FiltrosStatus({
  value,
  onChange,
}: {
  value: FiltroStatus;
  onChange: (value: FiltroStatus) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 4 },
  chip: { backgroundColor: "#ede9f4", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 },
  chipSelected: { backgroundColor: "#6d28d9" },
  text: { color: "#62586f", fontSize: 13, fontWeight: "700" },
  textSelected: { color: "#fff" },
});
