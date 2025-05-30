import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Image,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Page(): JSX.Element {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  return (
    <View className={`flex flex-1 ${darkMode ? "bg-black" : "bg-white"}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Content darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </View>
  );
}

type HeaderProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

function Header({ darkMode, setDarkMode }: HeaderProps): JSX.Element {
  const { top } = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [slideAnim] = useState<Animated.Value>(new Animated.Value(-250));
  const [overlayOpacity] = useState<Animated.Value>(new Animated.Value(0));

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
    <View style={{ paddingTop: top }} className="bg-transparent z-10">
      <View
        className={`px-4 lg:px-6 h-14 flex items-center flex-row justify-between relative ${darkMode ? "bg-gray-800" : "bg-sky-500"}`}
      >
        <View className="flex flex-row items-center gap-3 flex-1">
          <Image source={require("./assets/Logo.png")}
                 style={{ width: 38, height: 40 }} />
          <Text className="font-bold text-lg text-white">BMG Eletronic</Text>
        </View>

        <View className="flex flex-row items-center gap-4">
          <FontAwesome5
            name={darkMode ? "moon" : "sun"}
            size={20}
            color={darkMode ? "#facc15" : "#fbbf24"}
          />
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? "#facc15" : "#ccc"}
            trackColor={{ false: "#767577", true: "#d97706" }}
          />
        </View>

        <TouchableOpacity
          onPress={toggleMenu}
          className="p-2 rounded-full active:bg-sky-600 mr-3"
        >
          <FontAwesome5
            name={menuVisible ? "times" : "bars"}
            size={20}
            color="white"
            style={{ transform: [{ scale: 1.2 }] }}
          />
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
          paddingBottom: top + 318,
          paddingHorizontal: 15,
        }}
      >
        <View className="flex-1">
          <Text className="text-xlc mt-5 font-bold text-white pb-6 border-b border-gray-700">
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
              <View className="p-3 rounded-full bg-emerald-500">
                <FontAwesome5 name={item.icon as any} size={16} color="white" />
              </View>
              <Text className="text-sm font-medium text-white">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="pb-10 pt-5">
          <Text className="text-center text-gray-400">Versión 1.0.0</Text>
        </View>
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

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

interface ContentProps {
  darkMode: boolean;
}

const Content: React.FC<ContentProps> = ({ darkMode }) => {
  const [pricePerOz, setPricePerOz] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<string>("");
  const [purity, setPurity] = useState<string>("");
  const [grams, setGrams] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<string>("");
  const [printed, setPrinted] = useState<boolean | null>(null);

  const parse = (value: string): number =>
    parseFloat(value.replace(",", ".")) || 0;

  const oz = parse(pricePerOz);
  const rate = parse(exchangeRate);
  const pur = parse(purity);
  const g = parse(grams);
  const discount = parse(discountPercentage) / 100;

  const isValid = oz && rate && pur && g;
  const canCalculate = oz && rate && pur;

  const pricePerGramUSD = ((oz / 31.1035) * pur) * (1 - discount);
  const pricePerGramPEN = pricePerGramUSD * rate;
  const totalUSD = pricePerGramUSD * g;
  const totalPEN = totalUSD * rate;

  const formatNumber = (num: number): string =>
    new Intl.NumberFormat("es-PE", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);

  const clearAll = () => {
    setPricePerOz("");
    setExchangeRate("");
    setPurity("");
    setGrams("");
    setDiscountPercentage("");
    setPrinted(null);
  };

  const handlePrint = () => {
    Alert.alert(
      "Imprimir Recibo",
      "¿Deseas imprimir este recibo?",
      [
        { text: "Cancelar", onPress: () => setPrinted(false), style: "cancel" },
        {
          text: "Sí",
          onPress: () => {
            setPrinted(true);
            Alert.alert("Recibo Impreso", "Recibo listo para ser impreso.", [
              { text: "Ok" },
            ]);
          },
        },
      ]
    );
  };

  return (
    <View className={`flex-1 px-4 md:px-3 py-4 ${darkMode ? "" : "bg-blue-200"}`}>
      <Text className={`text-2xl font-bold text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
        Calculadora
      </Text>

      <View className="space-y-4 mt-4">
        {/* Inputs */}
        <InputField
          label="Precio de la onza (USD)"
          placeholder="Ej: 1980.45"
          value={pricePerOz}
          setValue={setPricePerOz}
          darkMode={darkMode}
        />
        <InputField
          label="Tipo de cambio (USD a PEN)"
          placeholder="Ej: 3.75"
          value={exchangeRate}
          setValue={setExchangeRate}
          darkMode={darkMode}
        />
        <InputField
          label="Ley del oro (pureza)"
          placeholder="Ej: 0.75"
          value={purity}
          setValue={setPurity}
          darkMode={darkMode}
        />
        <InputField
          label="% de descuento"
          placeholder="Ej: 5"
          value={discountPercentage}
          setValue={setDiscountPercentage}
          darkMode={darkMode}
        />

        {canCalculate && (
          <View className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <Text className="text-base text-gray-800 dark:text-white">
              💲 Precio por gramo (USD): {formatNumber(pricePerGramUSD)}
            </Text>
            <Text className="text-base text-gray-800 dark:text-white">
              🇵🇪 Precio por gramo (PEN): {formatNumber(pricePerGramPEN)}
            </Text>
          </View>
        )}

        <InputField
          label="Cantidad de gramos a calcular"
          placeholder="Ej: 10"
          value={grams}
          setValue={setGrams}
          darkMode={darkMode}
        />
      </View>

      {/* Botón Limpiar */}
      <View className="flex flex-row gap-4 mt-4">
        <TouchableOpacity
          className="flex-1 bg-red-500 rounded-md py-2"
          onPress={clearAll}
        >
          <Text className="text-white text-center font-semibold">Limpiar</Text>
        </TouchableOpacity>
      </View>

      {/* Resultados Finales */}
      {isValid && (
        <View className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-md space-y-2">
          <Text className="text-lg text-gray-800 dark:text-white">💲 Precio por gramo (USD): {formatNumber(pricePerGramUSD)}</Text>
          <Text className="text-lg text-gray-800 dark:text-white">⚖️ Gramos ingresados: {formatNumber(g)}</Text>
          <Text className="text-lg text-gray-800 dark:text-white">💰 Total en USD: {formatNumber(totalUSD)}</Text>
          <Text className="text-lg text-gray-800 dark:text-white">🇵🇪 Total en Soles (PEN): {formatNumber(totalPEN)}</Text>

          {!printed && (
            <TouchableOpacity
              className="mt-4 bg-blue-600 rounded-md py-1"
              onPress={handlePrint}
            >
              <Text className="text-white text-center font-semibold">Imprimir Recibo</Text>
            </TouchableOpacity>
          )}

          {printed === true && (
            <Text className="mt-3 text-green-500 font-medium text-center">
              ✅ Recibo listo para impresión.
            </Text>
          )}

          {printed === false && (
            <Text className="mt-3 text-red-500 font-medium text-center">
              ❌ No se pudo imprimir el recibo.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  darkMode: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  setValue,
  darkMode,
}) => (
  <View className="my-2">
    <Text className={`${darkMode ? "text-white" : "text-gray-700"} mb-1 font-semibold`}>
      {label}
    </Text>
    <TextInput
      className="border border-gray-300 dark:border-gray-600 rounded-md p-3 text-base bg-white dark:bg-gray-800 text-black dark:text-white"
      placeholder={placeholder}
      placeholderTextColor={darkMode ? "#888" : "#aaa"}
      keyboardType="numeric"
      value={value}
      onChangeText={setValue}
    />
  </View>
);

export default Content;


function Footer({ darkMode }: { darkMode: boolean }): JSX.Element {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: bottom,
        zIndex: 100,
      }}
      className={`px-4 lg:px-6 h-17 flex flex-row pt-3 pb-2 items-center justify-between ${darkMode ? "bg-gray-800" : "bg-sky-500"}`}
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

// Content function is defined elsewhere and will be added
// You can paste your refactored Content function into this file under this structure
