/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",      // ✅ Rutas de expo-router
    "./src/**/*.{js,jsx,ts,tsx}",      // ✅ Lógica si usas carpeta src
    "./App.{js,jsx,ts,tsx}",           // ✅ Entrada principal
  ],
  presets: [require("nativewind/preset")], // ✅ Preset de NativeWind
  theme: {
    extend: {},
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
