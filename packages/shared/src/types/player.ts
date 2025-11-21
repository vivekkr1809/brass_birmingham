/**
 * Player types and state for Brass Birmingham
 */

import { PlayerColor, IndustryType } from './enums';
import { GameCard } from './card';
import { IndustryTile } from './industry';

/**
 * Player information
 */
export interface Player {
  id: string;
  userId: string;
  name: string;
  color: PlayerColor;
  isReady: boolean;
  isConnected: boolean;
}

/**
 * Player game state
 */
export interface PlayerState {
  playerId: string;
  money: number;
  income: number; // -10 to 30
  victoryPoints: number;
  hand: GameCard[];
  discardPile: GameCard[];
  linkTilesRemaining: number; // 14 at start
  industryTiles: PlayerIndustryTiles; // Tiles on player mat
  placedIndustries: string[]; // IDs of placed industry tiles
  placedLinks: string[]; // IDs of placed link connections
  moneySpentThisTurn: number; // For turn order calculation
  actionsRemainingThisTurn: number; // 1 in first round, 2 thereafter
  hasPassed: boolean;
}

/**
 * Player's industry tiles organized by type and level
 */
export interface PlayerIndustryTiles {
  [IndustryType.COTTON_MILL]: IndustryTile[];
  [IndustryType.COAL_MINE]: IndustryTile[];
  [IndustryType.IRON_WORKS]: IndustryTile[];
  [IndustryType.MANUFACTURER]: IndustryTile[];
  [IndustryType.POTTERY]: IndustryTile[];
  [IndustryType.BREWERY]: IndustryTile[];
}

/**
 * Turn order entry
 */
export interface TurnOrderEntry {
  playerId: string;
  moneySpent: number;
  order: number; // For tie-breaking
}

/**
 * Income level definitions
 * Income track goes from -10 to +30
 * Grouped into levels with multiple spaces per level
 */
export interface IncomeLevel {
  level: number;
  spaces: number; // Number of spaces in this level
  income: number; // Money gained/paid at this level
}

export const INCOME_LEVELS: IncomeLevel[] = [
  { level: -10, spaces: 1, income: -10 },
  { level: -9, spaces: 1, income: -9 },
  { level: -8, spaces: 1, income: -8 },
  { level: -7, spaces: 1, income: -7 },
  { level: -6, spaces: 1, income: -6 },
  { level: -5, spaces: 1, income: -5 },
  { level: -4, spaces: 1, income: -4 },
  { level: -3, spaces: 1, income: -3 },
  { level: -2, spaces: 1, income: -2 },
  { level: -1, spaces: 1, income: -1 },
  { level: 0, spaces: 1, income: 0 },
  { level: 1, spaces: 1, income: 1 },
  { level: 2, spaces: 1, income: 2 },
  { level: 3, spaces: 1, income: 3 },
  { level: 4, spaces: 1, income: 4 },
  { level: 5, spaces: 1, income: 5 },
  { level: 6, spaces: 1, income: 6 },
  { level: 7, spaces: 1, income: 7 },
  { level: 8, spaces: 1, income: 8 },
  { level: 9, spaces: 1, income: 9 },
  { level: 10, spaces: 1, income: 10 },
  { level: 11, spaces: 2, income: 11 },
  { level: 12, spaces: 2, income: 12 },
  { level: 13, spaces: 2, income: 13 },
  { level: 14, spaces: 2, income: 14 },
  { level: 15, spaces: 2, income: 15 },
  { level: 16, spaces: 3, income: 16 },
  { level: 17, spaces: 3, income: 17 },
  { level: 18, spaces: 3, income: 18 },
  { level: 19, spaces: 3, income: 19 },
  { level: 20, spaces: 4, income: 20 },
  { level: 21, spaces: 4, income: 21 },
  { level: 22, spaces: 4, income: 22 },
  { level: 23, spaces: 4, income: 23 },
  { level: 24, spaces: 5, income: 24 },
  { level: 25, spaces: 5, income: 25 },
  { level: 26, spaces: 5, income: 26 },
  { level: 27, spaces: 6, income: 27 },
  { level: 28, spaces: 6, income: 28 },
  { level: 29, spaces: 7, income: 29 },
  { level: 30, spaces: 8, income: 30 },
];

/**
 * Helper functions for income management
 */
export function getIncomeValue(incomeSpaceNumber: number): number {
  let currentSpace = 0;
  for (const level of INCOME_LEVELS) {
    if (currentSpace + level.spaces > incomeSpaceNumber) {
      return level.income;
    }
    currentSpace += level.spaces;
  }
  return 30; // Max income
}

export function getIncomeSpaceNumber(incomeLevel: number): number {
  // Returns the first space of the given income level
  let spaceNumber = 0;
  for (const level of INCOME_LEVELS) {
    if (level.level === incomeLevel) {
      return spaceNumber;
    }
    spaceNumber += level.spaces;
  }
  return spaceNumber;
}

export function adjustIncomeSpaces(currentSpace: number, spacesToMove: number): number {
  const newSpace = currentSpace + spacesToMove;
  const minSpace = 0; // -10 income
  const maxSpace = INCOME_LEVELS.reduce((sum, level) => sum + level.spaces, 0) - 1;
  return Math.max(minSpace, Math.min(maxSpace, newSpace));
}

export function adjustIncomeLevels(
  currentSpace: number,
  levelsToMove: number,
  preferHighest: boolean = true
): number {
  // Get current income level
  let spaceCount = 0;
  let currentLevel = INCOME_LEVELS[0];

  for (const level of INCOME_LEVELS) {
    if (currentSpace < spaceCount + level.spaces) {
      currentLevel = level;
      break;
    }
    spaceCount += level.spaces;
  }

  // Find target level
  const targetLevelIndex = INCOME_LEVELS.findIndex((l) => l.level === currentLevel.level);
  const newLevelIndex = Math.max(
    0,
    Math.min(INCOME_LEVELS.length - 1, targetLevelIndex + levelsToMove)
  );
  const newLevel = INCOME_LEVELS[newLevelIndex];

  // Find the space number for the new level
  let newSpaceNumber = 0;
  for (let i = 0; i < newLevelIndex; i++) {
    newSpaceNumber += INCOME_LEVELS[i].spaces;
  }

  // If preferHighest, place on highest space in the level
  if (preferHighest) {
    newSpaceNumber += newLevel.spaces - 1;
  }

  return newSpaceNumber;
}
