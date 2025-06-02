import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Image,
  StyleSheet,
  Alert,
} from "react-native";

type Props = { darkMode: boolean };

function InputField({
  label,
  value,
  setValue,
  placeholder,
  darkMode,
}: {
  label: string;
  value: string;
  setValue: (val: string) => void;
  placeholder: string;
  darkMode: boolean;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: darkMode ? "white" : "black", marginBottom: 4 }}>
        {label}
      </Text>
      <TextInput
        keyboardType="numeric"
        placeholder={placeholder}
        placeholderTextColor={darkMode ? "#aaa" : "#666"}
        value={value}
        onChangeText={setValue}
        style={{
          borderWidth: 1,
          borderColor: darkMode ? "#555" : "#ccc",
          borderRadius: 6,
          paddingHorizontal: 10,
          paddingVertical: 8,
          color: darkMode ? "white" : "black",
          backgroundColor: darkMode ? "#222" : "white",
        }}
      />
    </View>
  );
}

export default function Content({ darkMode }: Props) {
  const [pricePerOz, setPricePerOz] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [purity, setPurity] = useState("");
  const [grams, setGrams] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const parse = (val: string) => parseFloat(val.replace(",", ".")) || 0;

  const oz = parse(pricePerOz);
  const rate = parse(exchangeRate);
  const pur = parse(purity);
  const g = parse(grams);
  const discount = parse(discountPercentage) / 100;

  const canCalculate = oz > 0 && rate > 0 && pur > 0;

  const pricePerGramUSD = ((oz / 31.1035) * pur) * (discount-1);
  const pricePerGramPEN = pricePerGramUSD * rate;
  const totalUSD = pricePerGramUSD * g;
  const totalPEN = totalUSD * rate;

  const formatNumber = (n: number) =>
    n.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  function clearAll() {
    setPricePerOz("");
    setExchangeRate("");
    setPurity("");
    setGrams("");
    setDiscountPercentage("");
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: darkMode ? "black" : "#cce4ff",
        paddingHorizontal: 16,
        paddingTop: 24,
      }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: darkMode ? "white" : "black",
            textAlign: "center",
          }}
        >
          Calculadora
        </Text>

        {/* Carrusel de marcas */}
        <BrandCarousel />

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
          <View
            style={{
              backgroundColor: darkMode ? "#222" : "#f0f0f0",
              borderRadius: 5,
              padding: 16,
              marginTop: 6,
            }}
          >
            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Precio por gramo (USD): {formatNumber(pricePerGramUSD)}
            </Text>
            <Text style={{ color: darkMode ? "white" : "black" }}>
              Precio por gramo (PEN): {formatNumber(pricePerGramPEN)}
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            onPress={clearAll}
            style={{
              flex: 1,
              backgroundColor: "#d9534f",
              paddingVertical: 8,
              borderRadius: 8,
              marginRight: 8,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>
              Limpiar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{
              flex: 1,
              backgroundColor: "#0275d8",
              paddingVertical: 8,
              borderRadius: 8,
              marginLeft: 8,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>
              Ver Recibo
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: darkMode ? "#111" : "white",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                marginBottom: 16,
                color: darkMode ? "white" : "black",
                textAlign: "center",
              }}
            >
              🧾 Recibo de Cálculo
            </Text>

            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Precio por gramo (USD): {formatNumber(pricePerGramUSD)}
            </Text>
            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Precio por gramo (PEN): {formatNumber(pricePerGramPEN)}
            </Text>
            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Total en USD: {formatNumber(totalUSD)}
            </Text>
            <Text style={{ color: darkMode ? "white" : "black", marginBottom: 8 }}>
              Total en PEN: {formatNumber(totalPEN)}
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
  <TouchableOpacity
    onPress={() => setShowModal(false)}
    style={{
      flex: 1,
      backgroundColor: "#555",
      paddingVertical: 12,
      borderRadius: 8,
      marginRight: 8, // espacio a la derecha del primer botón
    }}
  >
    <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>
      Cerrar
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
  onPress={() => Alert.alert('Alerta', 'Este es el mensaje de la alerta')}
  style={{
    flex: 1,
    backgroundColor: "#83a4d4",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8, // espacio a la izquierda del botón
  }}
>
    <Text style={{ color: "black", textAlign: "center", fontWeight: "600" }}>
    Imprimir recibo

    </Text>
  </TouchableOpacity>
</View>

            
          </View>
        </View>
      </Modal>
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
      const maxScroll = brandImages.length * 110;
      if (scrollX.current > maxScroll) {
        scrollX.current = 0;
      }
      scrollRef.current.scrollTo({ x: scrollX.current, animated: true });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ marginVertical: 12 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {brandImages.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 48,
    height: 48,
    marginHorizontal: 4,
    borderRadius: 8,
  },
});
