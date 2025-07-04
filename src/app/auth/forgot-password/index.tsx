import React, { useState } from "react";
import { View, TextInput, Text, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const handlePasswordRecovery = async (): Promise<void> => {
    try {
      if (!email) {
        Alert.alert("Error", "Por favor ingresa tu correo electrónico.");
        return;
      }

      Alert.alert("Éxito", `Se ha enviado un enlace de recuperación a ${email}.`);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error al enviar el correo de recuperación:", error);
      Alert.alert("Error", "Hubo un problema al enviar el correo de recuperación.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#5A7FA0"
      />

      <Button title="Enviar correo de recuperación" onPress={handlePasswordRecovery} />

      <Text style={styles.link} onPress={() => router.push("/auth/login")}>
        Volver al inicio de sesión
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E0F0FF", // Azul claro de fondo
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#003366", // Azul oscuro
  },
  input: {
    height: 50,
    borderColor: "#99CCF3", // Borde azul suave
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F0F8FF", // Fondo azul muy claro
    color: "#003366",
    marginBottom: 15,
  },
  link: {
    textAlign: "center",
    color: "#1E90FF", // Azul brillante
    marginTop: 20,
    fontSize: 16,
  },
});
