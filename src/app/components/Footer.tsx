import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  darkMode: boolean;
};

export default function Footer({ darkMode }: Props): JSX.Element {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={{ paddingBottom: bottom }}
      className={`absolute bottom-0 left-0 right-0 px-4 h-17 pt-3 pb-2 flex-row justify-between items-center ${darkMode ? "bg-gray-800" : "bg-sky-500"}`}
    >
      {[
        { label: "Inicio", icon: "home" },
        { label: "Historial", icon: "history" },
        { label: "Ajustes", icon: "cog" },
      ].map((item, idx) => (
        <TouchableOpacity key={idx} onPress={() => Alert.alert(item.label)}>
          <View className="items-center">
            <FontAwesome5 name={item.icon as any} size={16} color="white" />
            <Text className="text-xs text-white">{item.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
