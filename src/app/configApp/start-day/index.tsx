import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Dimensions,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useCaja } from "../../../context/CajaContext";
import { useDarkMode } from "../../../context/DarkModeContext";

const initialLayout = { width: Dimensions.get("window").width };

// 👉 COMPONENTE: APERTURA DE CAJA
function AperturaCajaView() {
  const { abrirCaja } = useCaja();
  const [oro, setOro] = useState("");
  const [efectivo, setEfectivo] = useState("");
  const { darkMode } = useDarkMode();

  const abrir = () => {
    const oroInicial = parseFloat(oro);
    const efectivoInicial = parseFloat(efectivo);

    if (isNaN(oroInicial) || isNaN(efectivoInicial)) {
      Alert.alert("Error", "Debes ingresar valores válidos.");
      return;
    }

    abrirCaja({
      oroInicial,
      efectivoInicial,
      fecha: new Date().toISOString().split("T")[0],
    });

    Alert.alert(
      "Caja abierta",
      `Inicio con ${oroInicial}g de oro y S/${efectivoInicial}`
    );
    setOro("");
    setEfectivo("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>📦 Apertura de Caja</Text>

          <Text style={styles.label}>🪙 Oro inicial (g):</Text>
          <TextInput
            keyboardType="numeric"
            value={oro}
            onChangeText={setOro}
            placeholder="0.00"
            placeholderTextColor="gray"
            style={styles.input}
          />

          <Text style={styles.label}>💵 Efectivo inicial (S/):</Text>
          <TextInput
            keyboardType="numeric"
            value={efectivo}
            onChangeText={setEfectivo}
            placeholder="0.00"
            placeholderTextColor="gray"
            style={styles.input}
          />

          <Text
            onPress={abrir}
            style={styles.button}
          >
            Abrir Caja
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 👉 COMPONENTE: CIERRES HISTÓRICOS (SIMULADOS)
function HistorialCierres() {
  const cierres = [
    { fecha: "2025-07-06", oroFinal: 12.4, efectivoFinal: 1500 },
    { fecha: "2025-07-05", oroFinal: 10.2, efectivoFinal: 1270 },
  ];

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      {cierres.map((cierre, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.label}>📅 {cierre.fecha}</Text>
          <Text style={styles.label}>🪙 Oro Final: {cierre.oroFinal}g</Text>
          <Text style={styles.label}>
            💵 Efectivo Final: S/{cierre.efectivoFinal}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

// 👉 VISTA PRINCIPAL CON TABS Y GRADIENTE
export default function CajaView() {
  const { darkMode } = useDarkMode();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "apertura", title: "Apertura" },
    { key: "cierres", title: "Cierres" },
  ]);

  const renderScene = SceneMap({
    apertura: AperturaCajaView,
    cierres: HistorialCierres,
  });

  return (
    <LinearGradient
      colors={darkMode ? ["#0a0f1c", "#1a1f2c"] : ["#0056b3", "#007bff"]}
      style={{ flex: 1 }}
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "yellow" }}
            style={{ backgroundColor: "transparent" }}
            renderLabel={({ route, focused }) => (
              <Text style={{ color: "yellow", fontWeight: focused ? "bold" : "normal" }}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 1,
    borderColor: "yellow",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    color: "yellow",
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    color: "yellow",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "yellow",
    color: "yellow",
    marginBottom: 16,
    paddingVertical: 4,
  },
  button: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: "yellow",
    color: "#000",
    fontWeight: "bold",
    borderRadius: 6,
    textAlign: "center",
  },
});
