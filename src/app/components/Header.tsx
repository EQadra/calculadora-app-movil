import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Switch,
  Alert,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";

type HeaderProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ darkMode, setDarkMode }: HeaderProps): JSX.Element {
  const { top } = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [slideAnim] = useState(new Animated.Value(-250));
  const [overlayOpacity] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    menuVisible ? closeMenu() : openMenu();
  };

  
  const openMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setMenuVisible(true));
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setMenuVisible(false));
  };

  return (
    <View style={{ paddingTop: top }} className="z-10">
      <View
        className={`px-4 h-14 flex-row items-center justify-between ${darkMode ? "bg-gray-800" : "bg-sky-500"}`}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <Image source={require("../../../assets/Logo.png")} style={{ width: 38, height: 40 }} />
          <Text className="text-white font-bold text-lg">BMG Eletronic</Text>
        </View>

        <View className="flex-row items-center gap-4">
          <FontAwesome5 name={darkMode ? "moon" : "sun"} size={20} color={darkMode ? "#facc15" : "#fbbf24"} />
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? "#facc15" : "#ccc"}
            trackColor={{ false: "#767577", true: "#d97706" }}
          />
        </View>

        <TouchableOpacity onPress={toggleMenu} className="p-2 rounded-full mr-3">
          <FontAwesome5 name={menuVisible ? "times" : "bars"} size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
          position: "absolute",
          top: 84,
          left: 0,
          width: "50%",
          height: 900,
          backgroundColor: "black",
          zIndex: 100,
          paddingHorizontal: 15,
        }}
      >
        <View className="pt-5">
          <Text className="text-white font-bold text-xl pb-6 border-b border-gray-700">
            Menú Principal
          </Text>
          {[
            { label: "Inicio", icon: "home" },
            { label: "Historial", icon: "history" },
            { label: "Ajustes", icon: "cog" },
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-row items-center gap-4 py-5 border-b border-gray-700"
              onPress={() => {
                Alert.alert(`${item.label} seleccionado`);
                closeMenu();
              }}
            >
              <View className="bg-emerald-500 p-3 rounded-full">
                <FontAwesome5 name={item.icon as any} size={16} color="white" />
              </View>
              <Text className="text-white text-sm font-medium">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-center text-gray-400 mt-10">Versión 1.0.0</Text>
      </Animated.View>

      {menuVisible && (
        <TouchableOpacity
          activeOpacity={0}
          onPress={closeMenu}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: darkMode ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.7)",
            zIndex: 50,
          }}
        />
      )}
    </View>
  );
}
