/**
 * Resource management utilities
 */

import { GameState, ResourceType, IndustryType, ResourceSource } from '../types';
import { areLocationsConnected, getReachableLocations } from './network';

/**
 * Find available coal sources for a player at a location
 * Priority:
 * 1. Closest connected unflipped Coal Mine (free)
 * 2. Coal Market with merchant connection (paid)
 * 3. £8 if market empty
 */
export function findCoalSources(
  state: GameState,
  playerId: string,
  location: string,
  quantity: number
): ResourceSource[] {
  const sources: ResourceSource[] = [];

  // First, try to get coal from connected coal mines
  const coalMines = Array.from(state.placedIndustries.values()).filter(
    (tile) =>
      tile.industryType === IndustryType.COAL_MINE &&
      !tile.isFlipped &&
      tile.currentResources > 0 &&
      areLocationsConnected(state, location as any, tile.location as any)
  );

  // Sort by distance (for now, just take first available)
  for (const mine of coalMines) {
    const available = mine.currentResources;
    const toTake = Math.min(available, quantity - sources.length);

    for (let i = 0; i < toTake; i++) {
      sources.push({
        type: 'tile',
        tileId: mine.id,
        cost: 0, // Free from own/connected mines
      });
    }

    if (sources.length >= quantity) {
      return sources;
    }
  }

  // If still need more, get from market
  const needed = quantity - sources.length;
  const marketSources = getCoalFromMarket(state, needed);
  sources.push(...marketSources);

  // If market is empty, pay £8 per coal
  const stillNeeded = quantity - sources.length;
  for (let i = 0; i < stillNeeded; i++) {
    sources.push({
      type: 'market',
      cost: 8,
    });
  }

  return sources;
}

/**
 * Get coal from market (cheapest first)
 */
function getCoalFromMarket(state: GameState, quantity: number): ResourceSource[] {
  const sources: ResourceSource[] = [];

  for (const space of state.board.coalMarket.spaces) {
    if (space.count > 0) {
      const toTake = Math.min(space.count, quantity - sources.length);
      for (let i = 0; i < toTake; i++) {
        sources.push({
          type: 'market',
          cost: space.price,
        });
      }

      if (sources.length >= quantity) {
        return sources;
      }
    }
  }

  return sources;
}

/**
 * Find available iron sources
 * Iron can come from:
 * 1. Any unflipped Iron Works (free, no connection needed)
 * 2. Iron Market (paid)
 * 3. £6 if market empty
 */
export function findIronSources(
  state: GameState,
  playerId: string,
  quantity: number
): ResourceSource[] {
  const sources: ResourceSource[] = [];

  // First, try to get iron from any unflipped iron works
  const ironWorks = Array.from(state.placedIndustries.values()).filter(
    (tile) =>
      tile.industryType === IndustryType.IRON_WORKS && !tile.isFlipped && tile.currentResources > 0
  );

  for (const works of ironWorks) {
    const available = works.currentResources;
    const toTake = Math.min(available, quantity - sources.length);

    for (let i = 0; i < toTake; i++) {
      sources.push({
        type: 'tile',
        tileId: works.id,
        cost: 0, // Free from iron works
      });
    }

    if (sources.length >= quantity) {
      return sources;
    }
  }

  // Get from market
  const needed = quantity - sources.length;
  const marketSources = getIronFromMarket(state, needed);
  sources.push(...marketSources);

  // If market empty, pay £6 per iron
  const stillNeeded = quantity - sources.length;
  for (let i = 0; i < stillNeeded; i++) {
    sources.push({
      type: 'market',
      cost: 6,
    });
  }

  return sources;
}

/**
 * Get iron from market (cheapest first)
 */
function getIronFromMarket(state: GameState, quantity: number): ResourceSource[] {
  const sources: ResourceSource[] = [];

  for (const space of state.board.ironMarket.spaces) {
    if (space.count > 0) {
      const toTake = Math.min(space.count, quantity - sources.length);
      for (let i = 0; i < toTake; i++) {
        sources.push({
          type: 'market',
          cost: space.price,
        });
      }

      if (sources.length >= quantity) {
        return sources;
      }
    }
  }

  return sources;
}

/**
 * Find available beer sources for a location
 * Beer can come from:
 * 1. Own unflipped breweries (no connection needed)
 * 2. Connected opponent's unflipped breweries
 * 3. Merchant beer (when selling)
 */
