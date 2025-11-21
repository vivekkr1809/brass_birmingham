/**
 * Build action validator and executor
 */

import {
  GameState,
  BuildAction,
  ActionValidation,
  ActionResult,
  StateChange,
  Era,
  IndustryType,
  CardType,
} from '../types';
import { isLocationCard, isIndustryCard, isWildLocationCard, isWildIndustryCard } from '../types/card';
import { hasNetworkAtLocation, getBuildableLocations } from '../utils/network';
import { findCoalSources, findIronSources, consumeResources, addResourcesToMarket } from '../utils/resources';
import { getPlayerById } from '../models/turn-manager';

/**
 * Validate a build action
 */
export function validateBuildAction(state: GameState, action: BuildAction): ActionValidation {
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

  // Validate card matches action
  const cardValid = validateCardForBuild(state, action);
  if (!cardValid.valid) {
    errors.push(...cardValid.errors);
  }

  // Check if location is in player's network (or first tile)
  const buildableLocations = getBuildableLocations(state, action.playerId);
  if (!buildableLocations.has(action.location as any)) {
    errors.push('Location not in player network');
  }

  // Check if tile is available on player mat
  const tileAvailable = isTileAvailable(player, action.industryType, state.currentEra);
  if (!tileAvailable.valid) {
    errors.push(...tileAvailable.errors);
  }

  // Check if space is available on board
  const spaceAvailable = isSpaceAvailable(state, action.location, action.industryType);
  if (!spaceAvailable.valid) {
    errors.push(...spaceAvailable.errors);
  }

  // Validate resources and cost
  const tile = getNextTileForPlayer(player, action.industryType, state.currentEra);
  if (tile) {
    // Check coal requirement
    if (tile.cost.coal) {
      const coalSources = findCoalSources(state, action.playerId, action.location, tile.cost.coal);
      if (coalSources.length < tile.cost.coal) {
        errors.push(`Not enough coal available (need ${tile.cost.coal})`);
      }
    }

    // Check iron requirement
    if (tile.cost.iron) {
      const ironSources = findIronSources(state, action.playerId, tile.cost.iron);
      if (ironSources.length < tile.cost.iron) {
        errors.push(`Not enough iron available (need ${tile.cost.iron})`);
      }
    }

    // Check money
    const totalCost = tile.cost.money +
      (action.coalSources?.reduce((sum, s) => sum + s.cost, 0) || 0) +
      (action.ironSources?.reduce((sum, s) => sum + s.cost, 0) || 0);

    if (player.money < totalCost) {
      errors.push(`Not enough money (need £${totalCost}, have £${player.money})`);
    }

    // Check coal mine must connect to merchant
    if (tile.industryType === IndustryType.COAL_MINE && tile.mustConnectToMerchant) {
      const canReachMerchant = state.board.merchants.some((m) =>
        hasNetworkAtLocation(state, action.playerId, m.location as any)
      );
      if (!canReachMerchant) {
        errors.push('Coal mine must connect to a merchant');
      }
    }
  } else {
    errors.push('No tiles available for this industry type');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Execute a build action
 */
export function executeBuildAction(state: GameState, action: BuildAction): ActionResult {
  const validation = validateBuildAction(state, action);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      stateChanges: [],
    };
  }

  const stateChanges: StateChange[] = [];
  const player = getPlayerById(state, action.playerId)!;
  const tile = getNextTileForPlayer(player, action.industryType, state.currentEra)!;

  // Calculate costs
  let totalCost = tile.cost.money;

  // Consume coal
  if (tile.cost.coal && action.coalSources) {
    const coalCost = consumeResources(state, action.coalSources);
    totalCost += coalCost;
    stateChanges.push({
      type: 'resource_consumed',
      playerId: action.playerId,
      details: { resource: 'coal', quantity: tile.cost.coal, cost: coalCost },
    });
  }

  // Consume iron
  if (tile.cost.iron && action.ironSources) {
    const ironCost = consumeResources(state, action.ironSources);
    totalCost += ironCost;
    stateChanges.push({
      type: 'resource_consumed',
      playerId: action.playerId,
      details: { resource: 'iron', quantity: tile.cost.iron, cost: ironCost },
    });
  }

  // Deduct money
  player.money -= totalCost;
  player.moneySpentThisTurn += totalCost;
  stateChanges.push({
    type: 'money',
    playerId: action.playerId,
    details: { amount: -totalCost, newTotal: player.money },
  });

  // Remove tile from player mat
  const tileIndex = player.industryTiles[action.industryType].findIndex((t) => t.id === tile.id);
  if (tileIndex >= 0) {
    player.industryTiles[action.industryType].splice(tileIndex, 1);
  }

  // Place tile on board
  const placedTile = {
    ...tile,
    location: action.location,
    placedInEra: state.currentEra,
    currentResources: tile.resourceCapacity || 0,
  };

  state.placedIndustries.set(tile.id, placedTile);
  player.placedIndustries.push(tile.id);

  // Update board location
  const location = state.board.locations.get(action.location as any);
  if (location) {
    const slot = location.industrySlots.find(
      (s) => s.allowedIndustries.includes(action.industryType) && !s.currentTile
    );
    if (slot) {
      slot.currentTile = tile.id;
    }
  }

  stateChanges.push({
    type: 'tile_placed',
    playerId: action.playerId,
    details: { tileId: tile.id, location: action.location, industryType: action.industryType },
  });

  // For coal mines and iron works, sell resources to market immediately
  if (tile.industryType === IndustryType.COAL_MINE && tile.resourceCapacity) {
    const moneyEarned = addResourcesToMarket(state, 'coal' as any, tile.resourceCapacity);
    player.money += moneyEarned;
    placedTile.currentResources = 0;
    placedTile.isFlipped = true;
    player.income += tile.incomeBonus;

    stateChanges.push({
      type: 'market_changed',
      playerId: action.playerId,
      details: { resource: 'coal', quantity: tile.resourceCapacity, moneyEarned },
    });

    stateChanges.push({
      type: 'tile_flipped',
      playerId: action.playerId,
      details: { tileId: tile.id },
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
 * Validate card is appropriate for build action
 */
function validateCardForBuild(state: GameState, action: BuildAction): ActionValidation {
  const card = action.cardUsed;

  // Wild industry card can build any industry at any location (except farm breweries)
  if (isWildIndustryCard(card)) {
    if (action.location.startsWith('FARM_BREWERY')) {
      return { valid: false, errors: ['Cannot use Wild Industry card for farm breweries'] };
    }
    return { valid: true, errors: [] };
  }

  // Wild location card can build at any location (except farm breweries)
  if (isWildLocationCard(card)) {
    if (action.location.startsWith('FARM_BREWERY')) {
      return { valid: false, errors: ['Cannot use Wild Location card for farm breweries'] };
    }
    return { valid: true, errors: [] };
  }

  // Location card must match location
  if (isLocationCard(card)) {
    if (card.location !== action.location) {
      return { valid: false, errors: ['Location card does not match build location'] };
    }
    return { valid: true, errors: [] };
  }

  // Industry card must match industry type AND location must be in network
  if (isIndustryCard(card)) {
    if (card.industryType !== action.industryType) {
      return { valid: false, errors: ['Industry card does not match industry type'] };
    }
    // Industry card requires location to be in network
    if (!hasNetworkAtLocation(state, action.playerId, action.location as any)) {
      return { valid: false, errors: ['Industry card requires location in network'] };
    }
    return { valid: true, errors: [] };
  }

  return { valid: false, errors: ['Invalid card type'] };
}

/**
 * Check if tile is available on player mat
 */
function isTileAvailable(player: any, industryType: IndustryType, era: Era): ActionValidation {
  const tiles = player.industryTiles[industryType];
  if (!tiles || tiles.length === 0) {
    return { valid: false, errors: ['No tiles available for this industry'] };
  }

  // Must use lowest level available
  const lowestLevel = Math.min(...tiles.map((t: any) => t.level));
  const lowestTile = tiles.find((t: any) => t.level === lowestLevel);

  if (!lowestTile) {
    return { valid: false, errors: ['No tiles available'] };
  }

  // Check if tile is available in current era
  if (!lowestTile.availableInEra.includes(era)) {
    return { valid: false, errors: [`Level ${lowestLevel} ${industryType} not available in ${era} era`] };
  }

  return { valid: true, errors: [] };
}

/**
 * Check if space is available on board
 */
function isSpaceAvailable(state: GameState, location: string, industryType: IndustryType): ActionValidation {
  const loc = state.board.locations.get(location as any);
  if (!loc) {
    return { valid: false, errors: ['Location not found'] };
  }

  // Check if there's an empty slot for this industry type
  const availableSlot = loc.industrySlots.find(
    (slot) => slot.allowedIndustries.includes(industryType) && !slot.currentTile
  );

  if (!availableSlot) {
    // Check Canal Era restriction: only one tile per location
    if (state.currentEra === Era.CANAL) {
      const hasAnyTile = loc.industrySlots.some((slot) => slot.currentTile);
      if (hasAnyTile) {
        return { valid: false, errors: ['Only one industry per location in Canal Era'] };
      }
    }
    return { valid: false, errors: ['No available space for this industry'] };
  }

  return { valid: true, errors: [] };
}

/**
 * Get next available tile for player (lowest level)
 */
function getNextTileForPlayer(player: any, industryType: IndustryType, era: Era) {
  const tiles = player.industryTiles[industryType];
  if (!tiles || tiles.length === 0) return null;

  const availableTiles = tiles.filter((t: any) => t.availableInEra.includes(era));
  if (availableTiles.length === 0) return null;

  const lowestLevel = Math.min(...availableTiles.map((t: any) => t.level));
  return availableTiles.find((t: any) => t.level === lowestLevel);
}
