import React, { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme"; // Adjust the import path to your hook

import AppStack from "@/navigation/AppStack";
import AuthStack from "@/navigation/AuthStack";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

/**
 * Root navigator that switches between AuthStack and AppStack
 * based on authentication state.
 */
const RootNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { colors, colorScheme } = useTheme(); // Use your custom theme hook
  const [isReady, setIsReady] = useState(false);

  // Define the navigation theme based on your custom hook's colors
  const navigationTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      // notification is another color property in the theme, you can customize it or leave it as default
      // notification: colors.primary, 
    },
  };

  // Wait for auth state to finish loading before rendering navigation
  useEffect(() => {
    if (!isLoading) setIsReady(true);
  }, [isLoading]);

  if (!isReady) return <FullScreenLoader />;

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;