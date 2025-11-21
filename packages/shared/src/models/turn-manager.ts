/**
 * Turn order management
 */

import { GameState, TurnOrderEntry, PlayerState } from '../types';

/**
 * Calculate next turn order based on money spent
 * Players who spent less money go first
 * Ties are broken by maintaining relative order
 */
export function calculateNextTurnOrder(state: GameState): TurnOrderEntry[] {
  const entries = state.turnOrder.map((entry) => {
    const player = state.players.find((p) => p.playerId === entry.playerId);
    return {
      playerId: entry.playerId,
      moneySpent: player?.moneySpentThisTurn || 0,
      order: entry.order, // Keep original order for tie-breaking
    };
  });

  // Sort by money spent (ascending), then by original order
  entries.sort((a, b) => {
    if (a.moneySpent !== b.moneySpent) {
      return a.moneySpent - b.moneySpent;
    }
    return a.order - b.order;
  });

  // Update order indices
  return entries.map((entry, index) => ({
    ...entry,
    order: index,
  }));
}

/**
 * Get current player
 */
export function getCurrentPlayer(state: GameState): PlayerState | undefined {
  const turnEntry = state.turnOrder[state.currentPlayerIndex];
  if (!turnEntry) return undefined;
  return state.players.find((p) => p.playerId === turnEntry.playerId);
}

/**
 * Get player by ID
 */
export function getPlayerById(state: GameState, playerId: string): PlayerState | undefined {
  return state.players.find((p) => p.playerId === playerId);
}

/**
 * Advance to next player
 */
export function advanceToNextPlayer(state: GameState): void {
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
}

/**
 * Reset money spent for all players (at end of round)
 */
export function resetMoneySpent(state: GameState): void {
  state.players.forEach((player) => {
    player.moneySpentThisTurn = 0;
  });
  state.turnOrder.forEach((entry) => {
    entry.moneySpent = 0;
  });
}

/**
 * Reset actions for new turn
 */
export function resetActionsForTurn(state: GameState): void {
  const actionsPerTurn = state.isFirstRound ? 1 : 2;
  state.players.forEach((player) => {
    player.actionsRemainingThisTurn = actionsPerTurn;
    player.hasPassed = false;
  });
}

/**
 * Check if player can take action
 */
export function canPlayerAct(player: PlayerState): boolean {
  return !player.hasPassed && player.actionsRemainingThisTurn > 0;
}
