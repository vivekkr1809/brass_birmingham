/**
 * Era transition and end-of-round logic
 */

import { GameState, Era, GamePhase } from '../types';
import { calculateNextTurnOrder, resetMoneySpent, resetActionsForTurn } from './turn-manager';
import { createCardDeck } from '../constants/card-data';

/**
 * End current turn and move to next player
 */
export function endTurn(state: GameState): void {
  const currentPlayer = state.players[state.currentPlayerIndex];

  // Refill hand to 8 cards if draw deck has cards
  while (currentPlayer.hand.length < 8 && state.cardDeck.drawPile.length > 0) {
    const card = state.cardDeck.drawPile.shift();
    if (card) {
      currentPlayer.hand.push(card);
    }
  }

  // Move to next player
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

  // If back to first player, check if round is complete
  if (state.currentPlayerIndex === 0) {
    checkRoundComplete(state);
  }

  state.updatedAt = new Date();
}

/**
 * Check if round is complete and handle end of round
 */
function checkRoundComplete(state: GameState): void {
  // Round is complete when all players have empty hands
  const allHandsEmpty = state.players.every((p) => p.hand.length === 0);

  if (allHandsEmpty) {
    endRound(state);
  }
}

/**
 * End current round
 */
export function endRound(state: GameState): void {
  // Recalculate turn order based on money spent
  state.turnOrder = calculateNextTurnOrder(state);

  // Reset money spent counters
  resetMoneySpent(state);

  // Check if era is complete
  if (isEraComplete(state)) {
    endEra(state);
  } else {
    // Continue to next round
    state.currentRound++;
    state.isFirstRound = false;
    resetActionsForTurn(state);
    state.currentPlayerIndex = 0;
  }

  state.updatedAt = new Date();
}

/**
 * Check if era is complete
 */
function isEraComplete(state: GameState): boolean {
  // Era ends when all hands are empty (round complete)
  return state.players.every((p) => p.hand.length === 0);
}

/**
 * End current era and transition to next
 */
export function endEra(state: GameState): void {
  if (state.currentEra === Era.CANAL) {
    transitionToRailEra(state);
  } else {
    endGame(state);
  }
}

/**
 * Transition from Canal Era to Rail Era
 */
function transitionToRailEra(state: GameState): void {
  state.phase = GamePhase.ERA_TRANSITION;

  // Score links: 1 VP per link per adjacent location
  for (const player of state.players) {
    let linkVP = 0;
    const scoredLinks: string[] = [];

    for (const linkId of player.placedLinks) {
      const link = state.board.connections.find((c) => c.id === linkId);
      if (link) {
        // Score based on adjacent locations
        const fromLocation = state.board.locations.get(link.from);
        const toLocation = state.board.locations.get(link.to);

        if (fromLocation && toLocation) {
          // Each end of link scores based on adjacent locations
          linkVP += fromLocation.adjacentLocations.length;
          linkVP += toLocation.adjacentLocations.length;
        }

        scoredLinks.push(linkId);
      }
    }

    player.victoryPoints += linkVP;

    // Remove scored links
    for (const linkId of scoredLinks) {
      const index = player.placedLinks.indexOf(linkId);
      if (index >= 0) {
        player.placedLinks.splice(index, 1);
      }

      const connIndex = state.board.connections.findIndex((c) => c.id === linkId);
      if (connIndex >= 0) {
        state.board.connections.splice(connIndex, 1);
      }
    }
  }

  // Score VPs from flipped industry tiles
  for (const tile of state.placedIndustries.values()) {
    if (tile.isFlipped) {
      const player = state.players.find((p) => p.playerId === tile.playerId);
      if (player) {
        player.victoryPoints += tile.victoryPoints;
      }
    }
  }

  // Remove all level 1 industry tiles (except pottery level 1)
  const tilesToRemove: string[] = [];
  for (const [tileId, tile] of state.placedIndustries.entries()) {
    if (tile.level === 1 && tile.industryType !== 'pottery') {
      tilesToRemove.push(tileId);

      // Clear from board location
      const location = state.board.locations.get(tile.location as any);
      if (location) {
        const slot = location.industrySlots.find((s) => s.currentTile === tileId);
        if (slot) {
          slot.currentTile = undefined;
        }
      }

      // Remove from player's placed industries
      const player = state.players.find((p) => p.playerId === tile.playerId);
      if (player) {
        const index = player.placedIndustries.indexOf(tileId);
        if (index >= 0) {
          player.placedIndustries.splice(index, 1);
        }
      }
    }
  }

  for (const tileId of tilesToRemove) {
    state.placedIndustries.delete(tileId);
  }

  // Reset merchant beer barrels
  for (const merchant of state.board.merchants) {
    if (merchant.hasBeerSpace) {
      merchant.currentBeer = 1;
    }
  }

  // Shuffle all discard piles into new draw deck
  const allDiscards = state.players.flatMap((p) => p.discardPile);
  state.players.forEach((p) => {
    p.discardPile = [];
  });

  // Shuffle discard pile into draw pile
  state.cardDeck.drawPile = [...allDiscards].sort(() => Math.random() - 0.5);

  // Deal new 8-card hands
  for (const player of state.players) {
    player.hand = [];
    for (let i = 0; i < 8; i++) {
      const card = state.cardDeck.drawPile.shift();
      if (card) {
        player.hand.push(card);
      }
    }
  }

  // Update breweries to produce 2 beer in Rail Era
  for (const tile of state.placedIndustries.values()) {
    if (tile.industryType === 'brewery' && !tile.isFlipped) {
      tile.currentResources = 2;
    }
  }

  // Transition to Rail Era
  state.currentEra = Era.RAIL;
  state.currentRound = 1;
  state.isFirstRound = true;
  state.phase = GamePhase.PLAYING;
  state.currentPlayerIndex = 0;
  resetActionsForTurn(state);

  state.updatedAt = new Date();
}

