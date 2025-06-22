import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useCaja } from "../../context/CajaContext";

export default function AperturaCaja() {
  const { abrirCaja } = useCaja();
  const [oro, setOro] = useState("");
  const [efectivo, setEfectivo] = useState("");

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

    Alert.alert("Caja abierta", `Inicio con ${oroInicial}g de oro y S/${efectivoInicial}`);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>📦 Apertura de Caja</Text>

      <Text>Oro inicial (g):</Text>
      <TextInput
        keyboardType="numeric"
        value={oro}
        onChangeText={setOro}
        style={{ borderBottomWidth: 1, marginBottom: 12 }}
      />

      <Text>Efectivo inicial (S/):</Text>
      <TextInput
        keyboardType="numeric"
        value={efectivo}
        onChangeText={setEfectivo}
        style={{ borderBottomWidth: 1, marginBottom: 12 }}
      />

      <Button title="Abrir Caja" onPress={abrir} />
    </View>
  );
}
