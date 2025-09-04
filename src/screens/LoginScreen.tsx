import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { AuthStackParamList } from "@/navigation/AuthStack";
import { useAuth } from "@/context/AuthContext";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

/**
 * Login screen for existing users.
 */
const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const colorScheme = useColorScheme();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // --- Handle user login ---
  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Missing Fields", "Enter both username/email and password.");
      return;
    }

    const success = await login(identifier, password);
    if (!success) {
      Alert.alert(
        "Login Failed",
        "Invalid credentials. Please try again or register."
      );
    }
  };

  // --- Navigate to registration ---
  const navigateToRegister = () => navigation.navigate("Register");

  const inputStyle =
    "font-lato text-base bg-input dark:bg-dark-input text-text dark:text-dark-text p-4 rounded-lg border border-border dark:border-dark-border";

  const placeholderColor = colorScheme === "dark" ? "#9CA3AF" : "#6B7280";

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <View className="p-6">
          <Text className="text-4xl text-center font-poppins-bold text-primary mb-12">
            Lavish FC
          </Text>

          <View className="mb-5">
            <Text className="text-sm font-lato-bold text-subtext dark:text-dark-subtext mb-2">
              Username or Email
            </Text>
            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              className={inputStyle}
              placeholderTextColor={placeholderColor}
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-lato-bold text-subtext dark:text-dark-subtext mb-2">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              className={inputStyle}
              placeholderTextColor={placeholderColor}
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.8}
            className="bg-primary mt-8 rounded-lg p-4"
          >
            <Text className="text-center font-poppins-semibold text-lg text-white">
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={navigateToRegister}
            activeOpacity={0.7}
            className="mt-6"
          >
            <Text className="text-center font-lato text-base text-subtext dark:text-dark-subtext">
              Don't have an account?{" "}
              <Text className="font-lato-bold text-primary">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LoginScreen;
