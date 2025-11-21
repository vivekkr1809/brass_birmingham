/**
 * Game initialization and factory functions
 */

import { nanoid } from 'nanoid';
import {
  GameState,
  GameConfig,
  PlayerState,
  Era,
  GamePhase,
  PlayerCount,
  PlayerColor,
  IndustryType,
  TurnOrderEntry,
  BoardState,
} from '../types';
import {
  COTTON_MILL_TILES,
  COAL_MINE_TILES,
  IRON_WORKS_TILES,
  MANUFACTURER_TILES,
  POTTERY_TILES,
  BREWERY_TILES,
} from '../types/industry';
import { createCardDeck } from '../constants/card-data';
import { BOARD_LOCATIONS, getMerchantsForPlayerCount } from '../constants/board-data';
import { COAL_MARKET_SPACES, IRON_MARKET_SPACES } from '../types/board';
import { getIncomeSpaceNumber } from '../types/player';

/**
 * Create a new game instance
 */
export function createGame(config: GameConfig, playerIds: string[]): GameState {
  const { playerCount } = config;

  if (playerIds.length !== playerCount) {
    throw new Error(`Expected ${playerCount} players, got ${playerIds.length}`);
  }

  // Determine max rounds based on player count
  const maxRounds = config.maxRounds || getMaxRoundsForPlayerCount(playerCount);

  // Create players
  const players = createPlayers(playerIds, playerCount);

  // Create card deck
  const cardDeck = createCardDeck(playerCount);

  // Deal initial hands (8 cards per player + 1 to discard)
  dealInitialHands(players, cardDeck);

  // Create board state
  const board = createInitialBoardState(playerCount);

  // Create initial turn order (randomized)
  const turnOrder = createInitialTurnOrder(players);

  return {
    gameId: nanoid(),
    phase: GamePhase.PLAYING,
    currentEra: Era.CANAL,
    currentRound: 1,
    maxRounds,
    playerCount,
    players,
    turnOrder,
    currentPlayerIndex: 0,
    board,
    cardDeck,
    placedIndustries: new Map(),
    isFirstRound: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Create player states
 */
function createPlayers(playerIds: string[], playerCount: PlayerCount): PlayerState[] {
  const colors = [PlayerColor.RED, PlayerColor.BLUE, PlayerColor.GREEN, PlayerColor.PURPLE];

  return playerIds.map((playerId, index) => {
    const color = colors[index];

    return {
      playerId,
      userId: playerId, // In real app, this would be separate
      money: 17, // Starting money
      income: 10, // Starting income level (index on track)
      victoryPoints: 0,
      hand: [],
      discardPile: [],
      linkTilesRemaining: 14,
      industryTiles: createPlayerIndustryTiles(playerId),
      placedIndustries: [],
      placedLinks: [],
      moneySpentThisTurn: 0,
      actionsRemainingThisTurn: 1, // First round has 1 action
      hasPassed: false,
    };
  });
}

/**
 * Create a player's initial industry tile set
 */
function createPlayerIndustryTiles(playerId: string) {
  let tileIdCounter = 0;

  const createTiles = (definitions: any[]) => {
    return definitions.map((def) => ({
      ...def,
      id: `${playerId}-tile-${tileIdCounter++}`,
      playerId,
      isFlipped: false,
      currentResources: def.resourceCapacity || 0,
    }));
  };

  return {
    [IndustryType.COTTON_MILL]: createTiles(COTTON_MILL_TILES),
    [IndustryType.COAL_MINE]: createTiles(COAL_MINE_TILES),
    [IndustryType.IRON_WORKS]: createTiles(IRON_WORKS_TILES),
    [IndustryType.MANUFACTURER]: createTiles(MANUFACTURER_TILES),
    [IndustryType.POTTERY]: createTiles(POTTERY_TILES),
    [IndustryType.BREWERY]: createTiles(BREWERY_TILES),
  };
}

/**
 * Deal initial hands to players
 */
function dealInitialHands(players: PlayerState[], cardDeck: any) {
  for (const player of players) {
    // Deal 8 cards to hand
    for (let i = 0; i < 8; i++) {
      const card = cardDeck.drawPile.shift();
      if (card) {
        player.hand.push(card);
      }
    }

    // Deal 1 card face down to discard pile
    const discardCard = cardDeck.drawPile.shift();
    if (discardCard) {
      player.discardPile.push(discardCard);
    }
  }
}

/**
 * Create initial board state
 */
function createInitialBoardState(playerCount: PlayerCount): BoardState {
  // Create locations map
  const locations = new Map();
  BOARD_LOCATIONS.forEach((loc) => {
    locations.set(loc.name, {
      ...loc,
      industrySlots: loc.industrySlots.map((slot) => ({ ...slot })),
    });
  });

  // Create coal market
  const coalMarket = {
    spaces: COAL_MARKET_SPACES.map((space) => ({
      ...space,
      count: space.price === 1 ? space.maxCount - 1 : space.maxCount, // Leave one £1 space empty
    })),
  };

  // Create iron market
  const ironMarket = {
    spaces: IRON_MARKET_SPACES.map((space) => ({
      ...space,
      count: space.price === 1 ? 0 : space.maxCount, // Leave both £1 spaces empty
    })),
  };

  // Get merchants for player count
  const merchants = getMerchantsForPlayerCount(playerCount);

  return {
    locations,
    connections: [],
    merchants,
    coalMarket,
    ironMarket,
  };
}

/**
 * Create initial turn order (randomized)
 */
function createInitialTurnOrder(players: PlayerState[]): TurnOrderEntry[] {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  return shuffled.map((player, index) => ({
    playerId: player.playerId,
    moneySpent: 0,
    order: index,
  }));
}

/**
 * Get max rounds based on player count
 */
function getMaxRoundsForPlayerCount(playerCount: PlayerCount): number {
  switch (playerCount) {
    case PlayerCount.TWO:
      return 10;
    case PlayerCount.THREE:
      return 9;
    case PlayerCount.FOUR:
      return 8;
    default:
      return 8;
  }
}

/**
 * Check if game is finished
 */
export function isGameFinished(state: GameState): boolean {
  return state.phase === GamePhase.FINISHED;
}

/**
 * Check if all players have passed
 */
export function allPlayersPassed(state: GameState): boolean {
  return state.players.every((p) => p.hasPassed);
}

/**
 * Check if round is complete (all hands empty)
 */
export function isRoundComplete(state: GameState): boolean {
  return state.players.every((p) => p.hand.length === 0);
}

/**
 * Check if era is complete
 */
export function isEraComplete(state: GameState): boolean {
  return isRoundComplete(state);
}
