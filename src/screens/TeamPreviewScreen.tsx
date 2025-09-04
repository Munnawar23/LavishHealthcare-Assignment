import React, { useState, useLayoutEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Alert,
  Pressable,
  Text,
} from "react-native";
import { useNavigation, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

import FullScreenLoader from "@/components/ui/FullScreenLoader";
import RoleGroupList from "@/components/ui/RoleGroupList";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { getTeam, deleteTeam } from "@/services/teamStorage";
import { AppStackParamList } from "@/navigation/AppStack";
import { Player } from "@/types";

type TeamPreviewRouteProp = RouteProp<AppStackParamList, "TeamPreview">;
type TeamPreviewNavigationProp = NativeStackNavigationProp<AppStackParamList, "TeamPreview">;

const TeamPreviewScreen: React.FC = () => {
  const navigation = useNavigation<TeamPreviewNavigationProp>();
  const route = useRoute<TeamPreviewRouteProp>();
  const { matchId } = route.params;
  const { user } = useAuth();
  const { colors } = useTheme();

  const [team, setTeam] = useState<Player[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load team data whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadTeam = async () => {
        if (!user) return setIsLoading(false);
        setIsLoading(true);
        try {
          const savedTeam = await getTeam(user.username, matchId);
          setTeam(savedTeam);
        } catch (error) {
          console.error("Failed to load team:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadTeam();
    }, [matchId, user])
  );

  // Edit team
  const handleEdit = useCallback(() => {
    navigation.navigate("TeamSelection", { matchId, isEdit: true });
  }, [navigation, matchId]);

  // Delete team
  const handleDelete = useCallback(() => {
    Alert.alert("Delete Team", "Are you sure? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!user) return;
          try {
            await deleteTeam(user.username, matchId);
            navigation.goBack();
          } catch (error) {
            console.error("Failed to delete team:", error);
            Alert.alert("Error", "Failed to delete team. Please try again.");
          }
        },
      },
    ]);
  }, [navigation, matchId, user]);

  // Header buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 10, marginRight: 10 }}>
          <Pressable
            onPress={handleEdit}
            hitSlop={10}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <MaterialIcons name="edit" size={24} color={colors.primary} />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            hitSlop={10}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <MaterialIcons name="delete" size={24} color={colors.error} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, colors, handleEdit, handleDelete]);

  if (isLoading) return <FullScreenLoader />;

  // No team found placeholder
  if (!team) {
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-dark-background px-4 pt-4">
        <MaterialIcons
          name={"account-group" as keyof typeof MaterialIcons.glyphMap}
          size={64}
          color={colors.subtext}
        />
        <Text className="text-center text-subtext dark:text-dark-subtext mt-4 text-lg">
          No Team Found
        </Text>
        <Pressable onPress={() => navigation.navigate("TeamSelection", { matchId })}>
          <Text className="text-center text-primary dark:text-primary mt-1 text-sm">
            Tap here to create a team
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <ScrollView contentContainerClassName="px-4 pt-4 pb-4">
        <Animated.View entering={FadeIn.duration(500)}>
          <RoleGroupList title="Goalkeepers" players={team.filter((p) => p.role === "GK")} />
          <RoleGroupList title="Defenders" players={team.filter((p) => p.role === "DEF")} />
          <RoleGroupList title="Midfielders" players={team.filter((p) => p.role === "MID")} />
          <RoleGroupList title="Forwards" players={team.filter((p) => p.role === "FWD")} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default TeamPreviewScreen;
