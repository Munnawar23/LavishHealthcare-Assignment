import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigatorScreenParams } from "@react-navigation/native";
import { useTheme } from "@/hooks/useTheme";
import BottomTabNavigator, { BottomTabParamList } from "./BottomTabNavigator";
import MatchDetailsScreen from "@/screens/MatchDetailsScreen";
import TeamSelectionScreen from "@/screens/TeamSelectionScreen";
import TeamPreviewScreen from "@/screens/TeamPreviewScreen";
import CreateTeamScreen from "@/screens/CreateTeamScreen";

export type AppStackParamList = {
  Main: NavigatorScreenParams<BottomTabParamList>;
  MatchDetails: { matchId: string };
  TeamSelection: { matchId: string; isEdit?: boolean };
  TeamPreview: { matchId: string };
  CreateTeam: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
        headerBackTitle: "",
        animation: "none", 
        gestureEnabled: false, 
        contentStyle: { backgroundColor: colors.background }, 
      }}
    >
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MatchDetails"
        component={MatchDetailsScreen}
        options={{ title: "Match Details" }}
      />
      <Stack.Screen
        name="TeamSelection"
        component={TeamSelectionScreen}
        options={{ title: "Select Your Team" }}
      />
      <Stack.Screen
        name="TeamPreview"
        component={TeamPreviewScreen}
        options={{ title: "Team Preview" }}
      />
      <Stack.Screen
        name="CreateTeam"
        component={CreateTeamScreen}
        options={{ title: "Create a Team" }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
