import React from "react";
import { View, Text, Pressable } from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

import Button from "@/components/common/Button";
import { useTheme } from "@/hooks/useTheme";
import { Match } from "@/types";
import { formatDate } from "@/utils/formatDate"; // <-- import from new utils file

interface MatchCardProps {
  match: Match;
  onPress?: () => void;
  showActionButton?: boolean;
  actionButtonText?: string;
  onActionPress?: () => void;
  actionButtonVariant?: "primary" | "secondary" | "outline";
}

// Display a team with icon and name
const TeamDisplay: React.FC<{ name: string; icon: React.ReactNode }> = ({
  name,
  icon,
}) => (
  <View className="flex-1 items-center">
    <View className="w-16 h-16 rounded-full mb-2 items-center justify-center bg-primary-light dark:bg-primary/20">
      {icon}
    </View>
    <Text
      className="font-poppins-semibold text-text dark:text-dark-text text-center"
      numberOfLines={1}
    >
      {name}
    </Text>
  </View>
);

/**
 * MatchCard component shows a summary of a match with teams, date/time, venue, and optional action button.
 * Includes entry animation and theme-aware styling.
 */
const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onPress,
  showActionButton = true,
  actionButtonText = "View Match",
  onActionPress,
  actionButtonVariant = "primary",
}) => {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      className="bg-card dark:bg-dark-card rounded-2xl mb-4 overflow-hidden border border-border dark:border-dark-border"
    >
      {/* Teams Section */}
      <Pressable
        onPress={onPress}
        className="p-4 active:opacity-80"
        disabled={!onPress}
      >
        <View className="flex-row items-center justify-between">
          <TeamDisplay
            name={match.teamA}
            icon={
              <MaterialCommunityIcons
                name="shield-star"
                size={32}
                color="#2A9D8F"
              />
            }
          />
          <View className="items-center px-2">
            <Text className="text-2xl font-poppins-bold text-subtext/50 dark:text-dark-subtext/50">
              VS
            </Text>
            <Text className="font-lato text-sm text-subtext dark:text-dark-subtext mt-1">
              {match.format}
            </Text>
          </View>
          <TeamDisplay
            name={match.teamB}
            icon={<FontAwesome5 name="dragon" size={28} color="#E76F51" />}
          />
        </View>
      </Pressable>

      {/* Match Info Section */}
      <View className="border-t border-border dark:border-dark-border p-4 space-y-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <MaterialIcons name="event" size={16} color={colors.subtext} />
            <Text className="font-lato text-subtext dark:text-dark-subtext ml-2 text-sm">
              {formatDate(match.date)}
            </Text>
          </View>
          <View className="flex-row items-center flex-1">
            <MaterialIcons name="schedule" size={16} color={colors.subtext} />
            <Text className="font-lato text-subtext dark:text-dark-subtext ml-2 text-sm">
              {match.time}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <MaterialIcons name="location-on" size={16} color={colors.subtext} />
          <Text className="font-lato text-subtext dark:text-dark-subtext ml-2 text-sm flex-1">
            {match.venue}
          </Text>
        </View>
      </View>

      {/* Optional Action Button */}
      {showActionButton && (
        <View className="bg-background dark:bg-dark-background p-4 border-t border-border dark:border-dark-border">
          <Button
            title={actionButtonText}
            variant={actionButtonVariant}
            onPress={onActionPress}
          />
        </View>
      )}
    </Animated.View>
  );
};

export default MatchCard;
