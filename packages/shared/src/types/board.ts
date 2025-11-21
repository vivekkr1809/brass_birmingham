/**
 * Board structure and location definitions for Brass Birmingham
 */

import { IndustryType, Location, LinkType, MerchantBonusType, PlayerCount } from './enums';

/**
 * Industry slot on the board
 */
export interface IndustrySlot {
  allowedIndustries: IndustryType[];
  currentTile?: string; // ID of placed industry tile
}

/**
 * Location on the board
 */
export interface BoardLocation {
  name: Location;
  industrySlots: IndustrySlot[];
  adjacentLocations: Location[]; // For network connectivity
  coordinates: { x: number; y: number }; // For UI rendering
}

/**
 * Connection between two locations
 */
export interface BoardConnection {
  id: string;
  from: Location;
  to: Location;
  linkType: LinkType;
  placedLinkPlayerId?: string; // ID of player who placed link
}

/**
 * Merchant tile on the board
 */
export interface MerchantTile {
  id: string;
  location: Location;
  industryType: IndustryType;
  bonusType: MerchantBonusType;
  bonusValue: number; // +2 income, +3 VP, +£5, etc.
  hasBeerSpace: boolean;
  currentBeer: number; // 0 or 1
  minPlayerCount: PlayerCount; // Merchant only used if player count >= this
}

/**
 * Market for resources
 */
export interface ResourceMarket {
  spaces: ResourceMarketSpace[];
}

export interface ResourceMarketSpace {
  price: number;
  count: number; // Current number of resources at this price
  maxCount: number; // Maximum capacity of this price level
}

/**
 * Coal market (prices £1-£8)
 */
export const COAL_MARKET_SPACES: Omit<ResourceMarketSpace, 'count'>[] = [
  { price: 1, maxCount: 2 },
  { price: 2, maxCount: 3 },
  { price: 3, maxCount: 4 },
  { price: 4, maxCount: 5 },
  { price: 5, maxCount: 5 },
  { price: 6, maxCount: 5 },
  { price: 7, maxCount: 6 },
  { price: 8, maxCount: 99 }, // Unlimited at highest price
];

/**
 * Iron market (prices £1-£6)
 */
export const IRON_MARKET_SPACES: Omit<ResourceMarketSpace, 'count'>[] = [
  { price: 1, maxCount: 2 },
  { price: 2, maxCount: 3 },
  { price: 3, maxCount: 4 },
  { price: 4, maxCount: 4 },
  { price: 5, maxCount: 5 },
  { price: 6, maxCount: 99 }, // Unlimited at highest price
];

/**
 * Complete board state
 */
export interface BoardState {
  locations: Map<Location, BoardLocation>;
  connections: BoardConnection[];
  merchants: MerchantTile[];
  coalMarket: ResourceMarket;
  ironMarket: ResourceMarket;
}
