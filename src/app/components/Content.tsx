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
  ActivityIndicator,
} from "react-native";

import InputField from "./InputField";
import BrandCarousel from "./BrandCarousel";

import { BleManager } from "react-native-ble-plx";
import { Buffer } from "buffer";
const manager = new BleManager();



type Props = { darkMode: boolean };

export default function Content({ darkMode }: Props) {
  const [pricePerOz, setPricePerOz] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [purity, setPurity] = useState("");
  const [grams, setGrams] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Nuevo estado para control de escaneo/imprimiendo
  const [isScanning, setIsScanning] = useState(false);

  const parse = (val: string) => parseFloat(val.replace(",", ".")) || 0;

  const oz = parse(pricePerOz);
  const rate = parse(exchangeRate);
  const pur = parse(purity);
  const g = parse(grams);
  const discount = parse(discountPercentage) / 100;

  const canCalculate = oz > 0 && rate > 0 && pur > 0;

  const pricePerGramUSD = (oz / 31.1035) * pur * (1 - discount);
  const pricePerGramPEN = pricePerGramUSD * rate;
  const totalUSD = pricePerGramUSD * g;
  const totalPEN = totalUSD * rate;

  const formatNumber = (n: number) =>
    n.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  async function imprimirRecibo() {
    if (!canCalculate || grams.trim() === "") {
      Alert.alert("Datos incompletos", "Por favor completa todos los campos antes de imprimir.");
      return;
    }
    if (isScanning) return; // evitar escanear de nuevo si ya está escaneando
    setIsScanning(true);

    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        if (
          granted["android.permission.BLUETOOTH_SCAN"] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted["android.permission.BLUETOOTH_CONNECT"] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted["android.permission.ACCESS_FINE_LOCATION"] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert(
            "Permisos denegados",
            "Se requieren permisos de Bluetooth y ubicación."
          );
          setIsScanning(false);
          return;
        }
      }

      let timeoutId: NodeJS.Timeout | null = null;

      manager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          Alert.alert("Error de escaneo", error.message);
          setIsScanning(false);
          return;
        }

        if (device?.name?.includes("Printer")) {
          manager.stopDeviceScan();
          if (timeoutId) clearTimeout(timeoutId);

          try {
            const connectedDevice = await device.connect();
            await connectedDevice.discoverAllServicesAndCharacteristics();

            const services = await connectedDevice.services();
            for (const service of services) {
              const characteristics = await service.characteristics();
              for (const characteristic of characteristics) {
                if (characteristic.isWritableWithoutResponse) {
                  const recibo = 
`BMG Imports
Av. Siempre Viva 340
Tel: 921 363 786

Cantidad de gramos: ${grams}
Precio por gramo (USD): ${formatNumber(pricePerGramUSD)}
Precio por gramo (PEN): ${formatNumber(pricePerGramPEN)}
Total en USD: ${formatNumber(totalUSD)}
Total en PEN: ${formatNumber(totalPEN)}

Gracias por su compra.
`;

                  const data = Buffer.from(recibo, "utf-8").toString("base64");
                  await characteristic.writeWithoutResponse(data);
                  Alert.alert("Éxito", "Recibo impreso correctamente.");
                  setIsScanning(false);
                  return;
                }
              }
            }

            Alert.alert("Error", "No se encontró una característica escribible.");
            setIsScanning(false);
          } catch (connError: any) {
            Alert.alert("Error de conexión", connError.message);
            setIsScanning(false);
          }
        }
      });

      timeoutId = setTimeout(() => {
        manager.stopDeviceScan();
        Alert.alert("Tiempo agotado", "No se encontró la impresora.");
        setIsScanning(false);
      }, 10000);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Falló la impresión");
      setIsScanning(false);
    }
  }

  function clearAll() {
    setPricePerOz("");
    setExchangeRate("");
    setPurity("");
    setGrams("");
    setDiscountPercentage("");
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
          value={pricePerOz}
          setValue={setPricePerOz}
          placeholder="Ej: 1980.45"
          darkMode={darkMode}
        />
        <InputField
          label="Tipo de cambio (USD a PEN)"
          value={exchangeRate}
          setValue={setExchangeRate}
          placeholder="Ej: 3.75"
          darkMode={darkMode}
        />
        <InputField
          label="Ley del oro (pureza)"
          value={purity}
          setValue={setPurity}
          placeholder="Ej: 0.75"
          darkMode={darkMode}
        />
        <InputField
          label="% de descuento"
          value={discountPercentage}
          setValue={setDiscountPercentage}
          placeholder="Ej: 5"
          darkMode={darkMode}
        />
        <InputField
          label="Cantidad de gramos a calcular"
          value={grams}
          setValue={setGrams}
          placeholder="Ej: 10"
          darkMode={darkMode}
        />

        {canCalculate && (
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

        {/* Indicador de carga */}
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
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                marginBottom: 16,
                color: darkMode ? "white" : "black",
                textAlign: "center",
              }}
            >
              🧾 Recibo de Cálculo
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
                onPress={imprimirRecibo}
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
