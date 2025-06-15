import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, TextInput, Text, Alert } from "react-native";
import CustomButton from "../../components/CustomButton";

export default function ResetPasswordScreen(): JSX.Element {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const handleResetPassword = (): void => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    console.log("Resetting password for:", email);
    console.log("New Password:", newPassword);
    router.replace("/auth/login"); // Reemplaza la ruta para evitar volver con "atrás"
  };

  return (
    <View className="flex-1 justify-center p-5 bg-green-100">
      <Text className="text-2xl font-bold text-center mb-5">
        Reset Password
      </Text>

      {email && (
        <Text className="text-center mb-3 text-gray-600">
          Resetting for: {email}
        </Text>
      )}

      <TextInput
        className="h-10 border border-gray-300 mb-4 px-3 rounded"
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TextInput
        className="h-10 border border-gray-300 mb-4 px-3 rounded"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <CustomButton title="Reset Password" onPress={handleResetPassword} />

      <Text
        className="text-center text-blue-500 mt-4"
        onPress={() => router.push("/auth/login")}
      >
        Back to Login
      </Text>
    </View>
  );
}
