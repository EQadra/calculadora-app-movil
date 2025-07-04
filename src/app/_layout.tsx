import "../global.css";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Contextos
import { AuthProvider } from "../context/AuthProvider";
import { CajaProvider } from "../context/CajaContext";
import { TransaccionesProvider } from "../context/TransaccionesContext";
import { ProductProvider } from "../context/ProductContext"; // ✅ NUEVO

// Componentes
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function RootLayout() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CajaProvider>
          <TransaccionesProvider>
            <ProductProvider> {/* ✅ NUEVO CONTEXTO AGREGADO */}
              <View style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                  <Header darkMode={darkMode} setDarkMode={setDarkMode} />
                </View>

                {/* NAVEGACIÓN */}
                <Stack>
                  {/* Auth */}
                  <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
                  <Stack.Screen name="auth/reset-password" options={{ headerShown: false }} />
                  <Stack.Screen name="auth/login" options={{ headerShown: false }} />
                  <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
                  <Stack.Screen name="auth/profile" options={{ headerShown: false }} />
                  <Stack.Screen name="auth/not-found" options={{ headerShown: false }} />
                  <Stack.Screen name="auth/recovery-password" options={{ headerShown: false }} />

                  {/* Configuración */}
                  <Stack.Screen name="configApp/profile_admin" options={{ headerShown: false }} />
                  <Stack.Screen name="configApp/product-register" options={{ headerShown: false }} />
                  <Stack.Screen name="configApp/profile_user" options={{ headerShown: false }} />
                  <Stack.Screen name="configApp/transactions" options={{ headerShown: false }} />

                  {/* Vistas */}
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
            </ProductProvider>
          </TransaccionesProvider>
        </CajaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 0, backgroundColor: "#f0f0f0" },
  footer: { padding: 0, backgroundColor: "#f0f0f0" },
});
