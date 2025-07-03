import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import InputField from "../../components/InputField";
import BrandCarousel from "../../components/BrandCarousel";
import { calcularValores, ValoresEntrada } from "../../../utils/calculadora";
import { formatNumber } from "../../../utils/format";

type Props = {
  darkMode: boolean;
};

export default function Content({ darkMode }: Props): JSX.Element {
  const [inputs, setInputs] = useState<ValoresEntrada>({
    pricePerOz: "",
    exchangeRate: "",
    purity: "",
    grams: "",
    discountPercentage: "",
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

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

  async function imprimirRecibo({
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
  }) {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              @page {
                size: 40mm 60mm;
                margin: 0;
              }
              body {
                font-family: sans-serif;
                width: 40mm;
                height: 60mm;
                padding: 8px;
                font-size: 12px;
                box-sizing: border-box;
                margin: 0;
              }
              h2 {
                text-align: center;
                font-size: 14px;
                margin-bottom: 4px;
              }
              .section {
                margin-bottom: 4px;
              }
              .bold {
                font-weight: bold;
              }
              .center {
                text-align: center;
              }
              hr {
                margin: 4px 0;
              }
            </style>
          </head>
          <body>
            <h2>Recibo de Cálculo</h2>
            <hr />
            <div class="center">
              <div class="bold">BMG Electronics</div>
              <div>Av Rafael Escardó 1143, San Miguel</div>
              <div>Tel: 912 184 269</div>
            </div>
            <hr />
            <div class="section">💰 Precio x gramo (USD): <span class="bold">$${pricePerGramUSD.toFixed(2)}</span></div>
            <div class="section">💰 Precio x gramo (PEN): <span class="bold">S/${pricePerGramPEN.toFixed(2)}</span></div>
            <div class="section">⚖️ Gramos: <span class="bold">${grams.toFixed(2)} g</span></div>
            <div class="section">💵 Total USD: <span class="bold">$${totalUSD.toFixed(2)}</span></div>
            <div class="section">💵 Total PEN: <span class="bold">S/${totalPEN.toFixed(2)}</span></div>
            <hr />
            <div class="center">Gracias por su preferencia</div>
          </body>
        </html>
      `;
  
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
  
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        alert("Compartir no está disponible en este dispositivo.");
        return;
      }
  
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error al generar o compartir el recibo:", error);
      Alert.alert("Error", "No se pudo generar ni compartir el recibo.");
    }
  }
  

  const clearAll = () => {
    setInputs({
      pricePerOz: "",
      exchangeRate: "",
      purity: "",
      grams: "",
      discountPercentage: "",
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? "black" : "#cce4ff", padding: 16 }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: darkMode ? "white" : "black",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Calculadora de Oro
        </Text>

        <BrandCarousel />

        <InputField
          label="Precio de la onza (USD)"
          value={inputs.pricePerOz}
          setValue={(v) => setValue("pricePerOz", v)}
          placeholder="Ej: 1980.45"
          darkMode={darkMode}
        />
        <InputField
          label="Tipo de cambio (USD a PEN)"
          value={inputs.exchangeRate}
          setValue={(v) => setValue("exchangeRate", v)}
          placeholder="Ej: 3.75"
          darkMode={darkMode}
        />
        <InputField
          label="Ley del oro (pureza)"
          value={inputs.purity}
          setValue={(v) => setValue("purity", v)}
          placeholder="Ej: 0.75"
          darkMode={darkMode}
        />
        <InputField
          label="% de descuento"
          value={inputs.discountPercentage}
          setValue={(v) => setValue("discountPercentage", v)}
          placeholder="Ej: 5"
          darkMode={darkMode}
        />
        <InputField
          label="Cantidad de gramos a calcular"
          value={inputs.grams}
          setValue={(v) => setValue("grams", v)}
          placeholder="Ej: 10"
          darkMode={darkMode}
        />

        {valido && (
          <View
            style={{
              backgroundColor: darkMode ? "#222" : "#f0f0f0",
              borderRadius: 5,
              padding: 16,
              marginTop: 6,
            }}
          >
            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Precio por gramo (USD): {formatNumber(pricePerGramUSD)}
            </Text>
            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Precio por gramo (PEN): {formatNumber(pricePerGramPEN)}
            </Text>
            <Text style={{ color: darkMode ? "white" : "black" }}>
              Total en PEN: {formatNumber(totalPEN)}
            </Text>
          </View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
          <TouchableOpacity
            onPress={clearAll}
            style={{
              flex: 1,
              backgroundColor: "#d9534f",
              paddingVertical: 8,
              borderRadius: 8,
              marginRight: 8,
            }}
            disabled={isScanning}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>Limpiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{
              flex: 1,
              backgroundColor: "#0275d8",
              paddingVertical: 8,
              borderRadius: 8,
              marginLeft: 8,
            }}
            disabled={isScanning}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>Ver Recibo</Text>
          </TouchableOpacity>
        </View>

        {isScanning && (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0275d8" />
            <Text style={{ marginTop: 8, color: darkMode ? "white" : "black" }}>
              Escaneando impresora e imprimiendo...
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? "#111" : "white" }]}>

            <Text style={[styles.modalTitle, { color: darkMode ? "white" : "black" }]}>
              Recibo de Cálculo
            </Text>
            <Text style={styles.modalSubText}>BMG Electronics</Text>
            <Text style={styles.modalSubText}>Av Rafael Escardó 1143, San Miguel</Text>
            <Text style={styles.modalSubText}>Número de Contacto: 912 184 269</Text>

            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Precio por gramo (USD): {formatNumber(pricePerGramUSD)}
            </Text>
            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Precio por gramo (PEN): {formatNumber(pricePerGramPEN)}
            </Text>
            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Total en USD: {formatNumber(totalUSD)}
            </Text>
            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Total en PEN: {formatNumber(totalPEN)}
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={[styles.button, { backgroundColor: "#555" }]}
              >
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  imprimirRecibo({
                    pricePerGramUSD,
                    pricePerGramPEN,
                    totalUSD,
                    totalPEN,
                    grams: Number(inputs.grams) || 0,
                  })
                }
                style={[styles.button, { backgroundColor: "#83a4d4" }]}
              >
                <Text style={[styles.buttonText, { color: "black" }]}>Imprimir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    borderRadius: 10,
    padding: 24,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
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
    color: "#888",
  },
});