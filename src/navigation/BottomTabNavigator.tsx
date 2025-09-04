import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

import HomeScreen from "@/screens/HomeScreen";
import MyMatchesScreen from "@/screens/MyMatchesScreen";
import CreateTeamScreen from "@/screens/CreateTeamScreen";

export type BottomTabParamList = {
  HomeTab: undefined;
  CreateTeamTab: undefined;
  MyMatchesTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

/**
 * Bottom tab navigator with theme-aware styling and icons.
 * Animations disabled for instant tab switching.
 */
const BottomTabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const getIconName = (routeName: string, focused: boolean) => {
          switch (routeName) {
            case "HomeTab":
              return focused ? "home" : "home-outline";
            case "CreateTeamTab":
              return focused ? "add-circle" : "add-circle-outline";
            case "MyMatchesTab":
              return focused ? "trophy" : "trophy-outline";
            default:
              return "alert-circle";
          }
        };

        return {
          headerShown: true,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
          headerShadowVisible: false,

          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.subtext,
          tabBarStyle: {
            height: 80,
            paddingBottom: 0,
            paddingTop: 5,
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          },
          tabBarLabelStyle: {
            fontFamily: "Poppins-SemiBold",
            fontSize: 12,
          },
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={getIconName(route.name, focused)} size={26} color={color} />
          ),
          animationEnabled: false,
        };
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: "Home" }} />
      <Tab.Screen
        name="CreateTeamTab"
        component={CreateTeamScreen}
        options={{ title: "Create a Team" }}
      />
      <Tab.Screen
        name="MyMatchesTab"
        component={MyMatchesScreen}
        options={{ title: "My Matches" }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
