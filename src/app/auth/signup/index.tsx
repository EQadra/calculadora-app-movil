import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import CustomButton from "../../components/CustomButton";

const SignupScreen = () => {
  const router = useRouter();

  // ✅ Cambiado "personal" a "usuario"
  const [selectedForm, setSelectedForm] = useState("usuario");

  const [formData, setFormData] = useState({
    usuario: { name: "", email: "", password: "", repeatPassword: "", correo: "" },
    abogado: { name: "", email: "", password: "", repeatPassword: "", correo: "", codigoAbogado: "" },
    doctor: { name: "", email: "", password: "", repeatPassword: "", correo: "", codigoDoctor: "" },
    asociacion: { name: "", email: "", password: "", repeatPassword: "", correo: "", ruc: "", codigoAsociacion: "" },
    tienda: { name: "", email: "", password: "", repeatPassword: "", correo: "", ruc: "" },
    other: { description: "", email: "", password: "" },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [selectedForm]: { ...prev[selectedForm], [field]: value },
    }));
  };

  const handleSignup = () => {
    const data = formData[selectedForm];

    if (!data.email || !data.password || !data.repeatPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    if (data.password !== data.repeatPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Signup with:", data);

    router.push({
      pathname: "/login",
      params: { email: data.email },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <Picker
        selectedValue={selectedForm}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedForm(itemValue)}
      >
        <Picker.Item label="User" value="usuario" />
        <Picker.Item label="Abogado" value="abogado" />
        <Picker.Item label="Doctor" value="doctor" />
        <Picker.Item label="Asociación" value="asociacion" />
        <Picker.Item label="Store" value="tienda" />
        {/* <Picker.Item label="Other" value="other" /> */}
      </Picker>

      {/* ✅ Verificamos que exista la clave seleccionada */}
      {formData[selectedForm] &&
        Object.keys(formData[selectedForm]).map((field) => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[selectedForm][field]}
            onChangeText={(value) => handleInputChange(field, value)}
            secureTextEntry={field === "password" || field === "repeatPassword"}
          />
        ))}

      <CustomButton title="Sign Up" onPress={handleSignup} />

      <TouchableOpacity onPress={() => router.push("/login")}>
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
    backgroundColor: "#DFF5E1", // Fondo verde pastel
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2F4F4F", // Verde oscuro para contraste
  },
  picker: {
    height: 50,
    marginBottom: 15,
    backgroundColor: "#C2E5D3",
    borderRadius: 8,
    color: "#2F4F4F",
  },
  input: {
    height: 50,
    borderColor: "#A3D9A5", // Verde claro para bordes
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#E9F7EF", // Fondo verde muy claro
    color: "#2F4F4F",
  },
  link: {
    color: "#388E3C", // Verde más fuerte para enlaces
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
  },
});


export default SignupScreen;
