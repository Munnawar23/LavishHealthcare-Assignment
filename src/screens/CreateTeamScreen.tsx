import React, { useState, useCallback } from "react";
import { View, ScrollView, Text } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInUp } from "react-native-reanimated";

import MatchCard from "@/components/common/MatchCard";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import { useAuth } from "@/context/AuthContext";
import { getTeam } from "@/services/teamStorage";
import { AppStackParamList } from "@/navigation/AppStack";
import { MATCHES_DATA } from "@/constants";

/**
 * Screen for creating or previewing a team for a match.
 * Checks which matches already have a user-created team.
 */
type CreateTeamScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "CreateTeam"
>;

const CreateTeamScreen: React.FC = () => {
  const navigation = useNavigation<CreateTeamScreenNavigationProp>();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [teamExistenceMap, setTeamExistenceMap] = useState<
    Record<string, boolean>
  >({});

  // Check which matches already have a team created by the user
  const checkAllTeamsStatus = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const checks = MATCHES_DATA.map(async (match) => {
      const team = await getTeam(user.username, match.id);
      return [match.id, team !== null] as [string, boolean];
    });

    const results = await Promise.all(checks);
    setTeamExistenceMap(Object.fromEntries(results));
    setIsLoading(false);
  }, [user]);

  // Refetch team status whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      checkAllTeamsStatus();
    }, [checkAllTeamsStatus])
  );

  if (isLoading) return <FullScreenLoader />;

  return (
    <ScrollView className="flex-1 bg-background dark:bg-dark-background p-4">

      {/* Render matches as cards with action buttons */}
      {MATCHES_DATA.length === 0 ? (
        <Text className="text-subtext dark:text-dark-subtext mt-4">
          There are no upcoming matches available to create a team for.
        </Text>
      ) : (
        MATCHES_DATA.map((match, index) => {
          const teamExists = teamExistenceMap[match.id];
          const actionButtonText = teamExists
            ? "Edit / View Team"
            : "Create Team";
          const destinationScreen = teamExists
            ? "TeamPreview"
            : "TeamSelection";

          return (
            <Animated.View
              key={match.id}
              entering={FadeInUp.duration(500).delay(index * 100)} // Animated entry with stagger
            >
              <MatchCard
                match={match}
                onPress={() =>
                  navigation.navigate("MatchDetails", { matchId: match.id })
                }
                actionButtonText={actionButtonText}
                onActionPress={() =>
                  navigation.navigate(destinationScreen, { matchId: match.id })
                }
              />
            </Animated.View>
          );
        })
      )}
    </ScrollView>
  );
};

export default CreateTeamScreen;
