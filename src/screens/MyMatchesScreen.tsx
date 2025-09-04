import React, { useState, useCallback } from "react";
import { View, ScrollView, Text } from "react-native";
import {
  useNavigation,
  useFocusEffect,
  CompositeNavigationProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import Animated, { FadeInUp } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";

import MatchCard from "@/components/common/MatchCard";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import { useAuth } from "@/context/AuthContext";
import { getTeam } from "@/services/teamStorage";

import { AppStackParamList } from "@/navigation/AppStack";
import { BottomTabParamList } from "@/navigation/BottomTabNavigator";
import { MATCHES_DATA } from "@/constants";
import { Match } from "@/types";

type MyMatchesNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, "MyMatchesTab">,
  NativeStackNavigationProp<AppStackParamList>
>;

/**
 * Screen displaying matches for which the user has already created a team.
 * Fetches data every time the screen comes into focus.
 */
const MyMatchesScreen: React.FC = () => {
  const navigation = useNavigation<MyMatchesNavigationProp>();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [myMatches, setMyMatches] = useState<Match[]>([]);

  /**
   * Fetch matches where the user has a saved team
   */
  const fetchMyMatches = useCallback(async () => {
    if (!user) {
      setMyMatches([]);
      setIsLoading(false);
      return;
    }

    // Check each match for a saved team
    const teamChecks = await Promise.all(
      MATCHES_DATA.map((match) => getTeam(user.username, match.id))
    );

    // Filter only matches with a saved team
    const userMatches = MATCHES_DATA.filter(
      (_, index) => teamChecks[index] !== null
    );
    setMyMatches(userMatches);
    setIsLoading(false);
  }, [user]);

  /**
   * Refresh data whenever screen gains focus
   */
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchMyMatches();
    }, [fetchMyMatches])
  );

  if (isLoading) return <FullScreenLoader />;

  return (
    <ScrollView className="flex-1 bg-background dark:bg-dark-background p-4">
      {/* Render matches or empty state */}
      {myMatches.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-72">
          <MaterialIcons name="emoji-events" size={64} color="#9CA3AF" />
          <Text className="text-center text-subtext dark:text-dark-subtext mt-4 text-lg">
            You haven't created any teams yet.
          </Text>
          <Text className="text-center text-subtext dark:text-dark-subtext mt-1 text-sm">
            Create a team for an upcoming match and it will appear here.
          </Text>
        </View>
      ) : (
        myMatches.map((match, index) => (
          <Animated.View
            key={match.id}
            entering={FadeInUp.duration(500).delay(index * 100)}
          >
            <MatchCard
              match={match}
              onPress={() =>
                navigation.navigate("MatchDetails", { matchId: match.id })
              }
              actionButtonText="View / Edit Team"
              onActionPress={() =>
                navigation.navigate("TeamPreview", { matchId: match.id })
              }
            />
          </Animated.View>
        ))
      )}
    </ScrollView>
  );
};

export default MyMatchesScreen;
