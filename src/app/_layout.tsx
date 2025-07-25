import "../global.css";
import React from "react";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Contextos
import { AuthProvider } from "../context/AuthProvider";
import { CajaProvider } from "../context/CajaContext";
import { ProductProvider } from "../context/ProductContext";
import { TransactionProvider } from "../context/TransactionContext";
import { DarkModeProvider } from "../context/DarkModeContext"; // ✅ Nuevo contexto

// Componentes
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CajaProvider>
          <TransactionProvider>
            <ProductProvider>
              <DarkModeProvider> {/* ✅ Envolvemos todo en el DarkModeProvider */}
                <View style={styles.container}>
                  {/* HEADER */}
                  <View style={styles.header}>
                    <Header />
                  </View>

                  {/* NAVEGACIÓN */}
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="auth/forgot-password" />
                    <Stack.Screen name="auth/reset-password" />
                    <Stack.Screen name="auth/login" />
                    <Stack.Screen name="auth/signup" />
                    <Stack.Screen name="auth/profile" />
                    <Stack.Screen name="auth/not-found" />
                    <Stack.Screen name="auth/recovery-password" />

                    {/* Configuración */}
                    <Stack.Screen name="configApp/profile_admin" />
                    <Stack.Screen name="configApp/product-register" />
                    <Stack.Screen name="configApp/profile_user" />
                    <Stack.Screen name="configApp/transactions" />
                    <Stack.Screen name="configApp/start-day" />
                    <Stack.Screen name="configApp/reports" />

                    {/* Vistas */}
                    <Stack.Screen name="views/register-transaction" />
                    <Stack.Screen name="views/daily-history" />
                    <Stack.Screen name="views/open-register" />
                  </Stack>

                  {/* FOOTER */}
                  <View style={styles.footer}>
                    <Footer />
                  </View>
                </View>
              </DarkModeProvider>
            </ProductProvider>
          </TransactionProvider>
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
