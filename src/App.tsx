import "../global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useColorScheme } from "nativewind";

import { AuthProvider } from "@/context/AuthContext";
import RootNavigator from "@/navigation/RootNavigator";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

export default function App() {
  const { colorScheme } = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Lato-Regular": require("@/assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("@/assets/fonts/Lato-Bold.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return <FullScreenLoader />;
  }

  return (
    <AuthProvider>
      <RootNavigator />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </AuthProvider>
  );
}
