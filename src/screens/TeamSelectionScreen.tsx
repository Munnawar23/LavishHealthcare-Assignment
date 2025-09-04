import React, {
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Alert,
  ListRenderItemInfo,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import Animated from "react-native-reanimated";
import { BottomTabParamList } from "@/navigation/BottomTabNavigator";
import PlayerListItem from "@/components/ui/PlayerListItem";
import Button from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import { saveTeam, getTeam } from "@/services/teamStorage";
import SelectionStatsBar from "@/components/ui/SelectionStatsBar";

import { AppStackParamList } from "@/navigation/AppStack";
import { MATCHES_DATA } from "@/constants";
import { Match, Player, PlayerRole } from "@/types";

// --- Constants ---
const MAX_PLAYERS = 11;
const MAX_CREDITS = 100;
const MAX_PLAYERS_PER_TEAM = 7;
const ROLE_LIMITS: Record<PlayerRole, number> = { GK: 1, DEF: 5, MID: 5, FWD: 3 };
const ROLE_FILTERS: (PlayerRole | "ALL")[] = ["ALL", "GK", "DEF", "MID", "FWD"];

// --- Navigation types ---
type TeamSelectionRouteProp = RouteProp<AppStackParamList, "TeamSelection">;
type TeamSelectionNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "TeamSelection"
>;

// --- Animated FlatList ---
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Player>);

// --- Stats Bar Component ---
interface SelectionStatsBarProps {
  stats: {
    playerCount: number;
    creditsLeft: number;
    teamACount: number;
    teamBCount: number;
    roleCounts: Record<PlayerRole, number>;
  };
  match?: Match;
}


