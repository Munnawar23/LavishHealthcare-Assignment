import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { getTeam } from "@/services/teamStorage";
import { MATCHES_DATA } from "@/constants";
import { Match } from "@/types";

/**
 * Custom hook to fetch match statuses and categorize them as:
 * - upcomingMatches: matches without a team selected
 * - myMatches: matches with a team already selected
 */
export const useFilteredMatches = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [myMatches, setMyMatches] = useState<Match[]>([]);

  const fetchMatchStatuses = useCallback(async () => {
    if (!user) {
      setUpcomingMatches(MATCHES_DATA); // All matches are upcoming if not logged in
      setMyMatches([]);
      setIsLoading(false);
      return;
    }

    // Check which matches have teams selected by the user
    const teamChecks = await Promise.all(
      MATCHES_DATA.map((match) => getTeam(user.username, match.id))
    );

    const upcoming: Match[] = [];
    const my: Match[] = [];

    MATCHES_DATA.forEach((match, index) => {
      if (!teamChecks[index]) {
        upcoming.push(match); // No team -> upcoming
      } else {
        my.push(match); // Team exists -> my match
      }
    });

    setUpcomingMatches(upcoming);
    setMyMatches(my);
    setIsLoading(false);
  }, [user]);

  // Refresh match statuses whenever the screen gains focus
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchMatchStatuses();
    }, [fetchMatchStatuses])
  );

  return { isLoading, upcomingMatches, myMatches };
};
