/**
 * Industry tile types and definitions
 */

import { IndustryType, Era, ResourceType } from './enums';

export interface IndustryCost {
  money: number;
  coal?: number;
  iron?: number;
}

export interface IndustryTileDefinition {
  industryType: IndustryType;
  level: number;
  cost: IndustryCost;
  incomeBonus: number; // Number of income spaces to advance
  victoryPoints: number;
  resourceCapacity?: number; // For coal mines, iron works, breweries
  resourceType?: ResourceType;
  beerRequired?: number; // For selling cotton/manufacturer/pottery
  mustConnectToMerchant?: boolean; // Coal mines must connect to merchant
  availableInEra: Era[]; // Which eras this tile is available
  hasLightbulb?: boolean; // Pottery tiles with lightbulb cannot be developed
  beerCapacity?: number; // Breweries: 1 in canal, 2 in rail (same tile)
}

export interface IndustryTile extends IndustryTileDefinition {
  id: string; // Unique tile instance ID
  playerId: string;
  isFlipped: boolean; // Flipped when sold or resources exhausted
  currentResources: number; // Current coal/iron/beer on tile
}

export interface PlacedIndustryTile extends IndustryTile {
  location: string;
  placedInEra: Era;
}

/**
 * Cotton Mill tile definitions (11 per player, levels 1-4)
 */
