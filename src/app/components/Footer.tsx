import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ProfileModal from "../components/ProfileModal";
import { useDarkMode } from "../../context/DarkModeContext";
import { LinearGradient } from "expo-linear-gradient";

export default function Footer() {
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
  const { darkMode } = useDarkMode();
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
      <LinearGradient
        colors={darkMode ? ["#111", "#333"] : ["#2563eb", "#1e40af"]} // azul similar a bg-blue-700 → bg-blue-900
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingBottom: bottom,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {menuItems.map((item) => (
          <TouchableOpacity key={item.key} onPress={item.onPress}>
            <View style={{ alignItems: "center" }}>
              <FontAwesome5 name={item.icon as any} size={16} color="#fff" />
              <Text style={{ fontSize: 12, color: "#fff" }}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </LinearGradient>

      <ProfileModal visible={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </>
  );
}
