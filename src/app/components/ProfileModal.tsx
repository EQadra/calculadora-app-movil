import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ProfileModal({ visible, onClose }: Props) {
  const [nombre, setNombre] = React.useState("");
  const [correo, setCorreo] = React.useState("");
  const [dni, setDni] = React.useState("");
  const [celular, setCelular] = React.useState("");
  const [genero, setGenero] = React.useState<"masculino" | "femenino">("masculino");

  const avatarUrl =
    genero === "masculino"
      ? "https://picsum.photos/seed/male/100"
      : "https://picsum.photos/seed/female/100";

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/40 px-4">
        <View className="bg-white w-full rounded-2xl p-6">
          <Text className="text-lg font-bold mb-4 text-center">Perfil de Usuario</Text>

          <View className="items-center mb-4">
            <Image
              source={{ uri: avatarUrl }}
              className="w-24 h-24 rounded-full mb-2 bg-gray-200"
              resizeMode="cover"
            />
          </View>

          <TextInput
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            className="border border-gray-300 rounded px-3 py-2 mb-2"
          />
          <TextInput
            placeholder="Correo"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            className="border border-gray-300 rounded px-3 py-2 mb-2"
          />
          <TextInput
            placeholder="DNI"
            value={dni}
            onChangeText={setDni}
            keyboardType="numeric"
            className="border border-gray-300 rounded px-3 py-2 mb-2"
          />
          <TextInput
            placeholder="Celular"
            value={celular}
            onChangeText={setCelular}
            keyboardType="phone-pad"
            className="border border-gray-300 rounded px-3 py-2 mb-4"
          />

          <View className="flex-row justify-end gap-2">
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // Aquí puedes guardar los datos
                onClose();
              }}
              className="bg-sky-500 px-4 py-2 rounded"
            >
              <Text className="text-white">Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
