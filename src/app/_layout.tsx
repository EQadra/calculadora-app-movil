import "../global.css";
import React, { useState } from "react"; // IMPORTANTE: Agrega useState
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { AuthProvider } from "../context/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CajaProvider } from "../context/CajaContext";

import Footer from "./components/Footer";
import Header from "./components/Header";

export default function RootLayout(): JSX.Element {
  const [darkMode, setDarkMode] = useState(false); // 👈 Estado para darkMode

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
      <CajaProvider>

        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.footer}>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
            {/* 👆 Pasa el estado y la función como props */}
          </View>

          {/* STACK DE NAVEGACIÓN */}
          <Stack>
            {/*  */}
            <Stack.Screen name="auth/home" options={{ headerShown: false }} />
            {/*  */}
            <Stack.Screen name="auth/profile" options={{ headerShown: false }} />
            <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
            <Stack.Screen name="auth/reset-password" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          </Stack>

          <Stack>
            {/*  */}
            <Stack.Screen name="configApp/profile_admin" options={{ headerShown: false }} />
            <Stack.Screen name="configApp/profile_user" options={{ headerShown: false }} />  
          </Stack>

          <Stack>
            {/*  */}
            <Stack.Screen name="views/reports" options={{ headerShown: false }} />          
            <Stack.Screen name="views/register-transaction" options={{ headerShown: false }} />          
            <Stack.Screen name="views/daily-history" options={{ headerShown: false }} />          
            <Stack.Screen name="views/open-register" options={{ headerShown: false }} />          
          </Stack>




          {/* FOOTER */}
          <View style={styles.footer}>
          <Footer darkMode={darkMode} setDarkMode={setDarkMode} />
          </View>
        </View>
        </CajaProvider>

      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 0, backgroundColor: "#f0f0f0" },
  headerText: { fontSize: 20, fontWeight: "bold" },
  footer: { padding: 0, backgroundColor: "#f0f0f0" },
  footerText: { textAlign: "center" },
});
