import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

export default function NotFoundScreen(): JSX.Element {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-green-100">
      <Text
        className="text-center text-green-500"
        onPress={() => router.push("/auth/login")}
      >
        retornar a la página principal
      </Text>
    </View>
  );
}
