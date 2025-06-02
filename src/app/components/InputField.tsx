import React from "react";
import { View, Text, TextInput } from "react-native";

type Props = {
  label: string;
  value: string;
  setValue: (val: string) => void;
  placeholder: string;
  darkMode: boolean;
};

export default function InputField({
  label,
  value,
  setValue,
  placeholder,
  darkMode,
}: Props) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: darkMode ? "white" : "black", marginBottom: 4 }}>
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
          color: darkMode ? "white" : "black",
          padding: 10,
          borderRadius: 6,
        }}
      />
    </View>
  );
}