const TeamSelectionScreen: React.FC = () => {
  const navigation = useNavigation<TeamSelectionNavigationProp>();
  const route = useRoute<TeamSelectionRouteProp>();
  const { matchId, isEdit } = route.params;
  const { user } = useAuth();

  const match = useMemo(() => MATCHES_DATA.find((m) => m.id === matchId), [matchId]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [activeFilter, setActiveFilter] = useState<PlayerRole | "ALL">("ALL");

  // Set header title
  useLayoutEffect(() => {
    navigation.setOptions({ title: isEdit ? "Edit Team" : "Create Team" });
  }, [navigation, isEdit]);

  // Load saved team if editing
  useEffect(() => {
    const loadSavedTeam = async () => {
      if (isEdit && user) {
        const savedTeam = await getTeam(user.username, matchId);
        if (savedTeam) setSelectedPlayers(savedTeam);
      }
    };
    loadSavedTeam();
  }, [isEdit, matchId, user]);

  // --- Compute stats ---
  const stats = useMemo(() => {
    const roleCounts: Record<PlayerRole, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    let teamACount = 0;
    let teamBCount = 0;
    let totalCredits = 0;

    selectedPlayers.forEach((p) => {
      roleCounts[p.role] += 1;
      if (p.team === match?.teamA) teamACount += 1;
      if (p.team === match?.teamB) teamBCount += 1;
      totalCredits += p.credit;
    });

    return {
      playerCount: selectedPlayers.length,
      creditsLeft: MAX_CREDITS - totalCredits,
      teamACount,
      teamBCount,
      roleCounts,
    };
  }, [selectedPlayers, match]);

  // --- Filtered players by role ---
  const filteredPlayers = useMemo(() => {
    if (!match) return [];
    return activeFilter === "ALL"
      ? match.players
      : match.players.filter((p) => p.role === activeFilter);
  }, [activeFilter, match]);

  // --- Player selection logic ---
  const handleSelectPlayer = useCallback(
    (player: Player) => {
      const isSelected = selectedPlayers.some((p) => p.id === player.id);

      // Deselect
      if (isSelected) {
        setSelectedPlayers((prev) => prev.filter((p) => p.id !== player.id));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      }

      // Constraints checks
      if (selectedPlayers.length >= MAX_PLAYERS) {
        Alert.alert("Team Full", `You can only select ${MAX_PLAYERS} players.`);
        return;
      }

      if (stats.creditsLeft < player.credit) {
        Alert.alert("Not Enough Credits", "You don't have enough credits to select this player.");
        return;
      }

      const teamCount =
        player.team === match?.teamA ? stats.teamACount : stats.teamBCount;
      if (teamCount >= MAX_PLAYERS_PER_TEAM) {
        Alert.alert(
          "Team Limit Reached",
          `You can select a maximum of ${MAX_PLAYERS_PER_TEAM} players from ${player.team}.`
        );
        return;
      }

      if (stats.roleCounts[player.role] >= ROLE_LIMITS[player.role]) {
        Alert.alert(
          "Role Limit Reached",
          `You have already selected the maximum number of ${player.role}s.`
        );
        return;
      }

      // Add player
      setSelectedPlayers((prev) => [...prev, player]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    [match, selectedPlayers, stats]
  );

  const isTeamComplete = useMemo(() => selectedPlayers.length === MAX_PLAYERS, [selectedPlayers]);

  // --- Save team ---
const handleSaveAndFinish = async () => {
  if (!isTeamComplete || !user) return;

  try {
    // Save or update team
    await saveTeam(user.username, matchId, selectedPlayers);

    // Show success alert
    Alert.alert(
      isEdit ? "Team Updated!" : "Team Created!",
      isEdit
        ? "Your team has been successfully updated!"
        : "Your team has been successfully created!",
      [
        {
          text: "OK",
          onPress: () => {
            // Navigate to MyMatchesTab in the bottom tab navigator
            navigation.navigate("Main", {
              screen: "MyMatchesTab", // matches BottomTabParamList key
            });
          },
        },
      ]
    );
  } catch (error) {
    // Handle error
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    Alert.alert(
      "Error",
      isEdit
        ? `Failed to update team. Please try again.\n\n${message}`
        : `Failed to create team. Please try again.\n\n${message}`
    );
  }
};



  // --- Render filter chips ---
  const renderFilterChip = ({ item }: { item: PlayerRole | "ALL" }) => (
    <Pressable
      onPress={() => setActiveFilter(item)}
      className={`px-4 py-2 rounded-full mr-2 ${
        activeFilter === item ? "bg-primary" : "bg-card dark:bg-dark-card"
      }`}
    >
      <Text
        className={`font-poppins-semibold ${
          activeFilter === item ? "text-white" : "text-text dark:text-dark-text"
        }`}
      >
        {item} ({item === "ALL" ? stats.playerCount : stats.roleCounts[item]})
      </Text>
    </Pressable>
  );

  // --- Render player list item ---
  const renderPlayerItem = useCallback(
    ({ item }: ListRenderItemInfo<Player>) => (
      <PlayerListItem
        player={item}
        isSelected={selectedPlayers.some((p) => p.id === item.id)}
        onPress={() => handleSelectPlayer(item)}
      />
    ),
    [selectedPlayers, handleSelectPlayer]
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <View className="flex-1">
        {/* Stats bar */}
        <SelectionStatsBar stats={stats} match={match} />

        {/* Role filters */}
        <View className="p-4 border-b border-border dark:border-dark-border">
          <FlatList
            data={ROLE_FILTERS}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item}
          />
        </View>

        {/* Player list */}
        <View className="flex-1">
          <AnimatedFlatList
            data={filteredPlayers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPlayerItem}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View className="flex-row items-center py-3 border-b border-border dark:border-dark-border mb-2">
                <Text className="flex-1 font-lato-bold text-subtext dark:text-dark-subtext">PLAYER</Text>
                <Text className="w-16 text-center font-lato-bold text-subtext dark:text-dark-subtext">CREDITS</Text>
                <View className="w-10" />
              </View>
            }
          />
        </View>

        {/* Save button footer */}
        <View className="border-t border-border dark:border-dark-border bg-card dark:bg-dark-card">
          <View className="p-4 pb-6">
            <Button
              disabled={!isTeamComplete}
              onPress={handleSaveAndFinish}
              title={
                isTeamComplete
                  ? isEdit
                    ? "Update Team"
                    : "Save Team"
                  : `Select ${MAX_PLAYERS - stats.playerCount} more`
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TeamSelectionScreen;
