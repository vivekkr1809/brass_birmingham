/**
 * Card deck definitions for Brass Birmingham
 */

import { CardType, IndustryType, PlayerCount, Location, LOCATIONS } from '../types/enums';
import { LocationCard, IndustryCard, WildLocationCard, WildIndustryCard } from '../types/card';

/**
 * Generate unique card ID
 */
let cardIdCounter = 0;
function generateCardId(): string {
  return `card-${cardIdCounter++}`;
}

/**
 * Create location cards
 * Each location has 2 cards, some restricted by player count
 */
export function createLocationCards(playerCount: PlayerCount): LocationCard[] {
  const cards: LocationCard[] = [];

  const locationCardDefinitions: { location: Location; minPlayers: PlayerCount; count: number }[] =
    [
      // 2+ player locations (most locations)
      { location: 'BELPER', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'BIRMINGHAM', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'BURTON_ON_TRENT', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'CANNOCK', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'COALBROOKDALE', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'COVENTRY', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'DERBY', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'DUDLEY', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'GLOUCESTER', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'KIDDERMINSTER', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'LEEK', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'MARKET_HARBOROUGH', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'NANWICH', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'NOTTINGHAM', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'NUNEATON', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'OXFORD', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'REDDITCH', minPlayers: PlayerCount.THREE, count: 2 },
      { location: 'SHREWSBURY', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'STAFFORD', minPlayers: PlayerCount.THREE, count: 2 },
      { location: 'STONE', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'STOURBRIDGE', minPlayers: PlayerCount.THREE, count: 2 },
      { location: 'TAMWORTH', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'UTTOXETER', minPlayers: PlayerCount.THREE, count: 2 },
      { location: 'WALSALL', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'WARRINGTON', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'WEDNESBURY', minPlayers: PlayerCount.FOUR, count: 2 },
      { location: 'WOLVERHAMPTON', minPlayers: PlayerCount.TWO, count: 2 },
      { location: 'WORCESTER', minPlayers: PlayerCount.TWO, count: 2 },
    ];

  for (const def of locationCardDefinitions) {
    if (playerCount >= def.minPlayers) {
      for (let i = 0; i < def.count; i++) {
        cards.push({
          id: generateCardId(),
          type: CardType.LOCATION,
          location: def.location,
          minPlayerCount: def.minPlayers,
        });
      }
    }
  }

  return cards;
}

/**
 * Create industry cards
 * Distribution varies by player count
 */
export function createIndustryCards(playerCount: PlayerCount): IndustryCard[] {
  const cards: IndustryCard[] = [];

  const industryCardDefinitions: {
    industry: IndustryType;
    minPlayers: PlayerCount;
    count: number;
  }[] = [
    // Cotton Mill - 5 cards for 2p, 6 for 3p, 7 for 4p
    { industry: IndustryType.COTTON_MILL, minPlayers: PlayerCount.TWO, count: 5 },
    { industry: IndustryType.COTTON_MILL, minPlayers: PlayerCount.THREE, count: 1 },
    { industry: IndustryType.COTTON_MILL, minPlayers: PlayerCount.FOUR, count: 1 },
    // Coal Mine - 4 cards for all
    { industry: IndustryType.COAL_MINE, minPlayers: PlayerCount.TWO, count: 4 },
    // Iron Works - 3 cards for 2p, 4 for 3p+
    { industry: IndustryType.IRON_WORKS, minPlayers: PlayerCount.TWO, count: 3 },
    { industry: IndustryType.IRON_WORKS, minPlayers: PlayerCount.THREE, count: 1 },
    // Manufacturer - 5 cards for 2p, 6 for 3p, 7 for 4p
    { industry: IndustryType.MANUFACTURER, minPlayers: PlayerCount.TWO, count: 5 },
    { industry: IndustryType.MANUFACTURER, minPlayers: PlayerCount.THREE, count: 1 },
    { industry: IndustryType.MANUFACTURER, minPlayers: PlayerCount.FOUR, count: 1 },
    // Pottery - 3 cards for 2p, 4 for 3p+
    { industry: IndustryType.POTTERY, minPlayers: PlayerCount.TWO, count: 3 },
    { industry: IndustryType.POTTERY, minPlayers: PlayerCount.THREE, count: 1 },
    // Brewery - 4 cards for all
    { industry: IndustryType.BREWERY, minPlayers: PlayerCount.TWO, count: 4 },
  ];

  for (const def of industryCardDefinitions) {
    if (playerCount >= def.minPlayers) {
      for (let i = 0; i < def.count; i++) {
        cards.push({
          id: generateCardId(),
          type: CardType.INDUSTRY,
          industryType: def.industry,
          minPlayerCount: def.minPlayers,
        });
      }
    }
  }

  return cards;
}

/**
 * Create wild cards (4 of each type)
 */
export function createWildLocationCards(): WildLocationCard[] {
  return Array.from({ length: 4 }, () => ({
    id: generateCardId(),
    type: CardType.WILD_LOCATION,
  }));
}

export function createWildIndustryCards(): WildIndustryCard[] {
  return Array.from({ length: 4 }, () => ({
    id: generateCardId(),
    type: CardType.WILD_INDUSTRY,
  }));
}

/**
 * Create full deck for a game
 */
export function createCardDeck(playerCount: PlayerCount) {
  const locationCards = createLocationCards(playerCount);
  const industryCards = createIndustryCards(playerCount);
  const wildLocationCards = createWildLocationCards();
  const wildIndustryCards = createWildIndustryCards();

  // Shuffle location and industry cards together
  const mainDeck = [...locationCards, ...industryCards];
  shuffleArray(mainDeck);

  return {
    drawPile: mainDeck,
    discardPile: [],
    wildLocationCards,
    wildIndustryCards,
  };
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
