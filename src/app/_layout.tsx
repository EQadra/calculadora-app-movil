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
                    <Stack.Screen name="configApp/start-day" options={{ headerShown: false }} />
                    <Stack.Screen name="configApp/reports" options={{ headerShown: false }} />



                    {/* Vistas */}
                    <Stack.Screen name="views/register-transaction" options={{ headerShown: true }} />
                    <Stack.Screen name="views/daily-history" options={{ headerShown: false }} />
                    <Stack.Screen name="views/open-register" options={{ headerShown: false }} />
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
