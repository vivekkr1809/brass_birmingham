/**
 * Sell action validator and executor
 */

import {
  GameState,
  SellAction,
  ActionValidation,
  ActionResult,
  StateChange,
  IndustryType,
  MerchantBonusType,
} from '../types';
import { areLocationsConnected } from '../utils/network';
import { findBeerSources, consumeResources } from '../utils/resources';
import { getPlayerById } from '../models/turn-manager';

/**
 * Validate a sell action
 */
export function validateSellAction(state: GameState, action: SellAction): ActionValidation {
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

  // Validate each sale
  for (const sale of action.sales) {
    const tile = state.placedIndustries.get(sale.tileId);
    if (!tile) {
      errors.push(`Tile ${sale.tileId} not found`);
      continue;
    }

    // Check tile belongs to player
    if (tile.playerId !== action.playerId) {
      errors.push('Can only sell own tiles');
      continue;
    }

    // Check tile is not already flipped
    if (tile.isFlipped) {
      errors.push(`Tile ${sale.tileId} is already sold`);
      continue;
    }

    // Check tile is sellable type
    const sellableTypes = [
      IndustryType.COTTON_MILL,
      IndustryType.MANUFACTURER,
      IndustryType.POTTERY,
    ];
    if (!sellableTypes.includes(tile.industryType)) {
      errors.push(`Cannot sell ${tile.industryType}`);
      continue;
    }

    // Check merchant exists and matches industry type
    const merchant = state.board.merchants.find((m) => m.id === sale.merchantId);
    if (!merchant) {
      errors.push(`Merchant ${sale.merchantId} not found`);
      continue;
    }

    if (merchant.industryType !== tile.industryType) {
      errors.push(`Merchant does not accept ${tile.industryType}`);
      continue;
    }

    // Check connection to merchant
    if (!areLocationsConnected(state, tile.location as any, merchant.location as any)) {
      errors.push(`Tile at ${tile.location} not connected to merchant at ${merchant.location}`);
      continue;
    }

    // Check beer requirement
    const beerRequired = tile.beerRequired || 0;
    if (beerRequired > 0) {
      const beerSources = findBeerSources(state, action.playerId, tile.location, beerRequired, true);
      if (beerSources.length < beerRequired) {
        errors.push(`Not enough beer available (need ${beerRequired})`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Execute a sell action
 */
export function executeSellAction(state: GameState, action: SellAction): ActionResult {
  const validation = validateSellAction(state, action);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      stateChanges: [],
    };
  }

  const stateChanges: StateChange[] = [];
  const player = getPlayerById(state, action.playerId)!;

  // Process each sale
  for (const sale of action.sales) {
    const tile = state.placedIndustries.get(sale.tileId)!;
    const merchant = state.board.merchants.find((m) => m.id === sale.merchantId)!;

    // Consume beer
    if (tile.beerRequired && tile.beerRequired > 0) {
      consumeResources(state, [sale.beerSource]);
      stateChanges.push({
        type: 'resource_consumed',
        playerId: action.playerId,
        details: { resource: 'beer', quantity: tile.beerRequired, cost: 0 },
      });

      // Check if beer came from merchant - apply bonus
      if (sale.beerSource.type === 'merchant') {
        applyMerchantBonus(state, player, merchant, stateChanges);
      }
    }

    // Flip tile
    tile.isFlipped = true;
    stateChanges.push({
      type: 'tile_flipped',
      playerId: action.playerId,
      details: { tileId: sale.tileId },
    });

    // Increase income
    player.income += tile.incomeBonus;
    if (player.income > 30) player.income = 30;
    stateChanges.push({
      type: 'income',
      playerId: action.playerId,
      details: { change: tile.incomeBonus, newIncome: player.income },
    });
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
 * Apply merchant bonus
 */
function applyMerchantBonus(
  state: GameState,
  player: any,
  merchant: any,
  stateChanges: StateChange[]
): void {
  switch (merchant.bonusType) {
    case MerchantBonusType.DEVELOP:
      // Free develop action - handled separately
      stateChanges.push({
        type: 'income',
        playerId: player.playerId,
        details: { bonus: 'free_develop', merchant: merchant.id },
      });
      break;

    case MerchantBonusType.INCOME:
      player.income += merchant.bonusValue;
      if (player.income > 30) player.income = 30;
      stateChanges.push({
        type: 'income',
        playerId: player.playerId,
        details: { change: merchant.bonusValue, newIncome: player.income },
      });
      break;

    case MerchantBonusType.VP:
      player.victoryPoints += merchant.bonusValue;
      stateChanges.push({
        type: 'vp',
        playerId: player.playerId,
        details: { change: merchant.bonusValue, newVP: player.victoryPoints },
      });
      break;

    case MerchantBonusType.MONEY:
      player.money += merchant.bonusValue;
      stateChanges.push({
        type: 'money',
        playerId: player.playerId,
        details: { amount: merchant.bonusValue, newTotal: player.money },
      });
      break;
  }
}
