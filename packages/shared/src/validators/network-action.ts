/**
 * Network action validator and executor
 */

import {
  GameState,
  NetworkAction,
  ActionValidation,
  ActionResult,
  StateChange,
  Era,
  LinkType,
} from '../types';
import { hasNetworkAtLocation, areLocationsAdjacent } from '../utils/network';
import { findCoalSources, findBeerSources, consumeResources } from '../utils/resources';
import { getPlayerById } from '../models/turn-manager';
import { nanoid } from 'nanoid';

/**
 * Validate a network action
 */
export function validateNetworkAction(state: GameState, action: NetworkAction): ActionValidation {
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

  // Canal Era: can only place canal links, max 1 link
  if (state.currentEra === Era.CANAL) {
    if (action.connections.length > 1) {
      errors.push('Can only place 1 link in Canal Era');
    }
    if (action.connections.some((c) => c.linkType !== LinkType.CANAL)) {
      errors.push('Can only place canal links in Canal Era');
    }
  }

  // Rail Era: can only place rail links, 1 or 2 links
  if (state.currentEra === Era.RAIL) {
    if (action.connections.length === 0 || action.connections.length > 2) {
      errors.push('Can place 1 or 2 rail links in Rail Era');
    }
    if (action.connections.some((c) => c.linkType !== LinkType.RAIL)) {
      errors.push('Can only place rail links in Rail Era');
    }
  }

  // Check player has enough link tiles
  if (player.linkTilesRemaining < action.connections.length) {
    errors.push(`Not enough link tiles (need ${action.connections.length}, have ${player.linkTilesRemaining})`);
  }

  // Validate each connection
  for (const conn of action.connections) {
    // Check locations are adjacent
    if (!areLocationsAdjacent(conn.from as any, conn.to as any)) {
      errors.push(`${conn.from} and ${conn.to} are not adjacent`);
    }

    // Check connection doesn't already exist
    const existingLink = state.board.connections.find(
      (c) =>
        ((c.from === conn.from && c.to === conn.to) || (c.from === conn.to && c.to === conn.from)) &&
        c.placedLinkPlayerId !== undefined
    );
    if (existingLink) {
      errors.push(`Link already exists between ${conn.from} and ${conn.to}`);
    }

    // Check at least one location is in player's network (or first tile)
    const playerHasTiles = player.placedIndustries.length > 0;
    if (playerHasTiles) {
      const fromInNetwork = hasNetworkAtLocation(state, action.playerId, conn.from as any);
      const toInNetwork = hasNetworkAtLocation(state, action.playerId, conn.to as any);

      if (!fromInNetwork && !toInNetwork) {
        errors.push(`At least one end of link must be in your network`);
      }
    }
  }

  // Calculate cost
  let cost = 0;
  let coalNeeded = 0;
  let beerNeeded = 0;

  if (state.currentEra === Era.CANAL) {
    cost = 3 * action.connections.length;
  } else {
    // Rail Era
    if (action.connections.length === 1) {
      cost = 5;
      coalNeeded = 1;
    } else {
      cost = 15;
      coalNeeded = 2;
      beerNeeded = 1;
    }
  }

  // Check money
  const coalCost = action.coalSources?.reduce((sum, s) => sum + s.cost, 0) || 0;
  const totalCost = cost + coalCost;
  if (player.money < totalCost) {
    errors.push(`Not enough money (need £${totalCost}, have £${player.money})`);
  }

  // Check coal availability (Rail Era)
  if (coalNeeded > 0) {
    if (!action.coalSources || action.coalSources.length < coalNeeded) {
      errors.push(`Need ${coalNeeded} coal for this network action`);
    }
  }

  // Check beer availability (2-link Rail Era)
  if (beerNeeded > 0) {
    if (!action.beerSource) {
      errors.push('Need 1 beer for 2-link network action');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Execute a network action
 */
export function executeNetworkAction(state: GameState, action: NetworkAction): ActionResult {
  const validation = validateNetworkAction(state, action);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      stateChanges: [],
    };
  }

  const stateChanges: StateChange[] = [];
  const player = getPlayerById(state, action.playerId)!;

  // Calculate base cost
  let cost = 0;
  if (state.currentEra === Era.CANAL) {
    cost = 3 * action.connections.length;
  } else {
    cost = action.connections.length === 1 ? 5 : 15;
  }

  // Consume coal (Rail Era)
  if (action.coalSources && action.coalSources.length > 0) {
    const coalCost = consumeResources(state, action.coalSources);
    cost += coalCost;
    stateChanges.push({
      type: 'resource_consumed',
      playerId: action.playerId,
      details: { resource: 'coal', quantity: action.coalSources.length, cost: coalCost },
    });
  }

  // Consume beer (2-link Rail Era)
  if (action.beerSource) {
    consumeResources(state, [action.beerSource]);
    stateChanges.push({
      type: 'resource_consumed',
      playerId: action.playerId,
      details: { resource: 'beer', quantity: 1, cost: 0 },
    });
  }

  // Deduct money
  player.money -= cost;
  player.moneySpentThisTurn += cost;
  stateChanges.push({
    type: 'money',
    playerId: action.playerId,
    details: { amount: -cost, newTotal: player.money },
  });

  // Place links
  for (const conn of action.connections) {
    const linkId = nanoid();
    state.board.connections.push({
      id: linkId,
      from: conn.from as any,
      to: conn.to as any,
      linkType: conn.linkType,
      placedLinkPlayerId: action.playerId,
    });

    player.linkTilesRemaining--;
    player.placedLinks.push(linkId);

    stateChanges.push({
      type: 'link_placed',
      playerId: action.playerId,
      details: { linkId, from: conn.from, to: conn.to, linkType: conn.linkType },
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
