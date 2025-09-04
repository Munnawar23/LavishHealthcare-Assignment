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
 */
const BottomTabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          switch (route.name) {
            case "HomeTab":
              iconName = focused ? "home" : "home-outline";
              break;
            case "CreateTeamTab":
              iconName = focused ? "add-circle" : "add-circle-outline";
              break;
            case "MyMatchesTab":
              iconName = focused ? "trophy" : "trophy-outline";
              break;
            default:
              iconName = "alert-circle";
          }
          return <Ionicons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
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
