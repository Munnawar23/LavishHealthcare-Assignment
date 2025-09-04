import { storage } from './storage';
import { Player } from '@/types';

const TEAM_STORAGE_KEY_PREFIX = '@myTeam';

// Generate a unique storage key for a user's team in a match
const getTeamKey = (username: string, matchId: string) =>
  `${TEAM_STORAGE_KEY_PREFIX}:${username}:${matchId}`;

// Save a user's team for a match
export const saveTeam = (username: string, matchId: string, team: Player[]): Promise<void> => {
  const key = getTeamKey(username, matchId);
  return storage.save(key, team);
};

// Get a user's team for a match
export const getTeam = (username: string, matchId: string): Promise<Player[] | null> => {
  const key = getTeamKey(username, matchId);
  return storage.get<Player[]>(key);
};

// Delete a user's team for a match
export const deleteTeam = (username: string, matchId: string): Promise<void> => {
  const key = getTeamKey(username, matchId);
  return storage.remove(key);
};
