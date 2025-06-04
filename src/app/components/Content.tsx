import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import RNFS from 'react-native-fs';
import InputField from "./InputField";
import BrandCarousel from "./BrandCarousel";

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

import { calcularValores, ValoresEntrada } from "../utils/calculadora";
import { formatNumber } from "../utils/format";

type Props = { darkMode: boolean };



export default function Content({ darkMode }: Props) {
  // Estado para inputs
  const [inputs, setInputs] = useState<ValoresEntrada>({
    pricePerOz: "",
    exchangeRate: "",
    purity: "",
    grams: "",
    discountPercentage: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Handler para actualizar inputs
  const setValue = (key: keyof ValoresEntrada, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  // Calcular valores con la función importada
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
      if (Platform.OS === 'android' && Platform.Version < 30) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permiso de almacenamiento',
            message: 'Se necesita guardar el recibo en PDF para compartirlo o imprimirlo.',
            buttonNeutral: 'Preguntar luego',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permiso denegado', 'No se puede generar el PDF sin acceso al almacenamiento.');
          return;
        }
      }
  
      // Ruta local del logo (ajustada para Android/iOS)
      const logoPath = `${RNFS.MainBundlePath}/assets/Logo.png`;
  
      // Cargar la imagen en base64
      const base64Logo = await RNFS.readFile(logoPath, 'base64');
      const imageDataUri = `data:image/png;base64,${base64Logo}`;
  
      const htmlContent = `
        <html>
          <head>
            <style>
              @page {
                size: 4.8cm 6cm;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 8px;
                font-family: sans-serif;
                font-size: 10px;
              }
              h2 {
                text-align: center;
                font-size: 12px;
                margin: 4px 0;
              }
              .logo {
                width: 40px;
                height: 40px;
                display: block;
                margin: 0 auto 6px auto;
              }
              .section {
                margin-bottom: 6px;
              }
              .bold {
                font-weight: bold;
              }
              hr {
                border: 0;
                border-top: 1px solid #000;
                margin: 4px 0;
              }
              .center {
                text-align: center;
              }
            </style>
          </head>
          <body>
            <img src="${imageDataUri}" class="logo" />
            <h2>Recibo de Cálculo</h2>
            <hr />
            <div class="section center">
              <div class="bold">BMG Electronics</div>
              <div>Av Rafael Escardó 1143, San Miguel</div>
              <div>Tel: 912 184 269</div>
            </div>
            <hr />
            <div class="section">💰 Precio x gramo (USD): <span class="bold">$${pricePerGramUSD.toFixed(2)}</span></div>
            <div class="section">💰 Precio x gramo (PEN): <span class="bold">S/${pricePerGramPEN.toFixed(2)}</span></div>
            <hr />
            <div class="section">⚖️ Gramos: <span class="bold">${grams.toFixed(2)} g</span></div>
            <div class="section">💵 Total USD: <span class="bold">$${totalUSD.toFixed(2)}</span></div>
            <div class="section">💵 Total PEN: <span class="bold">S/${totalPEN.toFixed(2)}</span></div>
            <hr />
            <div class="center">Gracias por su preferencia</div>
          </body>
        </html>
      `;
  
      const options = {
        html: htmlContent,
        fileName: 'recibo_oro',
        directory: 'Documents',
      };
  
      const file = await RNHTMLtoPDF.convert(options);
  
      await Share.open({
        url: `file://${file.filePath}`,
        type: 'application/pdf',
        failOnCancel: false,
      });
    } catch (error) {
      console.error('Error al imprimir o compartir:', error);
      Alert.alert('Error', 'No se pudo generar ni compartir el recibo.');
    }
  }
  
  

  function clearAll() {
    setInputs({
      pricePerOz: "",
      exchangeRate: "",
      purity: "",
      grams: "",
      discountPercentage: "",
    });
  }


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
            // Deshabilita si no hay valores válidos para calcular
            //disabled={!valido || isScanning}
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
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <Image source={require("../../../assets/Logo.png")} style={{ width: 38, height: 40 }} />
            </View>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 16,
                color: darkMode ? "white" : "black",
                textAlign: "center",
              }}
            >
              Recibo de Cálculo
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 16,
                color: darkMode ? "white" : "black",
                textAlign: "center",
              }}
            >
              BMG Electronics
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 16,
                color: darkMode ? "white" : "black",
                textAlign: "center",
              }}
            >
              Av Rafael escardo 1143, San Miguel.
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 16,
                color: darkMode ? "white" : "black",
                textAlign: "center",
              }}
            >
              Número de Contacto: 912  184 269
            </Text>

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
                disabled={isScanning}
              >
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => imprimirRecibo({
                  pricePerGramUSD,
                  pricePerGramPEN,
                  totalUSD,
                  totalPEN,
                  grams: Number(inputs.grams) || 0,
                })}
                style={[styles.button, { backgroundColor: "#83a4d4" }]}
                disabled={isScanning}
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
});
