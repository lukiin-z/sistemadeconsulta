import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

type Props = {
  value: Date;
  onChange: (value: Date) => void;
};

export default function CampoDataHora({ value, onChange }: Props) {
  const [mode, setMode] = useState<"date" | "time" | null>(null);

  function handleChange(_event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === "android") {
      setMode(null);
    }
    if (selected) {
      onChange(selected);
    }
  }

  return (
    <View>
      <View style={styles.row}>
        <Pressable style={styles.field} onPress={() => setMode("date")}>
          <Text style={styles.label}>Data</Text>
          <Text style={styles.value}>{value.toLocaleDateString("pt-BR")}</Text>
        </Pressable>
        <Pressable style={styles.field} onPress={() => setMode("time")}>
          <Text style={styles.label}>Horário</Text>
          <Text style={styles.value}>
            {value.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </Pressable>
      </View>

      {mode && (
        <DateTimePicker
          value={value}
          mode={mode}
          minimumDate={new Date()}
          minuteInterval={15}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}

      {Platform.OS === "ios" && mode && (
        <Pressable style={styles.done} onPress={() => setMode(null)}>
          <Text style={styles.doneText}>Concluir seleção</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, marginBottom: 16 },
  field: {
    flex: 1,
    borderColor: "#d9d4e5",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  label: { color: "#6e667a", fontSize: 12, marginBottom: 4 },
  value: { color: "#241b2f", fontSize: 15, fontWeight: "700" },
  done: { alignItems: "center", padding: 10 },
  doneText: { color: "#6d28d9", fontWeight: "700" },
});
