import React from "react";
import { View, Text } from "react-native";
import { Match, PlayerRole } from "@/types";

interface SelectionStatsBarProps {
  stats: {
    playerCount: number;
    creditsLeft: number;
    teamACount: number;
    teamBCount: number;
    roleCounts: Record<PlayerRole, number>;
  };
  match?: Match;
  maxPlayers?: number;
}

const SelectionStatsBar: React.FC<SelectionStatsBarProps> = ({
  stats,
  match,
  maxPlayers = 11,
}) => {
  return (
    <View className="flex-row justify-around p-3 bg-card dark:bg-dark-card border-b border-border dark:border-dark-border">
      <View className="items-center">
        <Text className="font-lato text-sm text-subtext dark:text-dark-subtext">
          Players
        </Text>
        <Text className="font-poppins-semibold text-lg text-text dark:text-dark-text">
          {stats.playerCount}/{maxPlayers}
        </Text>
      </View>

      <View className="items-center">
        <Text className="font-lato text-sm text-subtext dark:text-dark-subtext">
          {match?.teamA}
        </Text>
        <Text className="font-poppins-semibold text-lg text-text dark:text-dark-text">
          {stats.teamACount}
        </Text>
      </View>

      <View className="items-center">
        <Text className="font-lato text-sm text-subtext dark:text-dark-subtext">
          {match?.teamB}
        </Text>
        <Text className="font-poppins-semibold text-lg text-text dark:text-dark-text">
          {stats.teamBCount}
        </Text>
      </View>

      <View className="items-center">
        <Text className="font-lato text-sm text-subtext dark:text-dark-subtext">
          Credits Left
        </Text>
        <Text className="font-poppins-semibold text-lg text-text dark:text-dark-text">
          {stats.creditsLeft.toFixed(1)}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(SelectionStatsBar);
