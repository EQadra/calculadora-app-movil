import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "../../components/CustomButton";

const SignupScreen = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    correo: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignup = () => {
    const { email, password, repeatPassword } = formData;

    if (!email || !password || !repeatPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    if (password !== repeatPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Signup with:", formData);

    router.push({
      pathname: "/login",
      params: { email },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {Object.keys(formData).map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={formData[field as keyof typeof formData]}
          onChangeText={(value) => handleInputChange(field, value)}
          secureTextEntry={field === "password" || field === "repeatPassword"}
        />
      ))}

      <CustomButton title="Sign Up" onPress={handleSignup} />

      <TouchableOpacity onPress={() => router.push("auth/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E0F0FF", // Celeste muy claro
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#003366", // Azul oscuro para contraste
  },
  input: {
    height: 50,
    borderColor: "#99CCF3", // Azul suave para bordes
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#F0F8FF", // Azul muy claro
    color: "#003366",
  },
  link: {
    color: "#1E90FF", // Azul brillante para enlaces
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
  },
});

export default SignupScreen;
