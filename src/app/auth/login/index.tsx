import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, TextInput, Text, Button } from "react-native";
import { useAuth } from "../../../context/AuthProvider";

export default function LoginScreen(): JSX.Element {
  const [correo, setCorreo] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const router = useRouter();
  const { login } = useAuth();

  const { selectedCountry } = useLocalSearchParams<{
    selectedCountry?: string;
  }>();

  const manejarInicioSesion = async (): Promise<void> => {
    try {
      await login(correo, contrasena);
      router.push("/views/register-transaction");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <View className="flex-1 justify-center p-5 bg-blue-100">
      <Text className="text-3xl font-bold text-center mb-9 text-blue-700">
        BMG ORO
      </Text>

      <TextInput
        className="h-12 border border-blue-300 mb-4 px-4 py-2 rounded bg-blue-50 text-blue-800"
        placeholder="Correo electrónico"
        placeholderTextColor="#5A9BD5"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="h-12 border border-blue-300 mb-4 px-4 py-2 rounded bg-blue-50 text-blue-800"
        placeholder="Contraseña"
        placeholderTextColor="#5A9BD5"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />
      <View className="mb-4">
        <Button title="Iniciar sesión" color="#1E90FF" onPress={manejarInicioSesion} />
      </View>

      {selectedCountry && (
        <Text className="text-center mt-2 text-blue-700 font-medium">
          País seleccionado: {selectedCountry}
        </Text>
      )}

      <View className="mt-5">
        <Text
          className="text-center text-blue-600 underline"
          onPress={() => router.push("/auth/forgot-password")}
        >
          ¿Olvidaste tu contraseña?
        </Text>
        <Text
          className="text-center text-blue-600 underline mt-2"
          onPress={() => router.push("/auth/signup")}
        >
          ¿No tienes cuenta? Regístrate
        </Text>
      </View>
    </View>
  );
}
