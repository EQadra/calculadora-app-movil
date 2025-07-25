import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import ProfileModal from "../components/ProfileModal";
import { useDarkMode } from "../../context/DarkModeContext";
import Svg, { Path } from "react-native-svg";

function HomeIcon({ color = "#fff" }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10L12 3L21 10V20A1 1 0 0 1 20 21H4A1 1 0 0 1 3 20V10Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function HistoryIcon({ color = "#fff" }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 8V12L14.5 13.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 12A9 9 0 1 0 12 3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 3V7H7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


function CalculatorIcon({ color = "#fff" }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 2H17C18.1 2 19 2.9 19 4V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V4C5 2.9 5.9 2 7 2Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M9 6H15"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M9 10H9.01M12 10H12.01M15 10H15.01M9 13H9.01M12 13H12.01M15 13H15.01"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}


function UserIcon({ color = "#fff" }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21V19A4 4 0 0 0 16 15H8A4 4 0 0 0 4 19V21M12 11A4 4 0 1 0 12 3A4 4 0 0 0 12 11Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function Footer() {
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const menuItems = [
    {
      key: "inicio",
      label: "Inicio",
      icon: <HomeIcon />,
      onPress: () => router.push("/views/open-register"),
    },
    {
      key: "historial",
      label: "Historial",
      icon: <HistoryIcon />,
      onPress: () => router.push("/views/daily-history"),
    },
    {
      key: "transaccion",
      label: "Transacción",
      icon: <CalculatorIcon />,
      onPress: () => router.push("/views/register-transaction"),
    },
    {
      key: "perfil",
      label: "Perfil",
      icon: <UserIcon />,
      onPress: () => setShowProfileModal(true),
    },
  ];

  return (
    <>
      <LinearGradient
        colors={darkMode ? ["#111", "#333"] : ["#2563eb", "#1e40af"]}
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
              {item.icon}
              <Text style={{ fontSize: 12, color: "#fff", marginTop: 4 }}>
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </LinearGradient>

      <ProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}
