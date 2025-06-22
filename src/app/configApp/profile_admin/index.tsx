import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function NuevaAsociacion() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    logo_url: "",
    legal_status: false,
  });

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permiso requerido", "Se necesita permiso para acceder a tus fotos.");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!pickerResult.canceled) {
      setForm({ ...form, logo_url: pickerResult.assets[0].uri });
    }
  };

  const handleDeleteImage = () => {
    setForm({ ...form, logo_url: "" });
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      Alert.alert("Campo requerido", "El nombre de la asociación es obligatorio.");
      return;
    }

    const dataToSend = {
      ...form,
      verified_at: null,
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Asociación enviada:", dataToSend);
    Alert.alert("Éxito", "Asociación creada correctamente.");

    setForm({ name: "", description: "", logo_url: "", legal_status: false });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Asociación</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la asociación"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción"
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {form.logo_url ? "Cambiar Imagen" : "Seleccionar Logo"}
        </Text>
      </TouchableOpacity>

      {form.logo_url ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: form.logo_url }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteImage}>
            <Text style={styles.deleteButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>¿Cuenta con estatus legal?</Text>
        <Switch
          value={form.legal_status}
          onValueChange={(value) => setForm({ ...form, legal_status: value })}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Guardar Asociación</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backLink}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f7f9fc",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageButton: {
    backgroundColor: "#008080",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageContainer: {
    alignSelf: "center",
    position: "relative",
    marginBottom: 16,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  deleteButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#ff4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  switchLabel: {
    flex: 1,
    fontSize: 16,
    color: "#555",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  backLink: {
    textAlign: "center",
    color: "#0066cc",
    marginTop: 10,
  },
});