export const COTTON_MILL_TILES: IndustryTileDefinition[] = [
  // Level 1 (3 tiles) - Canal Era only
  {
    industryType: IndustryType.COTTON_MILL,
    level: 1,
    cost: { money: 12, coal: 1, iron: 0 },
    incomeBonus: 5,
    victoryPoints: 3,
    beerRequired: 0,
    availableInEra: [Era.CANAL],
  },
  {
    industryType: IndustryType.COTTON_MILL,
    level: 1,
    cost: { money: 12, coal: 1, iron: 0 },
    incomeBonus: 5,
    victoryPoints: 3,
    beerRequired: 0,
    availableInEra: [Era.CANAL],
  },
  {
    industryType: IndustryType.COTTON_MILL,
    level: 1,
    cost: { money: 12, coal: 1, iron: 0 },
    incomeBonus: 5,
    victoryPoints: 3,
    beerRequired: 0,
    availableInEra: [Era.CANAL],
  },
  // Level 2 (3 tiles)
  {
    industryType: IndustryType.COTTON_MILL,
    level: 2,
    cost: { money: 14, coal: 1, iron: 1 },
    incomeBonus: 4,
    victoryPoints: 5,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.COTTON_MILL,
    level: 2,
    cost: { money: 14, coal: 1, iron: 1 },
    incomeBonus: 4,
    victoryPoints: 5,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.COTTON_MILL,
    level: 2,
    cost: { money: 14, coal: 1, iron: 1 },
    incomeBonus: 4,
    victoryPoints: 5,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 3 (3 tiles)
  {
    industryType: IndustryType.COTTON_MILL,
    level: 3,
    cost: { money: 16, coal: 1, iron: 1 },
    incomeBonus: 3,
    victoryPoints: 9,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.COTTON_MILL,
    level: 3,
    cost: { money: 16, coal: 1, iron: 1 },
    incomeBonus: 3,
    victoryPoints: 9,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.COTTON_MILL,
    level: 3,
    cost: { money: 16, coal: 1, iron: 1 },
    incomeBonus: 3,
    victoryPoints: 9,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 4 (2 tiles)
  {
    industryType: IndustryType.COTTON_MILL,
    level: 4,
    cost: { money: 18, coal: 1, iron: 1 },
    incomeBonus: 2,
    victoryPoints: 12,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.COTTON_MILL,
    level: 4,
    cost: { money: 18, coal: 1, iron: 1 },
    incomeBonus: 2,
    victoryPoints: 12,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
];

/**
 * Coal Mine tile definitions (7 per player, levels 1-4)
 */
export const COAL_MINE_TILES: IndustryTileDefinition[] = [
  // Level 1 (2 tiles) - Canal Era only
  {
    industryType: IndustryType.COAL_MINE,
    level: 1,
    cost: { money: 5, iron: 0 },
    incomeBonus: 4,
    victoryPoints: 1,
    resourceCapacity: 2,
    resourceType: ResourceType.COAL,
    mustConnectToMerchant: true,
    availableInEra: [Era.CANAL],
  },
  {
    industryType: IndustryType.COAL_MINE,
    level: 1,
    cost: { money: 5, iron: 0 },
    incomeBonus: 4,
    victoryPoints: 1,
    resourceCapacity: 2,
    resourceType: ResourceType.COAL,
    mustConnectToMerchant: true,
    availableInEra: [Era.CANAL],
  },
  // Level 2 (2 tiles)
  {
    industryType: IndustryType.COAL_MINE,
    level: 2,
    cost: { money: 7, iron: 0 },
    incomeBonus: 7,
    victoryPoints: 2,
    resourceCapacity: 3,
    resourceType: ResourceType.COAL,
    mustConnectToMerchant: true,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.COAL_MINE,
    level: 2,
    cost: { money: 7, iron: 0 },
    incomeBonus: 7,
    victoryPoints: 2,
    resourceCapacity: 3,
    resourceType: ResourceType.COAL,
    mustConnectToMerchant: true,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 3 (2 tiles)
  {
    industryType: IndustryType.COAL_MINE,
    level: 3,
    cost: { money: 8, iron: 1 },
    incomeBonus: 6,
    victoryPoints: 3,
    resourceCapacity: 4,
    resourceType: ResourceType.COAL,
    mustConnectToMerchant: true,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.COAL_MINE,
    level: 3,
    cost: { money: 8, iron: 1 },
    incomeBonus: 6,
    victoryPoints: 3,
    resourceCapacity: 4,
    resourceType: ResourceType.COAL,
    mustConnectToMerchant: true,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 4 (1 tile)
  {
    industryType: IndustryType.COAL_MINE,
    level: 4,
    cost: { money: 10, iron: 1 },
    incomeBonus: 5,
    victoryPoints: 4,
    resourceCapacity: 5,
    resourceType: ResourceType.COAL,
    mustConnectToMerchant: true,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
];

/**
 * Iron Works tile definitions (4 per player, levels 1-3)
 */
export const IRON_WORKS_TILES: IndustryTileDefinition[] = [
  // Level 1 (1 tile) - Canal Era only
  {
    industryType: IndustryType.IRON_WORKS,
    level: 1,
    cost: { money: 5, coal: 1 },
    incomeBonus: 3,
    victoryPoints: 3,
    resourceCapacity: 4,
    resourceType: ResourceType.IRON,
    availableInEra: [Era.CANAL],
  },
  // Level 2 (1 tile)
  {
    industryType: IndustryType.IRON_WORKS,
    level: 2,
    cost: { money: 7, coal: 1 },
    incomeBonus: 3,
    victoryPoints: 5,
    resourceCapacity: 4,
    resourceType: ResourceType.IRON,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 3 (2 tiles)
  {
    industryType: IndustryType.IRON_WORKS,
    level: 3,
    cost: { money: 9, coal: 1 },
    incomeBonus: 2,
    victoryPoints: 7,
    resourceCapacity: 5,
    resourceType: ResourceType.IRON,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.IRON_WORKS,
    level: 3,
    cost: { money: 9, coal: 1 },
    incomeBonus: 2,
    victoryPoints: 7,
    resourceCapacity: 5,
    resourceType: ResourceType.IRON,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
];

/**
 * Manufacturer tile definitions (11 per player, levels 1-4)
 */
export const MANUFACTURER_TILES: IndustryTileDefinition[] = [
  // Level 1 (3 tiles) - Canal Era only
  {
    industryType: IndustryType.MANUFACTURER,
    level: 1,
    cost: { money: 8, coal: 1, iron: 0 },
    incomeBonus: 5,
    victoryPoints: 3,
    beerRequired: 0,
    availableInEra: [Era.CANAL],
  },
  {
    industryType: IndustryType.MANUFACTURER,
    level: 1,
    cost: { money: 8, coal: 1, iron: 0 },
    incomeBonus: 5,
    victoryPoints: 3,
    beerRequired: 0,
    availableInEra: [Era.CANAL],
  },
  {
    industryType: IndustryType.MANUFACTURER,
    level: 1,
    cost: { money: 8, coal: 1, iron: 0 },
    incomeBonus: 5,
    victoryPoints: 3,
    beerRequired: 0,
    availableInEra: [Era.CANAL],
  },
  // Level 2 (3 tiles)
  {
    industryType: IndustryType.MANUFACTURER,
    level: 2,
    cost: { money: 10, coal: 1, iron: 1 },
    incomeBonus: 4,
    victoryPoints: 5,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.MANUFACTURER,
    level: 2,
    cost: { money: 10, coal: 1, iron: 1 },
    incomeBonus: 4,
    victoryPoints: 5,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.MANUFACTURER,
    level: 2,
    cost: { money: 10, coal: 1, iron: 1 },
    incomeBonus: 4,
    victoryPoints: 5,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 3 (3 tiles)
  {
    industryType: IndustryType.MANUFACTURER,
    level: 3,
    cost: { money: 12, coal: 1, iron: 1 },
    incomeBonus: 3,
    victoryPoints: 8,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.MANUFACTURER,
    level: 3,
    cost: { money: 12, coal: 1, iron: 1 },
    incomeBonus: 3,
    victoryPoints: 8,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.MANUFACTURER,
    level: 3,
    cost: { money: 12, coal: 1, iron: 1 },
    incomeBonus: 3,
    victoryPoints: 8,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 4 (2 tiles)
  {
    industryType: IndustryType.MANUFACTURER,
    level: 4,
    cost: { money: 14, coal: 1, iron: 1 },
    incomeBonus: 2,
    victoryPoints: 11,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.MANUFACTURER,
    level: 4,
    cost: { money: 14, coal: 1, iron: 1 },
    incomeBonus: 2,
    victoryPoints: 11,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
];

/**
 * Pottery tile definitions (5 per player, levels 1-5)
 * Note: Level 1 remains in Rail Era
 */
export const POTTERY_TILES: IndustryTileDefinition[] = [
  // Level 1 (1 tile) - Available in both eras
  {
    industryType: IndustryType.POTTERY,
    level: 1,
    cost: { money: 5, coal: 1, iron: 0 },
    incomeBonus: 5,
    victoryPoints: 10,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 2 (1 tile)
  {
    industryType: IndustryType.POTTERY,
    level: 2,
    cost: { money: 7, coal: 1, iron: 0 },
    incomeBonus: 4,
    victoryPoints: 1,
    beerRequired: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 3 (1 tile) - Has lightbulb
  {
    industryType: IndustryType.POTTERY,
    level: 3,
    cost: { money: 9, coal: 1, iron: 1 },
    incomeBonus: 3,
    victoryPoints: 2,
    beerRequired: 1,
    hasLightbulb: true,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 4 (1 tile) - Has lightbulb
  {
    industryType: IndustryType.POTTERY,
    level: 4,
    cost: { money: 11, coal: 1, iron: 1 },
    incomeBonus: 2,
    victoryPoints: 1,
    beerRequired: 2,
    hasLightbulb: true,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 5 (1 tile) - Has lightbulb
  {
    industryType: IndustryType.POTTERY,
    level: 5,
    cost: { money: 11, coal: 1, iron: 1 },
    incomeBonus: 1,
    victoryPoints: 1,
    beerRequired: 2,
    hasLightbulb: true,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
];

/**
 * Brewery tile definitions (7 per player, levels 1-4)
 * Note: Breweries produce 1 beer in Canal Era, 2 beer in Rail Era
 */
export const BREWERY_TILES: IndustryTileDefinition[] = [
  // Level 1 (2 tiles) - Canal Era only
  {
    industryType: IndustryType.BREWERY,
    level: 1,
    cost: { money: 5 },
    incomeBonus: 4,
    victoryPoints: 4,
    resourceCapacity: 1, // 1 in canal, 2 in rail (same tile)
    resourceType: ResourceType.BEER,
    beerCapacity: 1,
    availableInEra: [Era.CANAL],
  },
  {
    industryType: IndustryType.BREWERY,
    level: 1,
    cost: { money: 5 },
    incomeBonus: 4,
    victoryPoints: 4,
    resourceCapacity: 1,
    resourceType: ResourceType.BEER,
    beerCapacity: 1,
    availableInEra: [Era.CANAL],
  },
  // Level 2 (2 tiles)
  {
    industryType: IndustryType.BREWERY,
    level: 2,
    cost: { money: 7 },
    incomeBonus: 5,
    victoryPoints: 5,
    resourceCapacity: 1, // 1 in canal, 2 in rail
    resourceType: ResourceType.BEER,
    beerCapacity: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.BREWERY,
    level: 2,
    cost: { money: 7 },
    incomeBonus: 5,
    victoryPoints: 5,
    resourceCapacity: 1,
    resourceType: ResourceType.BEER,
    beerCapacity: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 3 (2 tiles)
  {
    industryType: IndustryType.BREWERY,
    level: 3,
    cost: { money: 9 },
    incomeBonus: 5,
    victoryPoints: 7,
    resourceCapacity: 1, // 1 in canal, 2 in rail
    resourceType: ResourceType.BEER,
    beerCapacity: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  {
    industryType: IndustryType.BREWERY,
    level: 3,
    cost: { money: 9 },
    incomeBonus: 5,
    victoryPoints: 7,
    resourceCapacity: 1,
    resourceType: ResourceType.BEER,
    beerCapacity: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
  // Level 4 (1 tile)
  {
    industryType: IndustryType.BREWERY,
    level: 4,
    cost: { money: 9 },
    incomeBonus: 4,
    victoryPoints: 10,
    resourceCapacity: 1, // 1 in canal, 2 in rail
    resourceType: ResourceType.BEER,
    beerCapacity: 1,
    availableInEra: [Era.CANAL, Era.RAIL],
  },
];

export const ALL_INDUSTRY_TILES: IndustryTileDefinition[] = [
  ...COTTON_MILL_TILES,
  ...COAL_MINE_TILES,
  ...IRON_WORKS_TILES,
  ...MANUFACTURER_TILES,
  ...POTTERY_TILES,
  ...BREWERY_TILES,
];
