/**
 * Game state and action types for Brass Birmingham
 */

import { Era, GamePhase, PlayerCount } from './enums';
import { BoardState } from './board';
import { PlayerState, TurnOrderEntry } from './player';
import { CardDeck } from './card';
import { PlacedIndustryTile } from './industry';

/**
 * Complete game state
 */
export interface GameState {
  gameId: string;
  phase: GamePhase;
  currentEra: Era;
  currentRound: number;
  maxRounds: number; // 8 for 4p, 9 for 3p, 10 for 2p
  playerCount: PlayerCount;
  players: PlayerState[];
  turnOrder: TurnOrderEntry[];
  currentPlayerIndex: number;
  board: BoardState;
  cardDeck: CardDeck;
  placedIndustries: Map<string, PlacedIndustryTile>; // Tile ID -> Tile
  isFirstRound: boolean; // First round has only 1 action
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Game configuration for creating a new game
 */
export interface GameConfig {
  playerCount: PlayerCount;
  maxRounds?: number; // Auto-calculated if not provided
  boardSide?: 'day' | 'night'; // Future expansion
}

/**
 * Game lobby for matchmaking
 */
export interface GameLobby {
  lobbyId: string;
  hostId: string;
  name: string;
  config: GameConfig;
  players: { userId: string; name: string; isReady: boolean }[];
  isPublic: boolean;
  inviteCode?: string;
  createdAt: Date;
}

/**
 * Game result and statistics
 */
export interface GameResult {
  gameId: string;
  players: PlayerResult[];
  winnerId: string;
  completedAt: Date;
  totalRounds: number;
}

export interface PlayerResult {
  playerId: string;
  userId: string;
  name: string;
  finalScore: number;
  finalIncome: number;
  finalMoney: number;
  tilesVP: number;
  linksVP: number;
  placement: number; // 1st, 2nd, 3rd, 4th
}
