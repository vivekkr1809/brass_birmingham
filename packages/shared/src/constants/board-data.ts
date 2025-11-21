/**
 * Board configuration data for Brass Birmingham
 * Includes all locations, connections, industry slots, and merchants
 */

import {
  Location,
  IndustryType,
  LinkType,
  MerchantBonusType,
  PlayerCount,
} from '../types/enums';
import { BoardLocation, MerchantTile } from '../types/board';

/**
 * Board locations with their industry slots and connections
 * Coordinates are approximate for UI rendering (0-1000 scale)
 */
export const BOARD_LOCATIONS: BoardLocation[] = [
  {
    name: 'BELPER',
    industrySlots: [
      { allowedIndustries: [IndustryType.COTTON_MILL] },
      { allowedIndustries: [IndustryType.COTTON_MILL] },
    ],
    adjacentLocations: ['DERBY'],
    coordinates: { x: 650, y: 300 },
  },
  {
    name: 'BIRMINGHAM',
    industrySlots: [
      { allowedIndustries: [IndustryType.MANUFACTURER] },
      { allowedIndustries: [IndustryType.MANUFACTURER] },
      { allowedIndustries: [IndustryType.MANUFACTURER] },
      { allowedIndustries: [IndustryType.MANUFACTURER] },
    ],
    adjacentLocations: ['COVENTRY', 'DUDLEY', 'NUNEATON', 'WALSALL', 'WOLVERHAMPTON'],
    coordinates: { x: 400, y: 500 },
  },
  {
    name: 'BURTON_ON_TRENT',
    industrySlots: [
      { allowedIndustries: [IndustryType.BREWERY] },
      { allowedIndustries: [IndustryType.BREWERY] },
      { allowedIndustries: [IndustryType.POTTERY] },
    ],
    adjacentLocations: ['DERBY', 'TAMWORTH'],
    coordinates: { x: 550, y: 400 },
  },
  {
    name: 'CANNOCK',
    industrySlots: [
      { allowedIndustries: [IndustryType.COAL_MINE] },
      { allowedIndustries: [IndustryType.COAL_MINE] },
    ],
    adjacentLocations: ['FARM_BREWERY_2', 'WALSALL', 'WOLVERHAMPTON'],
    coordinates: { x: 350, y: 400 },
  },
  {
    name: 'COALBROOKDALE',
    industrySlots: [
      { allowedIndustries: [IndustryType.COAL_MINE] },
      { allowedIndustries: [IndustryType.IRON_WORKS] },
      { allowedIndustries: [IndustryType.IRON_WORKS] },
      { allowedIndustries: [IndustryType.BREWERY] },
    ],
    adjacentLocations: ['SHREWSBURY', 'WOLVERHAMPTON', 'WORCESTER'],
    coordinates: { x: 200, y: 450 },
  },
  {
    name: 'COVENTRY',
    industrySlots: [
      { allowedIndustries: [IndustryType.MANUFACTURER] },
      { allowedIndustries: [IndustryType.MANUFACTURER] },
      { allowedIndustries: [IndustryType.MANUFACTURER] },
    ],
    adjacentLocations: ['BIRMINGHAM', 'NUNEATON', 'OXFORD'],
    coordinates: { x: 500, y: 600 },
  },
  {
    name: 'DERBY',
    industrySlots: [
      { allowedIndustries: [IndustryType.IRON_WORKS] },
      { allowedIndustries: [IndustryType.POTTERY] },
      { allowedIndustries: [IndustryType.POTTERY] },
    ],
    adjacentLocations: ['BELPER', 'BURTON_ON_TRENT', 'LEEK', 'NOTTINGHAM'],
    coordinates: { x: 600, y: 350 },
  },
  {
    name: 'DUDLEY',
    industrySlots: [
      { allowedIndustries: [IndustryType.COAL_MINE] },
      { allowedIndustries: [IndustryType.IRON_WORKS] },
    ],
    adjacentLocations: ['BIRMINGHAM', 'KIDDERMINSTER', 'WORCESTER'],
    coordinates: { x: 300, y: 550 },
  },
  {
    name: 'FARM_BREWERY_1',
    industrySlots: [{ allowedIndustries: [IndustryType.BREWERY] }],
    adjacentLocations: ['STONE'],
    coordinates: { x: 250, y: 250 },
  },
  {
    name: 'FARM_BREWERY_2',
    industrySlots: [{ allowedIndustries: [IndustryType.BREWERY] }],
    adjacentLocations: ['CANNOCK', 'STONE'],
    coordinates: { x: 300, y: 300 },
  },
  {
    name: 'FARM_BREWERY_3',
    industrySlots: [{ allowedIndustries: [IndustryType.BREWERY] }],
    adjacentLocations: ['KIDDERMINSTER', 'WORCESTER'],
    coordinates: { x: 200, y: 600 },
  },
  {
    name: 'GLOUCESTER',
    industrySlots: [
      { allowedIndustries: [IndustryType.COAL_MINE] },
      { allowedIndustries: [IndustryType.BREWERY] },
    ],
    adjacentLocations: ['OXFORD', 'WORCESTER'],
    coordinates: { x: 300, y: 700 },
  },
  {
    name: 'KIDDERMINSTER',
    industrySlots: [
      { allowedIndustries: [IndustryType.COAL_MINE] },
      { allowedIndustries: [IndustryType.COTTON_MILL] },
    ],
    adjacentLocations: ['DUDLEY', 'FARM_BREWERY_3', 'WORCESTER'],
    coordinates: { x: 250, y: 600 },
  },
  {
    name: 'LEEK',
    industrySlots: [
      { allowedIndustries: [IndustryType.COTTON_MILL] },
      { allowedIndustries: [IndustryType.POTTERY] },
    ],
    adjacentLocations: ['DERBY', 'STONE', 'UTTOXETER'],
    coordinates: { x: 500, y: 250 },
  },
  {
    name: 'MARKET_HARBOROUGH',
    industrySlots: [{ allowedIndustries: [IndustryType.BREWERY] }],
    adjacentLocations: ['NOTTINGHAM', 'NUNEATON', 'OXFORD'],
    coordinates: { x: 650, y: 500 },
  },
  {
    name: 'NANWICH',
    industrySlots: [
      { allowedIndustries: [IndustryType.COTTON_MILL] },
      { allowedIndustries: [IndustryType.POTTERY] },
    ],
    adjacentLocations: ['STONE', 'WARRINGTON'],
    coordinates: { x: 300, y: 150 },
  },
  {
    name: 'NOTTINGHAM',
    industrySlots: [
      { allowedIndustries: [IndustryType.COTTON_MILL] },
      { allowedIndustries: [IndustryType.COTTON_MILL] },
      { allowedIndustries: [IndustryType.MANUFACTURER] },
    ],
    adjacentLocations: ['DERBY', 'MARKET_HARBOROUGH'],
    coordinates: { x: 700, y: 400 },
  },
  {
    name: 'NUNEATON',
    industrySlots: [
      { allowedIndustries: [IndustryType.COAL_MINE] },
      { allowedIndustries: [IndustryType.BREWERY] },
    ],
    adjacentLocations: ['BIRMINGHAM', 'COVENTRY', 'MARKET_HARBOROUGH', 'TAMWORTH'],
    coordinates: { x: 500, y: 500 },
  },
  {
    name: 'OXFORD',
    industrySlots: [
      { allowedIndustries: [IndustryType.MANUFACTURER] },
      { allowedIndustries: [IndustryType.MANUFACTURER] },
    ],
    adjacentLocations: ['COVENTRY', 'GLOUCESTER', 'MARKET_HARBOROUGH'],
    coordinates: { x: 500, y: 700 },
  },
  {
    name: 'REDDITCH',
    industrySlots: [{ allowedIndustries: [IndustryType.COAL_MINE] }],
    adjacentLocations: ['WORCESTER'],
    coordinates: { x: 350, y: 650 },
  },
  {
    name: 'SHREWSBURY',
    industrySlots: [
      { allowedIndustries: [IndustryType.COAL_MINE] },
      { allowedIndustries: [IndustryType.POTTERY] },
    ],
    adjacentLocations: ['COALBROOKDALE', 'STONE', 'WOLVERHAMPTON'],
    coordinates: { x: 200, y: 300 },
  },
  {
    name: 'STAFFORD',
    industrySlots: [{ allowedIndustries: [IndustryType.BREWERY] }],
    adjacentLocations: ['STONE', 'UTTOXETER'],
    coordinates: { x: 400, y: 300 },
  },
  {
    name: 'STONE',
    industrySlots: [
      { allowedIndustries: [IndustryType.COTTON_MILL] },
      { allowedIndustries: [IndustryType.POTTERY] },
    ],
    adjacentLocations: [
      'FARM_BREWERY_1',
      'FARM_BREWERY_2',
      'LEEK',
      'NANWICH',
      'SHREWSBURY',
      'STAFFORD',
    ],
    coordinates: { x: 350, y: 250 },
  },
  {
    name: 'STOURBRIDGE',
    industrySlots: [
      { allowedIndustries: [IndustryType.COAL_MINE] },
      { allowedIndustries: [IndustryType.IRON_WORKS] },
    ],
    adjacentLocations: ['WORCESTER'],
    coordinates: { x: 300, y: 600 },
  },
  {
    name: 'TAMWORTH',
    industrySlots: [{ allowedIndustries: [IndustryType.BREWERY] }],
    adjacentLocations: ['BURTON_ON_TRENT', 'NUNEATON', 'WALSALL'],
    coordinates: { x: 450, y: 450 },
  },
  {
    name: 'UTTOXETER',
    industrySlots: [
      { allowedIndustries: [IndustryType.COAL_MINE] },
      { allowedIndustries: [IndustryType.BREWERY] },
    ],
    adjacentLocations: ['LEEK', 'STAFFORD'],
    coordinates: { x: 450, y: 300 },
  },
  {
    name: 'WALSALL',
    industrySlots: [{ allowedIndustries: [IndustryType.MANUFACTURER] }],
    adjacentLocations: ['BIRMINGHAM', 'CANNOCK', 'TAMWORTH', 'WOLVERHAMPTON'],
    coordinates: { x: 400, y: 450 },
  },
  {
    name: 'WARRINGTON',
    industrySlots: [
      { allowedIndustries: [IndustryType.COTTON_MILL] },
      { allowedIndustries: [IndustryType.COTTON_MILL] },
      { allowedIndustries: [IndustryType.BREWERY] },
    ],
    adjacentLocations: ['NANWICH'],
    coordinates: { x: 250, y: 100 },
  },
  {
    name: 'WEDNESBURY',
    industrySlots: [{ allowedIndustries: [IndustryType.COAL_MINE] }],
    adjacentLocations: ['WOLVERHAMPTON'],
    coordinates: { x: 350, y: 450 },
  },
  {
    name: 'WOLVERHAMPTON',
    industrySlots: [
      { allowedIndustries: [IndustryType.MANUFACTURER] },
      { allowedIndustries: [IndustryType.MANUFACTURER] },
    ],
    adjacentLocations: [
      'BIRMINGHAM',
      'CANNOCK',
      'COALBROOKDALE',
      'SHREWSBURY',
      'WALSALL',
      'WEDNESBURY',
    ],
    coordinates: { x: 300, y: 400 },
  },
  {
    name: 'WORCESTER',
    industrySlots: [
      { allowedIndustries: [IndustryType.COTTON_MILL] },
      { allowedIndustries: [IndustryType.POTTERY] },
    ],
    adjacentLocations: [
      'COALBROOKDALE',
      'DUDLEY',
      'FARM_BREWERY_3',
      'GLOUCESTER',
      'KIDDERMINSTER',
      'REDDITCH',
      'STOURBRIDGE',
    ],
    coordinates: { x: 250, y: 650 },
  },
];

