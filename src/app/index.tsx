import React, { useState } from "react";
import {
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "./components/Header";
import Content from "./components/Content";
import Footer from "./components/Footer";

export default function Page(): JSX.Element {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <View className={`flex-1 ${darkMode ? "bg-black" : "bg-white"}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Content darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </View>
  );
}
