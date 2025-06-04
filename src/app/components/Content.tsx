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

import InputField from "./InputField";
import BrandCarousel from "./BrandCarousel";

import { BleManager, Device } from "react-native-ble-plx";
import { Buffer } from "buffer";
const manager = new BleManager();



type Props = { darkMode: boolean };


async function requestBluetoothPermission(): Promise<boolean> {
  if (Platform.OS === "android" && Platform.Version >= 23) {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    return (
      granted["android.permission.BLUETOOTH_CONNECT"] === PermissionsAndroid.RESULTS.GRANTED &&
      granted["android.permission.BLUETOOTH_SCAN"] === PermissionsAndroid.RESULTS.GRANTED
    );
  }

  return true; // iOS u otras versiones de Android no requieren permisos adicionales
}

//----------------------------------------------------------------------

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


  //-------------------------------------------------
async function imprimirReciboBLE(deviceId: string, message: string, setIsScanning: (val: boolean) => void) {
  try {
    setIsScanning(true);

    // 1. Conectar al dispositivo
    const device = await manager.connectToDevice(deviceId);
    await device.discoverAllServicesAndCharacteristics();

    // 2. Obtener servicios y características
    const services = await device.services();
    let printed = false;

    for (const service of services) {
      const characteristics = await service.characteristics();

      for (const char of characteristics) {
        if (char.isWritableWithoutResponse || char.isWritableWithResponse) {
          // 3. Codificamos y enviamos el texto
          const data = Buffer.from(message, "utf-8").toString("base64");
          await manager.writeCharacteristicWithResponseForDevice(
            device.id,
            service.uuid,
            char.uuid,
            data
          );
          printed = true;
          break;
        }
      }
      if (printed) break;
    }

    Alert.alert("Éxito", "El recibo ha sido enviado a la impresora.");
  } catch (error) {
    console.error("Error al imprimir:", error);
    Alert.alert("Error", "No se pudo imprimir el recibo.");
  } finally {
    setIsScanning(false);
  }
}
//------------------------------------------------
function generarReciboTexto({
  pricePerGramUSD,
  pricePerGramPEN,
  totalUSD,
  totalPEN,
}: {
  pricePerGramUSD: number;
  pricePerGramPEN: number;
  totalUSD: number;
  totalPEN: number;
}) {
  const format = (n: number) =>
    n.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return `
  ===== BMG Electronics =====
  Av Rafael Escardo 1143, San Miguel
  Tel: 912 184 269

  Precio x gramo (USD): ${format(pricePerGramUSD)}
  Precio x gramo (PEN): ${format(pricePerGramPEN)}
  Total en USD: ${format(totalUSD)}
  Total en PEN: ${format(totalPEN)}

  Gracias por su compra
  ==========================
  `;
}

  const formatNumber = (n: number) =>
    n.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    async function imprimirRecibo() {
      const permiso = await requestBluetoothPermission();
      if (!permiso) {
        Alert.alert("Permiso denegado", "Por favor habilita Bluetooth y permisos.");
        return;
      }
    
      const textoRecibo = generarReciboTexto({
        pricePerGramUSD,
        pricePerGramPEN,
        totalUSD,
        totalPEN,
      });
    
      const printerId = "DC:OD:51:40:B7:AB"; // Tu dirección
      await imprimirReciboBLE(printerId, textoRecibo, setIsScanning);
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
          <View className="flex-row items-center gap-3 flex-1">
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
