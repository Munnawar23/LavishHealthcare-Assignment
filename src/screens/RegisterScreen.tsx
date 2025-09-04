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
import { MaterialIcons } from "@expo/vector-icons";

import { AuthStackParamList } from "@/navigation/AuthStack";
import { useAuth } from "@/context/AuthContext";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

/**
 * Register screen for new users.
 */
const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();
  const colorScheme = useColorScheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const subtextColor = colorScheme === "dark" ? "#9CA3AF" : "#6B7280";

  const inputStyle =
    "font-lato text-base bg-input dark:bg-dark-input text-text dark:text-dark-text p-4 rounded-lg border border-border dark:border-dark-border";

  // --- Handle user registration ---
  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        "Password Too Short",
        "Password must be at least 6 characters."
      );
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    const result = await register(username, email, password);
    if (!result.success) {
      Alert.alert(
        "Registration Failed",
        result.message || "Unknown error occurred."
      );
    }
  };

  const navigateToLogin = () => navigation.navigate("Login");

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
            Create Account
          </Text>

          <View className="mb-5">
            <Text className="text-sm font-lato-bold text-subtext dark:text-dark-subtext mb-2">
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a username"
              autoCapitalize="none"
              className={inputStyle}
              placeholderTextColor={subtextColor}
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-lato-bold text-subtext dark:text-dark-subtext mb-2">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              className={inputStyle}
              placeholderTextColor={subtextColor}
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-lato-bold text-subtext dark:text-dark-subtext mb-2">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Must be 6+ characters"
              secureTextEntry
              className={inputStyle}
              placeholderTextColor={subtextColor}
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            activeOpacity={0.8}
            className="bg-primary mt-8 rounded-lg p-4"
          >
            <Text className="text-center font-poppins-semibold text-lg text-white">
              Create Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={navigateToLogin}
            activeOpacity={0.7}
            className="mt-6 flex-row items-center justify-center"
          >
            <MaterialIcons name="arrow-back" size={20} color={subtextColor} />
            <Text className="ml-2 text-center font-lato-bold text-base text-subtext dark:text-dark-subtext">
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default RegisterScreen;
