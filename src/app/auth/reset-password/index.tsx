import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "../../components/CustomButton";

const LoginScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      alert("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    console.log("Iniciando sesión con:", { email, password, rememberEmail });
    router.push("/views/open-register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.optionsRow}>
        {/* Switch + Texto */}
        <View style={styles.leftOption}>
          <Switch
            value={rememberEmail}
            onValueChange={setRememberEmail}
            thumbColor={rememberEmail ? "#2563eb" : "#ccc"}
            trackColor={{ true: "#93c5fd", false: "#ccc" }}
          />
          <Text style={styles.rememberText}>Recordar correo</Text>
        </View>

        {/* Olvidaste contraseña */}
        <TouchableOpacity onPress={() => alert("Redirigir a recuperación...")}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>

      <CustomButton title="Entrar" onPress={handleLogin} />

      <TouchableOpacity onPress={() => router.push("/auth/signup")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#E0F0FF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#003366",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderColor: "#99CCF3",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    backgroundColor: "#F0F8FF",
    fontSize: 14,
    color: "#003366",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  leftOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#003366",
  },
  forgotText: {
    fontSize: 13,
    color: "#1E90FF",
  },
  link: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 14,
    color: "#1E90FF",
  },
});

export default LoginScreen;
