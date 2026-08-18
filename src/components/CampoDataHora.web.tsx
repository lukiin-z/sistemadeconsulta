import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  value: Date;
  onChange: (value: Date) => void;
};

export default function CampoDataHora({ value, onChange }: Props) {
  function adjust(minutes: number) {
    onChange(new Date(value.getTime() + minutes * 60 * 1000));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.value}>
        {value.toLocaleDateString("pt-BR")} às{" "}
        {value.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
      </Text>
      <View style={styles.actions}>
        <Action label="-1 dia" onPress={() => adjust(-1440)} />
        <Action label="+1 dia" onPress={() => adjust(1440)} />
        <Action label="-30 min" onPress={() => adjust(-30)} />
        <Action label="+30 min" onPress={() => adjust(30)} />
      </View>
    </View>
  );
}

function Action({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: "#d9d4e5",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
  },
  value: { color: "#241b2f", fontSize: 16, fontWeight: "700", marginBottom: 10 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  action: { backgroundColor: "#f1eafe", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
  actionText: { color: "#6d28d9", fontSize: 12, fontWeight: "700" },
});
