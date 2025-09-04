// Player roles
export type PlayerRole = 'GK' | 'DEF' | 'MID' | 'FWD';

// Player details
export interface Player {
  id: number;
  name: string;
  team: string;
  role: PlayerRole;
  credit: number;
}

// Match details including players
export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  time: string;
  status: string;
  format: string;
  date: string;
  venue: string;
  players: Player[];
}

// User details
export interface User {
  username: string;
  email: string;
  password: string; 
}
