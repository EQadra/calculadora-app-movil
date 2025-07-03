import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ProfileModal from "../components/ProfileModal"; // Asegúrate que esta ruta sea correcta

type Props = {
  darkMode: boolean;
};

export default function Footer({ darkMode }: Props) {
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const menuItems = [
    {
      key: "inicio",
      label: "Inicio",
      icon: "home",
      onPress: () => router.push("/views/open-register"),
    },
    {
      key: "historial",
      label: "Historial",
      icon: "history",
      onPress: () => router.push("/views/daily-history"),
    },
    {
      key: "transaccion",
      label: "Transacción",
      icon: "calculator",
      onPress: () => router.push("/views/register-transaction"),
    },
    {
      key: "perfil",
      label: "Perfil",
      icon: "user",
      onPress: () => setShowProfileModal(true),
    },
  ];

  return (
    <>
      <View
        style={{ paddingBottom: bottom }}
        className={`absolute bottom-0 left-0 right-0 px-4 h-17 pt-3 pb-2 flex-row justify-between items-center ${
          darkMode ? "bg-gray-800" : "bg-sky-500"
        }`}
      >
        {menuItems.map((item) => (
          <TouchableOpacity key={item.key} onPress={item.onPress}>
            <View className="items-center">
              <FontAwesome5 name={item.icon as any} size={16} color="white" />
              <Text className="text-xs text-white">{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ProfileModal visible={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </>
  );
}
