/**
 * Validators and executors for Develop, Loan, Scout, and Pass actions
 */

import {
  GameState,
  DevelopAction,
  LoanAction,
  ScoutAction,
  PassAction,
  ActionValidation,
  ActionResult,
  StateChange,
} from '../types';
import { findIronSources, consumeResources } from '../utils/resources';
import { getPlayerById } from '../models/turn-manager';
import { isWildCard } from '../types/card';

/**
 * Validate develop action
 */
export function validateDevelopAction(state: GameState, action: DevelopAction): ActionValidation {
  const errors: string[] = [];
  const player = getPlayerById(state, action.playerId);

  if (!player) {
    return { valid: false, errors: ['Player not found'] };
  }

  // Check player has the card in hand
  const hasCard = player.hand.some((c) => c.id === action.cardUsed.id);
  if (!hasCard) {
    errors.push('Card not in player hand');
  }

  // Check 1 or 2 tiles
  if (action.tileIds.length === 0 || action.tileIds.length > 2) {
    errors.push('Can only develop 1 or 2 tiles');
  }

  // Check each tile
  for (const tileId of action.tileIds) {
    const tile = state.placedIndustries.get(tileId);
    if (!tile) {
      errors.push(`Tile ${tileId} not found`);
      continue;
    }

    // Check tile belongs to player
    if (tile.playerId !== action.playerId) {
      errors.push('Can only develop own tiles');
      continue;
    }

    // Check tile is not flipped
    if (tile.isFlipped) {
      errors.push(`Tile ${tileId} is already flipped`);
      continue;
    }

    // Check for lightbulb restriction (pottery)
    if (tile.hasLightbulb) {
      errors.push('Cannot develop pottery tiles with lightbulb');
      continue;
    }

    // Check it's the lowest level tile of this type
    const playerTiles = Array.from(state.placedIndustries.values()).filter(
      (t) => t.playerId === action.playerId && t.industryType === tile.industryType && !t.isFlipped
    );

    const lowestLevel = Math.min(...playerTiles.map((t) => t.level));
    if (tile.level !== lowestLevel) {
      errors.push(`Must develop lowest level ${tile.industryType} first`);
    }
  }

  // Check iron requirement (1 per tile)
  const ironNeeded = action.tileIds.length;
  const ironSources = findIronSources(state, action.playerId, ironNeeded);
  if (ironSources.length < ironNeeded) {
    errors.push(`Not enough iron available (need ${ironNeeded})`);
  }

  // Check money for iron cost
  const ironCost = action.ironSources.reduce((sum, s) => sum + s.cost, 0);
  if (player.money < ironCost) {
    errors.push(`Not enough money for iron (need £${ironCost})`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Execute develop action
 */
export function executeDevelopAction(state: GameState, action: DevelopAction): ActionResult {
  const validation = validateDevelopAction(state, action);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      stateChanges: [],
    };
  }

  const stateChanges: StateChange[] = [];
  const player = getPlayerById(state, action.playerId)!;

  // Consume iron
  const ironCost = consumeResources(state, action.ironSources);
  player.money -= ironCost;
  player.moneySpentThisTurn += ironCost;
  stateChanges.push({
    type: 'resource_consumed',
    playerId: action.playerId,
    details: { resource: 'iron', quantity: action.tileIds.length, cost: ironCost },
  });

  // Remove tiles
  for (const tileId of action.tileIds) {
    const tile = state.placedIndustries.get(tileId);
    if (tile) {
      // Remove from board
      state.placedIndustries.delete(tileId);

      // Update location slot
      const location = state.board.locations.get(tile.location as any);
      if (location) {
        const slot = location.industrySlots.find((s) => s.currentTile === tileId);
        if (slot) {
          slot.currentTile = undefined;
        }
      }

      // Remove from player's placed industries
      const index = player.placedIndustries.indexOf(tileId);
      if (index >= 0) {
        player.placedIndustries.splice(index, 1);
      }

      stateChanges.push({
        type: 'tile_removed',
        playerId: action.playerId,
        details: { tileId, industryType: tile.industryType, level: tile.level },
      });
    }
  }

  // Discard card
  const cardIndex = player.hand.findIndex((c) => c.id === action.cardUsed.id);
  if (cardIndex >= 0) {
    const card = player.hand.splice(cardIndex, 1)[0];
    player.discardPile.push(card);
    stateChanges.push({
      type: 'card_discarded',
      playerId: action.playerId,
      details: { cardId: card.id },
    });
  }

  // Reduce actions
  player.actionsRemainingThisTurn--;

  state.updatedAt = new Date();

  return {
    success: true,
    errors: [],
    stateChanges,
  };
}

/**
 * Validate loan action
 */
export function validateLoanAction(state: GameState, action: LoanAction): ActionValidation {
  const errors: string[] = [];
  const player = getPlayerById(state, action.playerId);

  if (!player) {
    return { valid: false, errors: ['Player not found'] };
  }

  // Check player has the card in hand
  const hasCard = player.hand.some((c) => c.id === action.cardUsed.id);
  if (!hasCard) {
    errors.push('Card not in player hand');
  }

  // Check won't go below -10 income
  // Loan moves income back 3 LEVELS (not spaces)
  const currentIncome = player.income;
  if (currentIncome - 3 < -10) {
    errors.push('Cannot take loan - would go below -10 income');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Execute loan action
 */
export function executeLoanAction(state: GameState, action: LoanAction): ActionResult {
  const validation = validateLoanAction(state, action);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      stateChanges: [],
    };
  }

  const stateChanges: StateChange[] = [];
  const player = getPlayerById(state, action.playerId)!;

  // Give £30
  player.money += 30;
  stateChanges.push({
    type: 'money',
    playerId: action.playerId,
    details: { amount: 30, newTotal: player.money, reason: 'loan' },
  });

  // Decrease income by 3 levels
  const oldIncome = player.income;
  player.income -= 3;
  if (player.income < -10) player.income = -10;
  stateChanges.push({
    type: 'income',
    playerId: action.playerId,
    details: { change: -3, oldIncome, newIncome: player.income },
  });

  // Discard card
  const cardIndex = player.hand.findIndex((c) => c.id === action.cardUsed.id);
  if (cardIndex >= 0) {
    const card = player.hand.splice(cardIndex, 1)[0];
    player.discardPile.push(card);
    stateChanges.push({
      type: 'card_discarded',
      playerId: action.playerId,
      details: { cardId: card.id },
    });
  }

  // Reduce actions
  player.actionsRemainingThisTurn--;

  state.updatedAt = new Date();

  return {
    success: true,
    errors: [],
    stateChanges,
  };
}

/**
 * Validate scout action
 */
export function validateScoutAction(state: GameState, action: ScoutAction): ActionValidation {
  const errors: string[] = [];
  const player = getPlayerById(state, action.playerId);

  if (!player) {
    return { valid: false, errors: ['Player not found'] };
  }

  // Check player has the card in hand
  const hasCard = player.hand.some((c) => c.id === action.cardUsed.id);
  if (!hasCard) {
    errors.push('Card not in player hand');
  }

  // Check no wild cards in hand
  const hasWildCard = player.hand.some((c) => isWildCard(c));
  if (hasWildCard) {
    errors.push('Cannot scout when holding wild cards');
  }

  // Check player has 2 additional cards to discard
  if (action.additionalCardsDiscarded.length !== 2) {
    errors.push('Must discard 2 additional cards for scout action');
  }

  // Verify additional cards are in hand
  for (const card of action.additionalCardsDiscarded) {
    const inHand = player.hand.some((c) => c.id === card.id);
    if (!inHand) {
      errors.push(`Card ${card.id} not in hand`);
    }
  }

  // Check wild cards are available
  if (state.cardDeck.wildLocationCards.length === 0 || state.cardDeck.wildIndustryCards.length === 0) {
    errors.push('Wild cards not available');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Execute scout action
 */
export function executeScoutAction(state: GameState, action: ScoutAction): ActionResult {
  const validation = validateScoutAction(state, action);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      stateChanges: [],
    };
  }

  const stateChanges: StateChange[] = [];
  const player = getPlayerById(state, action.playerId)!;

  // Discard action card
  const cardIndex = player.hand.findIndex((c) => c.id === action.cardUsed.id);
  if (cardIndex >= 0) {
    const card = player.hand.splice(cardIndex, 1)[0];
    player.discardPile.push(card);
    stateChanges.push({
      type: 'card_discarded',
      playerId: action.playerId,
      details: { cardId: card.id },
    });
  }

  // Discard 2 additional cards
  for (const card of action.additionalCardsDiscarded) {
    const idx = player.hand.findIndex((c) => c.id === card.id);
    if (idx >= 0) {
      const discarded = player.hand.splice(idx, 1)[0];
      player.discardPile.push(discarded);
      stateChanges.push({
        type: 'card_discarded',
        playerId: action.playerId,
        details: { cardId: discarded.id },
      });
    }
  }

  // Give wild cards
  const wildLocation = state.cardDeck.wildLocationCards.shift();
  const wildIndustry = state.cardDeck.wildIndustryCards.shift();

  if (wildLocation) {
    player.hand.push(wildLocation);
    stateChanges.push({
      type: 'card_drawn',
      playerId: action.playerId,
      details: { cardId: wildLocation.id, cardType: 'wild_location' },
    });
  }

  if (wildIndustry) {
    player.hand.push(wildIndustry);
    stateChanges.push({
      type: 'card_drawn',
      playerId: action.playerId,
      details: { cardId: wildIndustry.id, cardType: 'wild_industry' },
    });
  }

  // Reduce actions
  player.actionsRemainingThisTurn--;

  state.updatedAt = new Date();

  return {
    success: true,
    errors: [],
    stateChanges,
  };
}

/**
 * Validate pass action
 */
export function validatePassAction(state: GameState, action: PassAction): ActionValidation {
  const errors: string[] = [];
  const player = getPlayerById(state, action.playerId);

  if (!player) {
    return { valid: false, errors: ['Player not found'] };
  }

  // Check player has the card in hand
  const hasCard = player.hand.some((c) => c.id === action.cardUsed.id);
  if (!hasCard) {
    errors.push('Card not in player hand');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Execute pass action
 */
export function executePassAction(state: GameState, action: PassAction): ActionResult {
  const validation = validatePassAction(state, action);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      stateChanges: [],
    };
  }

  const stateChanges: StateChange[] = [];
  const player = getPlayerById(state, action.playerId)!;

  // Discard card
  const cardIndex = player.hand.findIndex((c) => c.id === action.cardUsed.id);
  if (cardIndex >= 0) {
    const card = player.hand.splice(cardIndex, 1)[0];
    player.discardPile.push(card);
    stateChanges.push({
      type: 'card_discarded',
      playerId: action.playerId,
      details: { cardId: card.id },
    });
  }

  // Mark player as passed
  player.hasPassed = true;
  player.actionsRemainingThisTurn = 0;

  state.updatedAt = new Date();

  return {
    success: true,
    errors: [],
    stateChanges,
  };
}
