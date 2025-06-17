import React, { useState } from "react";
import {
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Content from "../../components/Content";

export default function HomeScreen(): JSX.Element {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <View className={`flex-1 ${darkMode ? "bg-black" : "bg-white"}`}>
      <Content darkMode={darkMode} />
    </View>
  );
}
