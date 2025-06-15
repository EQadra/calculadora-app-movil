import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../../../context/AuthProvider"; // Importa el hook useAuth

export default function ProfileScreen(): JSX.Element {
  const { user } = useAuth(); // Obtén el usuario autenticado
  const params = useLocalSearchParams(); // Obtén los parámetros de la ruta

  // Combina los datos del contexto y los parámetros de la ruta
  const userData = user || params;

  return (
    <View className="flex-1 justify-center items-center bg-green-100">
      <Text className="text-2xl font-bold">Lawyer Dashboard</Text>
      <Text className="mt-4 text-lg">Welcome, {userData.fullName}!</Text>
      <Text className="mt-2 text-gray-600">
        Specialty: {userData.specialty}
      </Text>
      <Text className="mt-2 text-gray-600">
        Experience: {userData.experience}
      </Text>
      <Text className="mt-2 text-gray-600">Location: {userData.location}</Text>
      <Text className="mt-2 text-gray-600">
        Selected Country: {userData.selectedCountry}
      </Text>
    </View>
  );
}
