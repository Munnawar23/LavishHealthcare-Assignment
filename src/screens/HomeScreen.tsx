import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInUp } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";

import MatchCard from "@/components/common/MatchCard";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { useFilteredMatches } from "@/hooks/useFilteredMatches";
import { AppStackParamList } from "@/navigation/AppStack";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "Main"
>;

/**
 * HomeScreen displays upcoming matches and a welcome header.
 * Includes logout button and animated match cards.
 */
const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { logout, user } = useAuth();
  const { colors } = useTheme();
  const { isLoading, upcomingMatches } = useFilteredMatches();

  // --- Configure header ---
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          <Text className="font-lato text-sm text-subtext dark:text-dark-subtext">
            Welcome back,
          </Text>
          <Text className="font-poppins-semibold text-lg text-text dark:text-dark-text -mt-1">
            {user?.username || "Player"}
          </Text>
        </View>
      ),
      headerRight: () => (
        <Pressable onPress={logout} className="p-2 active:opacity-60">
          <MaterialIcons name="logout" size={26} color={colors.primary} />
        </Pressable>
      ),
      headerShadowVisible: false,
    });
  }, [navigation, user, logout, colors]);

  if (isLoading) return <FullScreenLoader />; // Show loader while fetching matches

  return (
    <ScrollView className="flex-1 bg-background dark:bg-dark-background p-4">
      {/* Section title */}
      <Text className="font-poppins-bold text-xl text-text dark:text-dark-text mb-3">
        Upcoming Matches
      </Text>

      {/* Render upcoming matches */}
      {upcomingMatches.length === 0 ? (
        <Text className="text-subtext dark:text-dark-subtext mt-4">
          There are no upcoming matches to display.
        </Text>
      ) : (
        upcomingMatches.map((match, index) => (
          <Animated.View
            key={match.id}
            entering={FadeInUp.duration(500).delay(index * 150)} // Animated entry with stagger
          >
            <MatchCard
              match={match}
              onPress={() =>
                navigation.navigate("MatchDetails", { matchId: match.id })
              }
              showActionButton={false} // Hide button in home
            />
          </Animated.View>
        ))
      )}
    </ScrollView>
  );
};

export default HomeScreen;