/**
 * End game and calculate final scores
 */
function endGame(state: GameState): void {
  state.phase = GamePhase.FINISHED;

  // Score links (Rail Era)
  for (const player of state.players) {
    let linkVP = 0;

    for (const linkId of player.placedLinks) {
      const link = state.board.connections.find((c) => c.id === linkId);
      if (link) {
        const fromLocation = state.board.locations.get(link.from);
        const toLocation = state.board.locations.get(link.to);

        if (fromLocation && toLocation) {
          linkVP += fromLocation.adjacentLocations.length;
          linkVP += toLocation.adjacentLocations.length;
        }
      }
    }

    player.victoryPoints += linkVP;
  }

  // Score VPs from flipped tiles
  for (const tile of state.placedIndustries.values()) {
    if (tile.isFlipped) {
      const player = state.players.find((p) => p.playerId === tile.playerId);
      if (player) {
        player.victoryPoints += tile.victoryPoints;
      }
    }
  }

  // Collect income (if not final round)
  // Note: Income is NOT collected on the final round
  // This is handled in the round management

  state.updatedAt = new Date();
}

/**
 * Collect income for all players
 */
export function collectIncome(state: GameState): void {
  for (const player of state.players) {
    const incomeValue = player.income;

    if (incomeValue >= 0) {
      // Collect positive income
      player.money += incomeValue;
    } else {
      // Pay negative income
      const amountOwed = Math.abs(incomeValue);

      if (player.money >= amountOwed) {
        player.money -= amountOwed;
      } else {
        // Must sell tiles to pay
        const shortfall = amountOwed - player.money;
        player.money = 0;

        // Sell tiles at half cost (rounded down)
        // This is simplified - in real game, player chooses which tiles to sell
        let moneyFromTiles = 0;
        const tilesToSell: string[] = [];

        for (const tileId of player.placedIndustries) {
          if (moneyFromTiles >= shortfall) break;

          const tile = state.placedIndustries.get(tileId);
          if (tile && !tile.isFlipped) {
            const sellValue = Math.floor(tile.cost.money / 2);
            moneyFromTiles += sellValue;
            tilesToSell.push(tileId);
          }
        }

        player.money += moneyFromTiles;

        // Remove sold tiles
        for (const tileId of tilesToSell) {
          state.placedIndustries.delete(tileId);
          const index = player.placedIndustries.indexOf(tileId);
          if (index >= 0) {
            player.placedIndustries.splice(index, 1);
          }
        }

        // If still short, lose 1 VP per £1
        if (moneyFromTiles < shortfall) {
          const stillShort = shortfall - moneyFromTiles;
          player.victoryPoints -= stillShort;
        }
      }
    }
  }
}

/**
 * Determine winner
 */
export function determineWinner(state: GameState): string {
  let winner = state.players[0];

  for (const player of state.players) {
    // Compare VP first
    if (player.victoryPoints > winner.victoryPoints) {
      winner = player;
    } else if (player.victoryPoints === winner.victoryPoints) {
      // Tie-breaker: income
      if (player.income > winner.income) {
        winner = player;
      } else if (player.income === winner.income) {
        // Second tie-breaker: money
        if (player.money > winner.money) {
          winner = player;
        }
      }
    }
  }

  return winner.playerId;
}
