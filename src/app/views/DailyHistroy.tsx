import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useCaja } from "../../context/CajaContext";
import { formatNumber } from "../../utils/format";

export default function HistorialDiario({ darkMode }: { darkMode: boolean }) {
  const { transacciones } = useCaja();

  const totalDelDia = transacciones.reduce((sum, t) => sum + t.totalPEN, 0);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#000" : "#eaf4ff" }]}>
      <Text style={[styles.titulo, { color: darkMode ? "white" : "black" }]}>Historial Diario</Text>

      {transacciones.length === 0 ? (
        <Text style={{ color: darkMode ? "white" : "black", textAlign: "center", marginTop: 20 }}>
          No hay transacciones registradas hoy.
        </Text>
      ) : (
        <>
          <FlatList
            data={transacciones}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: darkMode ? "#111" : "#fff" }]}>
                <Text style={[styles.label, { color: darkMode ? "white" : "black" }]}>Hora: {item.hora}</Text>
                <Text style={[styles.label, { color: darkMode ? "white" : "black" }]}>
                  Gramos: {item.gramos.toFixed(2)}g
                </Text>
                <Text style={[styles.label, { color: darkMode ? "white" : "black" }]}>
                  Precio por gramo: S/{formatNumber(item.precioGramo)}
                </Text>
                <Text style={[styles.label, { color: darkMode ? "#0f0" : "#008000", fontWeight: "bold" }]}>
                  Total: S/{formatNumber(item.totalPEN)}
                </Text>
              </View>
            )}
          />

          <View style={[styles.totalContainer, { backgroundColor: darkMode ? "#222" : "#dff0d8" }]}>
            <Text style={[styles.totalTexto, { color: darkMode ? "white" : "#333" }]}>
              Total del día: S/{formatNumber(totalDelDia)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalContainer: {
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  totalTexto: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
