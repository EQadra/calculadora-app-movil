import React, { useState } from "react";
import { View, TextInput, Text, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen(): JSX.Element {
  const [correo, setCorreo] = useState<string>("");
  const router = useRouter();

  const manejarRecuperacionContrasena = async (): Promise<void> => {
    try {
      if (!correo) {
        Alert.alert("Error", "Por favor ingresa tu correo electrónico.");
        return;
      }

      Alert.alert("Éxito", `Se ha enviado un enlace de recuperación a ${correo}.`);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error al enviar el correo de recuperación:", error);
      Alert.alert("Error", "Hubo un problema al enviar el correo de recuperación.");
    }
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Recuperar contraseña</Text>

      <TextInput
        style={estilos.entrada}
        placeholder="Ingresa tu correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#5A7FA0"
      />

      <Button
        title="Enviar correo de recuperación"
        onPress={manejarRecuperacionContrasena}
      />

      <Text style={estilos.enlace} onPress={() => router.push("/auth/login")}>
        Volver al inicio de sesión
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E0F0FF", // Fondo azul claro
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#003366", // Azul oscuro
  },
  entrada: {
    height: 50,
    borderColor: "#99CCF3", // Borde azul suave
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F0F8FF", // Fondo azul muy claro
    color: "#003366",
    marginBottom: 15,
  },
  enlace: {
    textAlign: "center",
    color: "#1E90FF", // Azul brillante
    marginTop: 20,
    fontSize: 16,
  },
});
