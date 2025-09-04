import React, { useState, useMemo, useLayoutEffect } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useNavigation, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { getTeam } from "@/services/teamStorage";
import { AppStackParamList } from "@/navigation/AppStack";
import { MATCHES_DATA } from "@/constants";
import { Player } from "@/types";
import { formatDate } from "@/utils/formatDate"; 

type MatchDetailsRouteProp = RouteProp<AppStackParamList, "MatchDetails">;
type MatchDetailsNavigationProp = NativeStackNavigationProp<AppStackParamList, "MatchDetails">;

/**
 * Renders a list of players for a specific team.
 */
const PlayerSquadList: React.FC<{ teamName: string; players: Player[] }> = ({ teamName, players }) => (
  <View className="mt-4">
    <Text className="font-poppins-semibold text-base text-primary mb-2">{teamName}</Text>
    <View className="space-y-3 divide-y divide-border dark:divide-dark-border">
      {players.map((player) => (
        <View key={player.id} className="flex-row justify-between items-center pt-3">
          <View>
            <Text className="font-poppins-semibold text-text dark:text-dark-text">{player.name}</Text>
            <Text className="font-lato text-subtext dark:text-dark-subtext">{player.role}</Text>
          </View>
          <Text className="font-poppins-semibold text-text dark:text-dark-text">{player.credit.toFixed(1)} Cr</Text>
        </View>
      ))}
    </View>
  </View>
);

/**
 * Screen to display detailed match info and player squads.
 */
const MatchDetailsScreen: React.FC = () => {
  const navigation = useNavigation<MatchDetailsNavigationProp>();
  const route = useRoute<MatchDetailsRouteProp>();
  const { matchId } = route.params;
  const { user } = useAuth();
  const { colors } = useTheme();

  const match = useMemo(() => MATCHES_DATA.find((m) => m.id === matchId), [matchId]);
  const [teamExists, setTeamExists] = useState(false);

  // Set the screen header title
  useLayoutEffect(() => {
    if (match) navigation.setOptions({ title: `${match.teamA} vs ${match.teamB}` });
  }, [navigation, match]);

  // Check if user has a saved team for this match whenever screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const checkTeamStatus = async () => {
        if (!user || !matchId) return;
        const savedTeam = await getTeam(user.username, matchId);
        setTeamExists(savedTeam !== null);
      };
      checkTeamStatus();
    }, [matchId, user])
  );

  if (!match) {
    return (
      <View className="flex-1 bg-background dark:bg-dark-background p-4 justify-center items-center">
        <MaterialIcons name="error-outline" size={64} color="#9CA3AF" />
        <Text className="text-center text-subtext dark:text-dark-subtext mt-4 text-lg">Match Not Found</Text>
        <Text className="text-center text-subtext dark:text-dark-subtext mt-1 text-sm">
          The match you are looking for could not be found.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(500)}>
          {/* Match Info Card */}
          <View className="bg-card dark:bg-dark-card rounded-xl p-4 mb-4">
            <Text className="font-poppins-semibold text-lg text-text dark:text-dark-text mb-3">Match Info</Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <MaterialIcons name="event" size={20} color={colors.subtext} />
                <Text className="font-lato text-subtext dark:text-dark-subtext ml-3 flex-1">
                  {formatDate(match.date)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="schedule" size={20} color={colors.subtext} />
                <Text className="font-lato text-subtext dark:text-dark-subtext ml-3 flex-1">{match.time}</Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="location-on" size={20} color={colors.subtext} />
                <Text className="font-lato text-subtext dark:text-dark-subtext ml-3 flex-1">{match.venue}</Text>
              </View>
            </View>
          </View>

          {/* Player Squads */}
          <View className="bg-card dark:bg-dark-card rounded-xl p-4 mb-4">
            <Text className="font-poppins-semibold text-xl text-text dark:text-dark-text mb-2">Player Squads</Text>
            <PlayerSquadList teamName={match.teamA} players={match.players.filter((p) => p.team === match.teamA)} />
            <PlayerSquadList teamName={match.teamB} players={match.players.filter((p) => p.team === match.teamB)} />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default MatchDetailsScreen;
