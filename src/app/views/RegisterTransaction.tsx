import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import InputField from "../components/InputField";
import BrandCarousel from "../components/BrandCarousel";
import { calcularValores, ValoresEntrada } from "../../utils/calculadora";
import { formatNumber } from "../../utils/format";
import { useCaja } from "../../context/CajaContext";
import uuid from "react-native-uuid";

export default function RegistroTransaccion({ darkMode }: { darkMode: boolean }) {
  const { agregarTransaccion, apertura } = useCaja();
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
    grams,
    valido,
  } = calcularValores(inputs); // <- Asegúrate de que grams esté en el retorno

  const registrar = () => {
    if (!valido || !apertura) {
      Alert.alert("Error", "Verifica los datos o abre la caja primero.");
      return;
    }

    const transaccion = {
      id: uuid.v4().toString(),
      hora: new Date().toLocaleTimeString(),
      gramos: grams,
      precioGramo: pricePerGramPEN,
      totalPEN: totalPEN,
    };

    agregarTransaccion(transaccion);

    Alert.alert(
      "Transacción registrada",
      `S/${formatNumber(totalPEN)} por ${grams.toFixed(2)}g`
    );

    // Limpiar inputs
    setInputs({
      pricePerOz: "",
      exchangeRate: "",
      purity: "",
      grams: "",
      discountPercentage: "",
    });

    setShowModal(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: darkMode ? "black" : "#cce4ff",
        padding: 16,
      }}
    >
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

        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{
            backgroundColor: "#0275d8",
            paddingVertical: 10,
            borderRadius: 10,
            marginTop: 16,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Registrar transacción
          </Text>
        </TouchableOpacity>

        {isScanning && (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0275d8" />
            <Text style={{ marginTop: 8, color: darkMode ? "white" : "black" }}>
              Generando recibo...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal visible={showModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: darkMode ? "#111" : "#fff",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 8,
                color: darkMode ? "white" : "black",
              }}
            >
              Confirmar transacción
            </Text>
            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Total: S/{formatNumber(totalPEN)}
            </Text>
            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Gramos: {grams.toFixed(2)}
            </Text>
            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Precio por gramo: S/{formatNumber(pricePerGramPEN)}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{
                  padding: 10,
                  backgroundColor: "#ccc",
                  borderRadius: 6,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={registrar}
                style={{
                  padding: 10,
                  backgroundColor: "#28a745",
                  borderRadius: 6,
                }}
              >
                <Text style={{ fontWeight: "bold", color: "white" }}>
                  Confirmar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
