import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  Image,
  FlatList,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  darkMode: boolean;
};

export default function Footer({ darkMode }: Props): JSX.Element {
  const { bottom } = useSafeAreaInsets();

  const [visibleModal, setVisibleModal] = useState<null | "inicio" | "historial" | "ajustes">(null);

  // Common states
  const [textInputs, setTextInputs] = useState<string[]>(["", "", ""]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Images for inicio modal
  const [images, setImages] = useState<(string | null)[]>([null, null]);

  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const resetForm = () => {
    setTextInputs(["", "", ""]);
    setDate(new Date());
    setImages([null, null]);
  };

  const renderInicio = () => (
    <View>
      <Text className="text-lg font-semibold text-center mb-4">Inicio</Text>
  
      {/* Campos de texto adicionales */}
      {[0, 1, 2].map((idx) => (
        <TextInput
          key={`inicio-text-${idx}`}
          className="border border-gray-300 rounded-md p-2 mb-3"
          placeholder={`Texto ${idx + 1}`}
          value={textInputs[idx]}
          onChangeText={(text) => {
            const newInputs = [...textInputs];
            newInputs[idx] = text;
            setTextInputs(newInputs);
          }}
        />
      ))}
  
      {/* Imágenes en fila */}
      <View className="flex-row justify-between gap-2">
        {[0, 1].map((idx) => (
          <View key={idx} className="w-1/2 mb-4">
            <TouchableOpacity
              onPress={() => pickImage(idx)}
              className="bg-sky-500 py-2 px-2 rounded-md mb-2"
            >
              <Text className="text-white text-center text-sm">
                Seleccionar Imagen {idx + 1}
              </Text>
            </TouchableOpacity>
  
            {images[idx] && (
              <View className="relative">
                <Image
                  source={{ uri: images[idx]! }}
                  className="w-full h-24 rounded-md"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
                >
                  <MaterialIcons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
  

  const renderHistorial = () => {
    const data = [
      { id: "1", transaccion: "Pago $100", fecha: "2025-05-01", usuario: "Juan" },
      { id: "2", transaccion: "Envío $200", fecha: "2025-05-10", usuario: "Ana" },
      { id: "3", transaccion: "Recibo $300", fecha: "2025-05-20", usuario: "Luis" },
    ];

    return (
      <View>
        <Text className="text-lg font-semibold text-center mb-4">Historial</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-gray-200 rounded-full px-4 py-2 mb-2">
              <Text className="text-sm font-medium">
                {item.transaccion} - {item.fecha} - {item.usuario}
              </Text>
            </View>
          )}
        />
      </View>
    );
  };

  const renderAjustes = () => (
    <View>
      <Text className="text-lg font-semibold text-center mb-4">Ajustes</Text>

      {[0, 1, 2].map((idx) => (
        <TextInput
          key={idx}
          className="border border-gray-300 rounded-md p-2 mb-3"
          placeholder={`Campo ${idx + 1}`}
          value={textInputs[idx]}
          onChangeText={(text) => {
            const newInputs = [...textInputs];
            newInputs[idx] = text;
            setTextInputs(newInputs);
          }}
        />
      ))}

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="border border-gray-300 rounded-md p-2 mb-3"
      >
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
    </View>
  );

  const renderModalContent = () => {
    switch (visibleModal) {
      case "inicio":
        return renderInicio();
      case "historial":
        return renderHistorial();
      case "ajustes":
        return renderAjustes();
      default:
        return null;
    }
  };

  const menuItems = [
    { key: "inicio", label: "Inicio", icon: "home" },
    { key: "historial", label: "Historial", icon: "history" },
    { key: "ajustes", label: "Ajustes", icon: "cog" },
  ];

  return (
    <>
      <View
        style={{ paddingBottom: bottom }}
        className={`absolute bottom-0 left-0 right-0 px-4 h-17 pt-3 pb-2 flex-row justify-between items-center ${
          darkMode ? "bg-gray-800" : "bg-sky-500"
        }`}
      >
        {menuItems.map((item, idx) => (
          <TouchableOpacity key={idx} onPress={() => setVisibleModal(item.key as any)}>
            <View className="items-center">
              <FontAwesome5 name={item.icon as any} size={16} color="white" />
              <Text className="text-xs text-white">{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        transparent
        visible={visibleModal !== null}
        animationType="slide"
        onRequestClose={() => {
          setVisibleModal(null);
          resetForm();
        }}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-4">
          <View className="bg-white p-6 rounded-xl w-full max-w-md">
            {renderModalContent()}

            <Pressable
              onPress={() => {
                setVisibleModal(null);
                resetForm();
              }}
              className="mt-4 bg-gray-600 py-2 rounded-lg"
            >
              <Text className="text-center text-white">Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
