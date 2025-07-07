import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { LinearGradient } from "expo-linear-gradient";

import InputField from "../../components/InputField";
import BrandCarousel from "../../components/BrandCarousel";
import { calcularValores, ValoresEntrada } from "../../../utils/calculadora";
import { formatNumber } from "../../../utils/format";
import { useDarkMode } from "../../../context/DarkModeContext";

const screenWidth = Dimensions.get("window").width;
const columnWidth = (screenWidth - 48) / 2;

export default function RegisterTransactionScreen(): JSX.Element {
  const { darkMode } = useDarkMode();

  const [inputs, setInputs] = useState<ValoresEntrada>({
    pricePerOz: "",
    exchangeRate: "",
    purity: "",
    grams: "",
    discountPercentage: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const setValue = (key: keyof ValoresEntrada, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const {
    pricePerGramUSD,
    pricePerGramPEN,
    totalUSD,
    totalPEN,
    valido,
  } = calcularValores(inputs);

  const clearAll = () => {
    setInputs({
      pricePerOz: "",
      exchangeRate: "",
      purity: "",
      grams: "",
      discountPercentage: "",
    });
  };

  const imprimirRecibo = async ({
    pricePerGramUSD,
    pricePerGramPEN,
    totalUSD,
    totalPEN,
    grams,
  }: {
    pricePerGramUSD: number;
    pricePerGramPEN: number;
    totalUSD: number;
    totalPEN: number;
    grams: number;
  }) => {
    try {
      const htmlContent = `
      <html>
      <head>
        <style>
          @page { size: 80mm 100mm; margin: 0; }
          body {
            font-family: sans-serif;
            width: 80mm;
            height: 100mm;
            padding: 8px;
            font-size: 12px;
            box-sizing: border-box;
            margin: 0;
          }
          h1 {
            text-align: center;
            font-size: 16px;
            margin: 0 0 6px 0;
          }
          h2 {
            text-align: center;
            font-size: 14px;
            margin-bottom: 4px;
          }
          p{
            text-align: left;
            font-size: 16px;
            margin: 0 0 6px 0;
          }
          .section { margin-bottom: 4px; }
          .bold { font-weight: bold; }
          .center { text-align: center; }
          hr { margin: 4px 0; }
        </style>
      </head>
      <body>
        <h1>📟 BMG Electronics</h1>
        <div class="center">
          <h2>📍 Av Rafael Escardó 1143</h2>
          <h2>🏙️ San Miguel - Lima</h2>
          <h2>📞 Tel: 912 184 269</h2>
        </div>
        <hr />
        <p>💲 Precio x gr (USD): ${formatNumber(pricePerGramUSD)}</p>
        <p>💰 Precio x gr (PEN): ${formatNumber(pricePerGramPEN)}</p>
        <p>⚖️ Gramos: ${formatNumber(grams)} g</p>
        <hr />
        <p>🧾 Total USD: $${formatNumber(totalUSD)}</p>
        <p>💳 Total PEN: S/ ${formatNumber(totalPEN)}</p>
        <hr />
        <p class="center">🎉 ¡Gracias por su preferencia!</p>
      </body>
      </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert("Compartir no está disponible en este dispositivo.");
      }
    } catch (err) {
      console.error("Error al imprimir:", err);
      Alert.alert("Error", "No se pudo imprimir.");
    }
  };

  return (
    <LinearGradient
      colors={darkMode ? ["#0a0f1c", "#1a1f2c"] : ["#0056b3", "#007bff"]}
      style={{ flex: 1, padding: 16 }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={[styles.yellowText, { fontSize: 16, fontWeight: "bold", textAlign: "center", marginBottom: 6 }]}>Calculadora de Oro</Text>

        <BrandCarousel />

        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {[
            ["pricePerOz", " onza", "Ej: 1980.45"],
            ["exchangeRate", "TC USD", "Ej: 3.75"],
            ["purity", "Ley", "Ej: 0.75"],
            ["discountPercentage", "%", "Ej: 5"],
            ["grams", "Gramos", "Ej: 10"], // 👈 en columna
          ].map(([key, label, placeholder], index) => (
            <View
              key={key}
              style={{
                width: columnWidth,
                marginBottom: 2,
                marginRight: index % 2 === 0 ? 8 : 0,
              }}
            >
              <InputField
                label={label}
                value={inputs[key as keyof ValoresEntrada]}
                setValue={(v) => setValue(key as keyof ValoresEntrada, v)}
                placeholder={placeholder}
                darkMode={darkMode}
                labelStyle={styles.yellowText}
              />
            </View>
          ))}
        </View>

        {valido && (
          <View style={{ backgroundColor: darkMode ? "#1c2b3a" : "#969292", borderRadius: 5, padding: 16, marginTop: 6 }}>
            <Text style={[styles.yellowText, { marginBottom: 8 }]}>💲 Precio por gramo (USD): {formatNumber(pricePerGramUSD)}</Text>
            <Text style={[styles.yellowText, { marginBottom: 8 }]}>🇵🇪 Precio por gramo (PEN): {formatNumber(pricePerGramPEN)}</Text>
            {Number(inputs.grams) > 0 && (
              <Text style={styles.yellowText}>🧾 Total en PEN: {formatNumber(totalPEN)}</Text>
            )}
          </View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
          <TouchableOpacity
            onPress={clearAll}
            style={{ flex: 1, backgroundColor: "#d9534f", paddingVertical: 6, borderRadius: 6, marginRight: 8 }}
            disabled={isScanning}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontSize: 13, fontWeight: "500" }}>Limpiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{ flex: 1, backgroundColor: "#0056b3", paddingVertical: 6, borderRadius: 6, marginLeft: 8 }}
            disabled={isScanning}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontSize: 13, fontWeight: "500" }}>Ver Recibo</Text>
          </TouchableOpacity>
        </View>

        {isScanning && (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0275d8" />
            <Text style={{ marginTop: 8, color: "#ffde59" }}>Escaneando impresora e imprimiendo...</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? "#1c2b3a" : "#1D4ED8" }]}>
            <Text style={[styles.modalTitle, styles.yellowText]}>Recibo</Text>
            {["BMG Electronics", "Av Rafael Escardó 1143, San Miguel", "Número de Contacto: 912 184 269"].map((text, i) => (
              <Text key={i} style={[styles.modalSubText, styles.yellowText]}>{text}</Text>
            ))}

            <Text style={[styles.yellowText, { marginBottom: 8 }]}>Precio por gramo (USD): {formatNumber(pricePerGramUSD)}</Text>
            <Text style={[styles.yellowText, { marginBottom: 8 }]}>Precio por gramo (PEN): {formatNumber(pricePerGramPEN)}</Text>
            <Text style={[styles.yellowText, { marginBottom: 8 }]}>Gramos calculados: {formatNumber(Number(inputs.grams))} g</Text>
            <Text style={[styles.yellowText, { marginBottom: 8 }]}>Total en USD: {formatNumber(totalUSD)}</Text>
            <Text style={[styles.yellowText, { marginBottom: 8 }]}>Total en PEN: {formatNumber(totalPEN)}</Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={[styles.button, { backgroundColor: "#555", paddingVertical: 6 }]}
              >
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => imprimirRecibo({ pricePerGramUSD, pricePerGramPEN, totalUSD, totalPEN, grams: Number(inputs.grams) || 0 })}
                style={[styles.button, { backgroundColor: "#83a4d4", paddingVertical: 6 }]}
              >
                <Text style={[styles.buttonText, { color: "#000" }]}>Imprimir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    borderRadius: 12,
    padding: 24,
    borderWidth: 2,
    borderColor: "#ffde59",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  modalSubText: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  yellowText: {
    color: "#ffde59",
  },
});
