import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, TextInput, Text, Button } from "react-native";
import { useAuth } from "../../../context/AuthProvider";

export default function LoginScreen(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { login } = useAuth();

  const { selectedCountry } = useLocalSearchParams<{
    selectedCountry?: string;
  }>();

  const handleLogin = async (): Promise<void> => {
    try {
      await login(email, password);
      router.push("/views/register-transaction");
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  return (
    <View className="flex-1 justify-start p-5 bg-blue-100" style={{ paddingTop: 80 }}>
      <Text className="text-3xl font-bold text-center mb-9 text-blue-700">
        BMG ELECTRONICS SYSTEM
      </Text>

      <TextInput
        className="h-12 border border-blue-300 mb-4 px-4 py-2 rounded bg-blue-50 text-blue-800"
        placeholder="Correo electrónico"
        placeholderTextColor="#5A9BD5"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="h-12 border border-blue-300 mb-4 px-4 py-2 rounded bg-blue-50 text-blue-800"
        placeholder="Contraseña"
        placeholderTextColor="#5A9BD5"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View className="mb-4">
        <Button
          title="Ingresar"
          color="#1E90FF"
          onPress={handleLogin}
        />
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
