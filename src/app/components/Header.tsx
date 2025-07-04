import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Switch,
  Alert,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import logo from '../../../assets/Logo.png'; // Ajusta la ruta si estás en una subcarpeta

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const CustomIcon = ({ path }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d={path} fill="#fff" />
  </Svg>
);

const newsItems = [
  { id: "1", title: "Nueva promoción disponible", description: "Obtén 20% de descuento en productos seleccionados." },
  { id: "2", title: "Horario extendido", description: "Ahora atendemos hasta las 10 PM todos los días." },
  { id: "3", title: "Lanzamiento de nuevos productos", description: "Descubre nuestra nueva línea de tecnología." },
];

const Header = ({ darkMode, setDarkMode }) => {
  const { top } = useSafeAreaInsets();

  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [expanded, setExpanded] = useState({});

  const [slideAnim] = useState(new Animated.Value(-250));
  const [notifAnim] = useState(new Animated.Value(SCREEN_WIDTH));

  const toggleMenu = () => (menuVisible ? closeMenu() : openMenu());
  const openMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setMenuVisible(true));
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const toggleNotifications = () => (notificationsVisible ? closeNotifications() : openNotifications());
  const openNotifications = () => {
    Animated.timing(notifAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setNotificationsVisible(true));
  };

  const closeNotifications = () => {
    Animated.timing(notifAnim, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setNotificationsVisible(false));
  };

  const toggleSection = (title) =>
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));

  const sections = [
    {
      title: "General",
      items: [
        { title: "Dashboard", path: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
        { title: "Transacciones", path: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
        { title: "Anuncios", path: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
      ],
    },
    {
      title: "Cuenta",
      items: [
        { title: "Store", path: "M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
        { title: "Notificaciones", path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1h6z" },
        { title: "Cerrar sesión", path: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 14a9 9 0 100-18" },
      ],
    },
  ];

  return (
    <View style={{ paddingTop: top }} className="z-10">
      <View className={`px-4 h-14 flex-row items-center justify-between ${darkMode ? "bg-green-900" : "bg-sky-500"}`}>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={toggleMenu}>
            <Text className="text-white text-xl">{menuVisible ? "✖️" : "☰"}</Text>
          </TouchableOpacity>
          <Image
            source={logo}
            style={{ width: 24, height: 24 }}
          />
          <Text className="text-white font-bold text-sm">BMG Electronics</Text>
        </View>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={toggleNotifications}>
            <Text className="text-white text-xl">🔔</Text>
          </TouchableOpacity>
          <Text className="text-white">{darkMode ? "🌙" : "☀️"}</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? "#facc15" : "#ccc"}
            trackColor={{ false: "#767577", true: "#d97706" }}
          />
        </View>
      </View>

      {/* MENÚ IZQUIERDO */}
      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
          position: "absolute",
          top: top + 48,
          left: 0,
          width: "70%",
          height: SCREEN_HEIGHT - top,
          backgroundColor: "#064e3b",
          paddingHorizontal: 16,
          paddingVertical: 20,
          zIndex: 100,
        }}
      >
        <Text className="text-gray-300 font-bold text-lg mb-6 border-b border-green-800 pb-2">Menú Principal</Text>
        {sections.map((section, idx) => (
          <View key={idx} className="mb-4">
            <TouchableOpacity onPress={() => toggleSection(section.title)} className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-200 font-semibold text-base">{section.title}</Text>
              <Text className="text-gray-400">{expanded[section.title] ? "▲" : "▼"}</Text>
            </TouchableOpacity>
            {expanded[section.title] &&
              section.items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  className="flex-row items-center gap-3 py-2 pl-4"
                  onPress={() => {
                    Alert.alert(item.title);
                    closeMenu();
                  }}
                >
                  <View className="p-2 rounded-full bg-green-700">
                    <CustomIcon path={item.path} />
                  </View>
                  <Text className="text-gray-300 text-base">{item.title}</Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
        <Text className="text-center text-gray-400 text-sm mt-6">Versión 1.0.0</Text>
      </Animated.View>

      {/* ASIDE DERECHO DE NOTIFICACIONES */}
      <Animated.View
        style={{
          transform: [{ translateX: notifAnim }],
          position: "absolute",
          top: top + 48,
          right: 0,
          width: "70%",
          height: SCREEN_HEIGHT - top,
          backgroundColor: "#f0fdf4",
          padding: 16,
          zIndex: 100,
        }}
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-green-900">Noticias</Text>
          <TouchableOpacity onPress={closeNotifications}>
            <Text className="text-green-600 text-lg">Cerrar ✖️</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={newsItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-white rounded-lg p-4 mb-3 shadow-md">
              <Text className="font-semibold text-base text-green-800">{item.title}</Text>
              <Text className="text-gray-600 text-sm mt-1">{item.description}</Text>
            </View>
          )}
        />
      </Animated.View>

      {(menuVisible || notificationsVisible) && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (menuVisible) closeMenu();
            if (notificationsVisible) closeNotifications();
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 50,
          }}
        />
      )}
    </View>
  );
};

export default Header;
