import "../global.css";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <StatusBar style="dark" />
      <Text className="text-3xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
    </View>
  );
}
