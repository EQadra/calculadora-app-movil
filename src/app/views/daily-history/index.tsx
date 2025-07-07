import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { formatNumber } from "../../../utils/format";
import { useDarkMode } from "../../../context/DarkModeContext";
import { LinearGradient } from "expo-linear-gradient";

export default function HistorialDiario() {
  const { darkMode } = useDarkMode();

  const transacciones = [
    {
      id: "1",
      hora: "09:15 AM",
      gramos: 10,
      precioGramo: 220,
      totalPEN: 2200,
    },
  ];

  const totalDelDia = transacciones.reduce((sum, t) => sum + t.totalPEN, 0);

  return (
    <LinearGradient
      colors={darkMode ? ["#0a0f1c", "#1a1f2c"] : ["#0056b3", "#007bff"]}
      style={styles.gradientContainer}
    >
      <Text style={styles.titulo}>Historial Diario</Text>

      {transacciones.length === 0 ? (
        <Text style={styles.textoVacio}>No hay transacciones registradas hoy.</Text>
      ) : (
        <>
          <FlatList
            data={transacciones}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.label}>Hora: {item.hora}</Text>
                <Text style={styles.label}>Gramos: {formatNumber(item.gramos)}g</Text>
                <Text style={styles.label}>
                  Precio por gramo: S/{formatNumber(item.precioGramo)}
                </Text>
                <Text style={styles.totalTransaccion}>
                  Total: S/{formatNumber(item.totalPEN)}
                </Text>
              </View>
            )}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalTexto}>Total del día: S/{formatNumber(totalDelDia)}</Text>
          </View>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "yellow",
  },
  textoVacio: {
    color: "yellow",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.56)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "yellow",
  },
  totalTransaccion: {
    fontSize: 14,
    fontWeight: "bold",
    color: "yellow",
    marginTop: 4,
  },
  totalContainer: {
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  totalTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "yellow",
  },
});
