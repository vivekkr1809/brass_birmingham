/**
 * Network connectivity and pathfinding utilities
 */

import { GameState, Location, PlacedIndustryTile } from '../types';
import { BoardConnection } from '../types/board';
import { BOARD_LOCATIONS } from '../constants/board-data';

/**
 * Check if a player has a network at a location
 * A network exists if:
 * 1. Player has an industry tile at that location, OR
 * 2. Location is adjacent to a link tile placed by the player
 */
export function hasNetworkAtLocation(
  state: GameState,
  playerId: string,
  location: Location
): boolean {
  // Check if player has industry at this location
  const hasIndustry = Array.from(state.placedIndustries.values()).some(
    (tile) => tile.playerId === playerId && tile.location === location
  );

  if (hasIndustry) return true;

  // Check if location is adjacent to player's link
  const playerLinks = state.board.connections.filter((conn) => conn.placedLinkPlayerId === playerId);

  for (const link of playerLinks) {
    if (link.from === location || link.to === location) {
      return true;
    }
  }

  return false;
}

/**
 * Check if two locations are connected via any player's links
 * Uses breadth-first search to find path
 */
export function areLocationsConnected(
  state: GameState,
  from: Location,
  to: Location
): boolean {
  if (from === to) return true;

  const visited = new Set<Location>();
  const queue: Location[] = [from];
  visited.add(from);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current === to) return true;

    // Get all locations connected to current via any link
    const connections = state.board.connections.filter(
      (conn) => (conn.from === current || conn.to === current) && conn.placedLinkPlayerId !== undefined
    );

    for (const conn of connections) {
      const next = conn.from === current ? conn.to : conn.from;
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }

  return false;
}

/**
 * Get all locations in a player's network
 */
export function getPlayerNetwork(state: GameState, playerId: string): Set<Location> {
  const network = new Set<Location>();

  // Add locations with player's industries
  for (const tile of state.placedIndustries.values()) {
    if (tile.playerId === playerId) {
      network.add(tile.location as Location);
    }
  }

  // Add locations adjacent to player's links
  const playerLinks = state.board.connections.filter((conn) => conn.placedLinkPlayerId === playerId);

  for (const link of playerLinks) {
    network.add(link.from);
    network.add(link.to);
  }

  // Expand network to include all connected locations
  let changed = true;
  while (changed) {
    changed = false;
    const currentSize = network.size;

    for (const location of network) {
      const adjacentConnected = state.board.connections.filter(
        (conn) =>
          (conn.from === location || conn.to === location) && conn.placedLinkPlayerId !== undefined
      );

      for (const conn of adjacentConnected) {
        const other = conn.from === location ? conn.to : conn.from;
        if (!network.has(other)) {
          network.add(other);
          changed = true;
        }
      }
    }

    if (network.size === currentSize) {
      changed = false;
    }
  }

  return network;
}

/**
 * Check if location is adjacent to another location (board layout)
 */
export function areLocationsAdjacent(from: Location, to: Location): boolean {
  const locationData = BOARD_LOCATIONS.find((loc) => loc.name === from);
  if (!locationData) return false;
  return locationData.adjacentLocations.includes(to);
}

/**
 * Find shortest path between two locations
 * Returns array of locations representing the path, or null if no path exists
 */
export function findPath(
  state: GameState,
  from: Location,
  to: Location
): Location[] | null {
  if (from === to) return [from];

  const visited = new Set<Location>();
  const queue: { location: Location; path: Location[] }[] = [{ location: from, path: [from] }];
  visited.add(from);

  while (queue.length > 0) {
    const { location: current, path } = queue.shift()!;

    // Get all connected locations
    const connections = state.board.connections.filter(
      (conn) => (conn.from === current || conn.to === current) && conn.placedLinkPlayerId !== undefined
    );

    for (const conn of connections) {
      const next = conn.from === current ? conn.to : conn.from;

      if (next === to) {
        return [...path, next];
      }

      if (!visited.has(next)) {
        visited.add(next);
        queue.push({ location: next, path: [...path, next] });
      }
    }
  }

  return null;
}

/**
 * Get all locations a player can build at (has network or first tile)
 */
export function getBuildableLocations(state: GameState, playerId: string): Set<Location> {
  const network = getPlayerNetwork(state, playerId);

  // If player has no tiles on board, can build anywhere
  const playerTiles = Array.from(state.placedIndustries.values()).filter(
    (tile) => tile.playerId === playerId
  );

  if (playerTiles.length === 0) {
    return new Set(BOARD_LOCATIONS.map((loc) => loc.name));
  }

  return network;
}

/**
 * Get all locations reachable from a given location via any links
 */
export function getReachableLocations(state: GameState, from: Location): Set<Location> {
  const reachable = new Set<Location>();
  const visited = new Set<Location>();
  const queue: Location[] = [from];
  visited.add(from);
  reachable.add(from);

  while (queue.length > 0) {
    const current = queue.shift()!;

    const connections = state.board.connections.filter(
      (conn) => (conn.from === current || conn.to === current) && conn.placedLinkPlayerId !== undefined
    );

    for (const conn of connections) {
      const next = conn.from === current ? conn.to : conn.from;
      if (!visited.has(next)) {
        visited.add(next);
        reachable.add(next);
        queue.push(next);
      }
    }
  }

  return reachable;
}
