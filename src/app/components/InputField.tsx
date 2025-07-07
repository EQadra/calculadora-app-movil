import React from "react";
import { View, Text, TextInput, TextStyle } from "react-native";

type Props = {
  label: string;
  value: string;
  setValue: (val: string) => void;
  placeholder: string;
  darkMode: boolean;
  labelStyle?: TextStyle; // 💡 opcional para personalizar el estilo del label
};

export default function InputField({
  label,
  value,
  setValue,
  placeholder,
  darkMode,
  labelStyle,
}: Props) {
  const yellowText = "#ffde59"; // 🎨 color amarillo fijo

  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={[
          { color: yellowText, marginBottom: 4 },
          labelStyle, // opcional para sobreescribir si lo necesitas
        ]}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        keyboardType="numeric"
        placeholderTextColor={darkMode ? "#ccc" : "#888"}
        style={{
          backgroundColor: darkMode ? "#333" : "white",
          color: darkMode ? "#fff" : "#000",
          padding: 5,
          borderRadius: 6,
        }}
      />
    </View>
  );
}
