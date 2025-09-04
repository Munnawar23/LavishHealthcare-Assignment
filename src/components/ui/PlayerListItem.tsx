import React from "react";
import { View, Text, Pressable } from "react-native";
import { Player } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";

interface PlayerListItemProps {
  player: Player;
  isSelected: boolean;
  onPress: (player: Player) => void;
}

/**
 * Memoized player list item with smooth selection animation.
 */
const PlayerListItem: React.FC<PlayerListItemProps> = ({
  player,
  isSelected,
  onPress,
}) => {
  const { colors } = useTheme();

  // Animate background and border on selection
  const animatedContainerStyle = useAnimatedStyle(
    () => ({
      backgroundColor: withTiming(
        isSelected ? colors.primary + "20" : colors.card,
        { duration: 300 }
      ),
      borderColor: withTiming(isSelected ? colors.primary : "transparent", {
        duration: 300,
      }),
    }),
    [isSelected, colors]
  );

  return (
    <Pressable onPress={() => onPress(player)}>
      <Animated.View
        style={animatedContainerStyle}
        className="flex-row items-center p-3 mb-2 rounded-lg border"
      >
        {/* Role Avatar */}
        <View className="w-12 h-12 rounded-full bg-input dark:bg-dark-input justify-center items-center mr-3">
          <Text className="font-poppins-bold text-lg text-subtext dark:text-dark-subtext">
            {player.role}
          </Text>
        </View>

        {/* Player Info */}
        <View className="flex-1">
          <Text className="font-poppins-semibold text-base text-text dark:text-dark-text">
            {player.name}
          </Text>
          <Text className="font-lato text-sm text-subtext dark:text-dark-subtext">
            {player.team}
          </Text>
        </View>

        {/* Credit */}
        <Text className="font-lato-bold w-16 text-center text-text dark:text-dark-text">
          {player.credit.toFixed(1)}
        </Text>

        {/* Selection Icon */}
        <View className="w-10 items-center">
          <MaterialCommunityIcons
            name={isSelected ? "minus-circle" : "plus-circle"}
            size={28}
            color={isSelected ? colors.error : colors.success}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
};

// Prevent unnecessary re-renders in lists
export default React.memo(PlayerListItem);
