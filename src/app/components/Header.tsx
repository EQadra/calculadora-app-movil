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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const CustomIcon = ({ path }: { path: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d={path} fill="#fff" />
  </Svg>
);

const sections = [
  {
    title: "General",
    items: [
      { title: "Inicio", path: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
      { title: "Explorar", path: "M12 2a10 10 0 100 20 10 10 0 000-20zm3 13l-6-2 2-6 6 2-2 6z" },
      { title: "Estadísticas", path: "M4 12h4v8H4zm6-6h4v14h-4zm6 4h4v10h-4z" },
      { title: "Calendario", path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
      { title: "Buscar", path: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    ],
  },
  {
    title: "Cuenta",
    items: [
      { title: "Perfil", path: "M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
      { title: "Mensajes", path: "M2 8l10 6 10-6" },
      { title: "Favoritos", path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0112 3a5.5 5.5 0 0110 5.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" },
      { title: "Notificaciones", path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1h6z" },
      { title: "Cerrar sesión", path: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 14a9 9 0 100-18" },
    ],
  },
  {
    title: "Soporte",
    items: [
      { title: "Ayuda", path: "M12 18h.01M12 14a4 4 0 10-4-4" },
      { title: "Privacidad", path: "M12 2a7 7 0 017 7v4a7 7 0 01-14 0V9a7 7 0 017-7z" },
      { title: "Términos", path: "M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" },
      { title: "Licencias", path: "M9 12l2 2 4-4m5-3a2 2 0 00-2-2H6a2 2 0 00-2 2v14l4-4h9a2 2 0 002-2V5z" },
      { title: "Acerca de", path: "M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" },
    ],
  },
];

const Header = ({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (val: boolean) => void }) => {
  const { top } = useSafeAreaInsets();

  const [menuVisible, setMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchVisible, setSearchVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [slideAnim] = useState(new Animated.Value(-250));

  const toggleMenu = () => (menuVisible ? closeMenu() : openMenu());
  const openMenu = () =>
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setMenuVisible(true));

  const closeMenu = () =>
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));

  const toggleSection = (title: string) =>
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));

  const products = Array.from({ length: 12 }).map((_, i) => ({
    id: `${i}`,
    title: `Producto ${i + 1}`,
    description: `Descripción del producto número ${i + 1}.`,
    image: `https://picsum.photos/200?random=${i + 10}`,
  }));

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={{ paddingTop: top }} className="z-10">
      {/* TOP BAR */}
      <View className={`px-4 h-14 flex-row items-center justify-between ${darkMode ? "bg-green-900" : "bg-sky-500"}`}>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={toggleMenu}>
            <Text className="text-white text-xl">{menuVisible ? "✖️" : "☰"}</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2907/2907241.png" }}
            style={{ width: 28, height: 28 }}
          />
          <Text className="text-white font-bold text-lg">TuDealer</Text>
        </View>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => setSearchVisible(true)}>
            <Text className="text-white text-xl">🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCartVisible(true)}>
            <Text className="text-white text-xl">🛒</Text>
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

      {/* MENÚ LATERAL */}
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
            <TouchableOpacity
              onPress={() => toggleSection(section.title)}
              className="flex-row justify-between items-center mb-2"
            >
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

      {menuVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeMenu}
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

      {/* MODAL DE BÚSQUEDA */}
      <Modal visible={searchVisible} animationType="slide">
        <View className="flex-1 bg-white pt-14 px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Buscar</Text>
            <TouchableOpacity onPress={() => setSearchVisible(false)}>
              <Text className="text-red-600 text-lg">Cerrar ✖️</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Buscar productos..."
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
          />
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="bg-gray-100 rounded-lg mb-4 p-4 flex-row">
                <Image source={{ uri: item.image }} style={{ width: 80, height: 80, borderRadius: 8 }} />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-semibold">{item.title}</Text>
                  <Text className="text-sm text-gray-600 mb-2">{item.description}</Text>
                  <TouchableOpacity className="bg-green-600 py-2 px-3 rounded-lg self-start">
                    <Text className="text-white text-sm">Agregar al carrito</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </Modal>

      {/* MODAL DE CARRITO */}
      <Modal visible={cartVisible} animationType="slide">
        <View className="flex-1 bg-white pt-14 px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Tienda</Text>
            <TouchableOpacity onPress={() => setCartVisible(false)}>
              <Text className="text-red-600 text-lg">Cerrar ✖️</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Buscar productos..."
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            value={searchText}
            onChangeText={setSearchText}
          />

          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
            renderItem={({ item }) => (
              <View style={{ width: "30%" }} className="bg-gray-100 p-2 rounded-lg">
                <Image
                  source={{ uri: item.image }}
                  style={{ width: "100%", height: 80, borderRadius: 8 }}
                  resizeMode="cover"
                />
                <Text className="text-sm font-semibold mt-2">{item.title}</Text>
                <TouchableOpacity className="bg-green-600 mt-2 py-1 px-2 rounded-lg">
                  <Text className="text-white text-xs text-center">Agregar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Header;
