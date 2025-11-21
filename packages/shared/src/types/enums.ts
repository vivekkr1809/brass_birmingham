/**
 * Game enums and constants for Brass Birmingham
 */

export enum Era {
  CANAL = 'canal',
  RAIL = 'rail',
}

export enum IndustryType {
  COTTON_MILL = 'cotton_mill',
  COAL_MINE = 'coal_mine',
  IRON_WORKS = 'iron_works',
  MANUFACTURER = 'manufacturer',
  POTTERY = 'pottery',
  BREWERY = 'brewery',
}

export enum ActionType {
  BUILD = 'build',
  NETWORK = 'network',
  DEVELOP = 'develop',
  SELL = 'sell',
  LOAN = 'loan',
  SCOUT = 'scout',
  PASS = 'pass',
}

export enum ResourceType {
  COAL = 'coal',
  IRON = 'iron',
  BEER = 'beer',
}

export enum CardType {
  LOCATION = 'location',
  INDUSTRY = 'industry',
  WILD_LOCATION = 'wild_location',
  WILD_INDUSTRY = 'wild_industry',
}

export enum PlayerColor {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  PURPLE = 'purple',
}

export enum LinkType {
  CANAL = 'canal',
  RAIL = 'rail',
}

export enum GamePhase {
  SETUP = 'setup',
  PLAYING = 'playing',
  ERA_TRANSITION = 'era_transition',
  FINISHED = 'finished',
}

export enum MerchantBonusType {
  DEVELOP = 'develop',
  INCOME = 'income',
  VP = 'vp',
  MONEY = 'money',
}

/**
 * Board locations in Brass Birmingham
 */
export const LOCATIONS = [
  'BELPER',
  'BIRMINGHAM',
  'BURTON_ON_TRENT',
  'CANNOCK',
  'COALBROOKDALE',
  'COVENTRY',
  'DERBY',
  'DUDLEY',
  'FARM_BREWERY_1',
  'FARM_BREWERY_2',
  'FARM_BREWERY_3',
  'GLOUCESTER',
  'KIDDERMINSTER',
  'LEEK',
  'MARKET_HARBOROUGH',
  'NANWICH',
  'NOTTINGHAM',
  'NUNEATON',
  'OXFORD',
  'REDDITCH',
  'SHREWSBURY',
  'STAFFORD',
  'STONE',
  'STOURBRIDGE',
  'TAMWORTH',
  'UTTOXETER',
  'WALSALL',
  'WARRINGTON',
  'WEDNESBURY',
  'WOLVERHAMPTON',
  'WORCESTER',
] as const;

export type Location = (typeof LOCATIONS)[number];

/**
 * Player count markers on cards
 */
export enum PlayerCount {
  TWO = 2,
  THREE = 3,
  FOUR = 4,
}
