import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Image,
} from "react-native";

type Props = { darkMode: boolean };

export default function Content({ darkMode }: Props): JSX.Element {
  const [pricePerOz, setPricePerOz] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [purity, setPurity] = useState("");
  const [grams, setGrams] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [printed, setPrinted] = useState<boolean | null>(null);

  const parse = (val: string): number => parseFloat(val.replace(",", ".")) || 0;

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

  const format = (n: number) =>
    new Intl.NumberFormat("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const handlePrint = () => {
    Alert.alert("Imprimir Recibo", "¿Deseas imprimir este recibo?", [
      { text: "Cancelar", onPress: () => setPrinted(false), style: "cancel" },
      {
        text: "Sí",
        onPress: () => {
          setPrinted(true);
          Alert.alert("Recibo Impreso", "Recibo listo para ser impreso.");
        },
      },
    ]);
  };

  const clearAll = () => {
    setPricePerOz("");
    setExchangeRate("");
    setPurity("");
    setGrams("");
    setDiscountPercentage("");
    setPrinted(null);
  };

  return (
    <View className={`flex-1 px-4 py-2 ${darkMode ? "bg-black" : "bg-blue-200"}`}>
     

      {/* Carrusel de marcas */}
      <BrandCarousel />
      <Text
        className={`text-2xl font-bold text-center ${darkMode ? "text-white" : "text-black"}`}
      >
        Calculadora
      </Text>
      <InputField
        label="Precio de la onza (USD)"
        value={pricePerOz}
        setValue={setPricePerOz}
        placeholder="Ej: 1980.45"
        darkMode={darkMode}
      />
      <InputField
        label="Tipo de cambio (USD a PEN)"
        value={exchangeRate}
        setValue={setExchangeRate}
        placeholder="Ej: 3.75"
        darkMode={darkMode}
      />
      <InputField
        label="Ley del oro (pureza)"
        value={purity}
        setValue={setPurity}
        placeholder="Ej: 0.75"
        darkMode={darkMode}
      />
      <InputField
        label="% de descuento"
        value={discountPercentage}
        setValue={setDiscountPercentage}
        placeholder="Ej: 5"
        darkMode={darkMode}
      />
      <InputField
        label="Cantidad de gramos a calcular"
        value={grams}
        setValue={setGrams}
        placeholder="Ej: 10"
        darkMode={darkMode}
      />

      {canCalculate && (
        <View className="bg-gray-100 dark:bg-gray-800 mt-2 p-2 rounded-md">
          <Text className="text-base dark:text-white text-black">
            💲 Precio por gramo (USD): {format(pricePerGramUSD)}
          </Text>
          <Text className="text-base dark:text-white text-black">
            🇵🇪 Precio por gramo (PEN): {format(pricePerGramPEN)}
          </Text>
        </View>
      )}

      <View className="flex-row gap-4 mt-4">
        <TouchableOpacity
          className="flex-1 bg-red-500 py-2 rounded-md"
          onPress={clearAll}
        >
          <Text className="text-white text-center font-semibold">Limpiar</Text>
        </TouchableOpacity>
      </View>

      {isValid && (
        <View className="bg-gray-100 dark:bg-gray-800 mt-3 p-2 rounded-md space-y-2">
          <Text className="text-lg dark:text-white text-black">
            💰 Total en USD: {format(totalUSD)}
          </Text>
          <Text className="text-lg dark:text-white text-black">
            🇵🇪 Total en PEN: {format(totalPEN)}
          </Text>

          {!printed && (
            <TouchableOpacity
              className="bg-blue-600 mt-4 py-2 rounded-md"
              onPress={handlePrint}
            >
              <Text className="text-white text-center font-semibold">Imprimir Recibo</Text>
            </TouchableOpacity>
          )}

          {printed === true && (
            <Text className="text-green-500 text-center mt-3">
              ✅ Recibo listo para impresión.
            </Text>
          )}
          {printed === false && (
            <Text className="text-red-500 text-center mt-3">
              ❌ No se pudo imprimir el recibo.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  darkMode: boolean;
};

function InputField({ label, value, setValue, placeholder, darkMode }: InputFieldProps): JSX.Element {
  return (
    <View className="mt-2">
      <Text className={`font-semibold mb-1 ${darkMode ? "text-white" : "text-black"}`}>
        {label}
      </Text>
      <TextInput
        className="p-3 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
        placeholder={placeholder}
        placeholderTextColor={darkMode ? "#aaa" : "#888"}
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />
    </View>
  );
}

function BrandCarousel(): JSX.Element {
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(0);

  const brandImages = [
    "https://picsum.photos/seed/1/100",
    "https://picsum.photos/seed/2/100",
    "https://picsum.photos/seed/3/100",
    "https://picsum.photos/seed/4/100",
    "https://picsum.photos/seed/5/100",
    "https://picsum.photos/seed/6/100",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      scrollX.current += 110;
      if (scrollX.current > brandImages.length * 110) {
        scrollX.current = 0;
      }
      scrollRef.current.scrollTo({ x: scrollX.current, animated: true });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      className="my-4"
    >
      {brandImages.map((uri, index) => (
        <Image
          key={index}
          source={{ uri }}
          className="w-16 h-16 mx-1 rounded-lg"
          resizeMode="cover"
        />
      ))}
    </ScrollView>
  );
}