export function findBeerSources(
  state: GameState,
  playerId: string,
  location: string,
  quantity: number,
  allowMerchant: boolean = false
): ResourceSource[] {
  const sources: ResourceSource[] = [];

  // First, try own breweries (no connection needed)
  const ownBreweries = Array.from(state.placedIndustries.values()).filter(
    (tile) =>
      tile.industryType === IndustryType.BREWERY &&
      tile.playerId === playerId &&
      !tile.isFlipped &&
      tile.currentResources > 0
  );

  for (const brewery of ownBreweries) {
    const available = brewery.currentResources;
    const toTake = Math.min(available, quantity - sources.length);

    for (let i = 0; i < toTake; i++) {
      sources.push({
        type: 'tile',
        tileId: brewery.id,
        cost: 0,
      });
    }

    if (sources.length >= quantity) {
      return sources;
    }
  }

  // Try connected opponent breweries
  const opponentBreweries = Array.from(state.placedIndustries.values()).filter(
    (tile) =>
      tile.industryType === IndustryType.BREWERY &&
      tile.playerId !== playerId &&
      !tile.isFlipped &&
      tile.currentResources > 0 &&
      areLocationsConnected(state, location as any, tile.location as any)
  );

  for (const brewery of opponentBreweries) {
    const available = brewery.currentResources;
    const toTake = Math.min(available, quantity - sources.length);

    for (let i = 0; i < toTake; i++) {
      sources.push({
        type: 'tile',
        tileId: brewery.id,
        cost: 0,
      });
    }

    if (sources.length >= quantity) {
      return sources;
    }
  }

  // If selling, can use merchant beer
  if (allowMerchant) {
    const merchants = state.board.merchants.filter(
      (m) => m.currentBeer > 0 && areLocationsConnected(state, location as any, m.location as any)
    );

    for (const merchant of merchants) {
      if (sources.length < quantity) {
        sources.push({
          type: 'merchant',
          merchantId: merchant.id,
          cost: 0,
        });
      }
    }
  }

  return sources;
}

/**
 * Consume resources from sources
 */
export function consumeResources(state: GameState, sources: ResourceSource[]): number {
  let totalCost = 0;

  for (const source of sources) {
    totalCost += source.cost;

    if (source.type === 'tile' && source.tileId) {
      const tile = state.placedIndustries.get(source.tileId);
      if (tile) {
        tile.currentResources--;

        // Flip tile if resources exhausted
        if (tile.currentResources === 0) {
          tile.isFlipped = true;
          // Increase income for owner
          const player = state.players.find((p) => p.playerId === tile.playerId);
          if (player) {
            player.income += tile.incomeBonus;
            // Cap at 30
            if (player.income > 30) player.income = 30;
          }
        }
      }
    } else if (source.type === 'market') {
      // Remove from market
      // For coal
      if (source.cost <= 8) {
        for (const space of state.board.coalMarket.spaces) {
          if (space.price === source.cost && space.count > 0) {
            space.count--;
            break;
          }
        }
      }
      // For iron
      if (source.cost <= 6) {
        for (const space of state.board.ironMarket.spaces) {
          if (space.price === source.cost && space.count > 0) {
            space.count--;
            break;
          }
        }
      }
    } else if (source.type === 'merchant' && source.merchantId) {
      const merchant = state.board.merchants.find((m) => m.id === source.merchantId);
      if (merchant) {
        merchant.currentBeer--;
      }
    }
  }

  return totalCost;
}

/**
 * Add resources to market (when selling from coal/iron tiles)
 */
export function addResourcesToMarket(
  state: GameState,
  resourceType: ResourceType,
  quantity: number
): number {
  let moneyEarned = 0;

  const market =
    resourceType === ResourceType.COAL ? state.board.coalMarket : state.board.ironMarket;

  // Fill expensive spaces first
  const sortedSpaces = [...market.spaces].sort((a, b) => b.price - a.price);

  for (const space of sortedSpaces) {
    if (quantity === 0) break;

    const canAdd = space.maxCount - space.count;
    const toAdd = Math.min(canAdd, quantity);

    space.count += toAdd;
    moneyEarned += toAdd * space.price;
    quantity -= toAdd;
  }

  return moneyEarned;
}

/**
 * Calculate total cost of resources
 */
export function calculateResourceCost(sources: ResourceSource[]): number {
  return sources.reduce((sum, source) => sum + source.cost, 0);
}