/**
 * Merchant tiles by location
 */
export const MERCHANT_TILES: Omit<MerchantTile, 'id' | 'currentBeer'>[] = [
  {
    location: 'GLOUCESTER',
    industryType: IndustryType.MANUFACTURER,
    bonusType: MerchantBonusType.DEVELOP,
    bonusValue: 1, // Free develop action
    hasBeerSpace: true,
    minPlayerCount: PlayerCount.TWO,
  },
  {
    location: 'GLOUCESTER',
    industryType: IndustryType.POTTERY,
    bonusType: MerchantBonusType.DEVELOP,
    bonusValue: 1,
    hasBeerSpace: true,
    minPlayerCount: PlayerCount.THREE,
  },
  {
    location: 'OXFORD',
    industryType: IndustryType.MANUFACTURER,
    bonusType: MerchantBonusType.INCOME,
    bonusValue: 2, // +2 income spaces
    hasBeerSpace: true,
    minPlayerCount: PlayerCount.TWO,
  },
  {
    location: 'OXFORD',
    industryType: IndustryType.COTTON_MILL,
    bonusType: MerchantBonusType.INCOME,
    bonusValue: 2,
    hasBeerSpace: true,
    minPlayerCount: PlayerCount.FOUR,
  },
  {
    location: 'WARRINGTON',
    industryType: IndustryType.COTTON_MILL,
    bonusType: MerchantBonusType.MONEY,
    bonusValue: 5, // +£5
    hasBeerSpace: true,
    minPlayerCount: PlayerCount.TWO,
  },
  {
    location: 'WARRINGTON',
    industryType: IndustryType.COTTON_MILL,
    bonusType: MerchantBonusType.MONEY,
    bonusValue: 5,
    hasBeerSpace: true,
    minPlayerCount: PlayerCount.THREE,
  },
  {
    location: 'NOTTINGHAM',
    industryType: IndustryType.COTTON_MILL,
    bonusType: MerchantBonusType.VP,
    bonusValue: 3, // +3 VP
    hasBeerSpace: true,
    minPlayerCount: PlayerCount.TWO,
  },
  {
    location: 'NOTTINGHAM',
    industryType: IndustryType.MANUFACTURER,
    bonusType: MerchantBonusType.VP,
    bonusValue: 3,
    hasBeerSpace: true,
    minPlayerCount: PlayerCount.THREE,
  },
  {
    location: 'SHREWSBURY',
    industryType: IndustryType.POTTERY,
    bonusType: MerchantBonusType.VP,
    bonusValue: 5, // +5 VP
    hasBeerSpace: true,
    minPlayerCount: PlayerCount.TWO,
  },
];

/**
 * Get board location by name
 */
export function getBoardLocation(name: Location): BoardLocation | undefined {
  return BOARD_LOCATIONS.find((loc) => loc.name === name);
}

/**
 * Get merchants for specific player count
 */
export function getMerchantsForPlayerCount(playerCount: PlayerCount): MerchantTile[] {
  return MERCHANT_TILES.filter((m) => m.minPlayerCount <= playerCount).map((m, index) => ({
    ...m,
    id: `merchant-${index}`,
    currentBeer: m.hasBeerSpace ? 1 : 0,
  }));
}
