import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useDarkMode } from "../../../context/DarkModeContext"; // ← Ajusta la ruta si es necesario

const screenWidth = Dimensions.get("window").width;

const summaryCards = [
  { title: "Ventas", value: "S/ 12,000" },
  { title: "Compras", value: "S/ 8,500" },
  { title: "Ganancia", value: "S/ 3,500" },
];

const pieData = [
  { name: "Oro", population: 6000, color: "#facc15", legendFontColor: "#fff", legendFontSize: 12 },
  { name: "Plata", population: 3000, color: "#a3e635", legendFontColor: "#fff", legendFontSize: 12 },
  { name: "Otros", population: 3000, color: "#38bdf8", legendFontColor: "#fff", legendFontSize: 12 },
];

const badges = [
  { id: 1, label: "Caja Abierta", status: "activo" },
  { id: 2, label: "Cierre Parcial", status: "pendiente" },
  { id: 3, label: "Caja Cerrada", status: "finalizado" },
];

export default function ReportScreen() {
  const { darkMode } = useDarkMode(); // ✅ Usando contexto personalizado

  const styles = getStyles(darkMode);

  const backgroundColors = darkMode ? ["#0a0f1c", "#1a1f2c"] : ["#0056b3", "#007bff"];

  return (
    <LinearGradient colors={backgroundColors} style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 Reportes</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.cardContainer}>
          {summaryCards.map((card, index) => (
            <LinearGradient
              key={index}
              colors={darkMode ? ["#1e293b", "#334155"] : ["#172554", "#1e40af"]}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardValue}>{card.value}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* Pie Chart */}
        <PieChart
          data={pieData}
          width={screenWidth - 32}
          height={180}
          chartConfig={{
            color: () => "#fff",
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"16"}
          center={[10, 10]}
          absolute
        />

        {/* Badge List */}
        <View style={styles.badgeSection}>
          <Text style={styles.subTitle}>Estados de Caja</Text>
          <FlatList
            data={badges}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.badgeRow}>
                <LinearGradient
                  colors={["#facc15", "#fbbf24"]}
                  style={styles.badge}
                >
                  <Text style={styles.badgeText}>{item.label}</Text>
                </LinearGradient>
                <TouchableOpacity>
                  <Ionicons
                    name="ellipsis-vertical"
                    size={20}
                    color={darkMode ? "#e2e8f0" : "#fff"}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const getStyles = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      marginBottom: 20,
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#facc15",
    },
    cardContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 20,
    },
    card: {
      flex: 1,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
    },
    cardTitle: {
      color: "#facc15",
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 4,
    },
    cardValue: {
      color: darkMode ? "#e2e8f0" : "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    badgeSection: {
      marginTop: 20,
    },
    subTitle: {
      fontSize: 18,
      color: "#facc15",
      fontWeight: "600",
      marginBottom: 10,
    },
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: darkMode ? "#1e293b" : "#1e40af",
      padding: 10,
      borderRadius: 10,
      marginBottom: 8,
    },
    badge: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 16,
    },
    badgeText: {
      color: "#1e3a8a",
      fontWeight: "bold",
    },
  });
