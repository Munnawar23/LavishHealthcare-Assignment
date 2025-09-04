import React from "react";
import { View, Text } from "react-native";
import { Player } from "@/types";

interface RoleGroupListProps {
  title: string;
  players: Player[];
}

const RoleGroupList: React.FC<RoleGroupListProps> = ({ title, players }) => {
  if (!players || players.length === 0) return null;

  return (
    <View className="mb-4">
      <Text className="font-poppins-bold text-lg text-primary mb-2">
        {title} ({players.length})
      </Text>
      <View className="space-y-2">
        {players.map((player) => (
          <View
            key={player.id}
            className="bg-card dark:bg-dark-card p-3 rounded-lg flex-row items-center"
          >
            <Text className="flex-1 font-poppins-semibold text-text dark:text-dark-text">
              {player.name}
            </Text>
            <Text className="font-lato text-subtext dark:text-dark-subtext">
              {player.team}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default React.memo(RoleGroupList);
