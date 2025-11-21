/**
 * Card types and definitions for Brass Birmingham
 */

import { CardType, IndustryType, Location, PlayerCount } from './enums';

export interface Card {
  id: string;
  type: CardType;
}

export interface LocationCard extends Card {
  type: CardType.LOCATION;
  location: Location;
  minPlayerCount: PlayerCount; // Card only used if player count >= this
}

export interface IndustryCard extends Card {
  type: CardType.INDUSTRY;
  industryType: IndustryType;
  minPlayerCount: PlayerCount;
}

export interface WildLocationCard extends Card {
  type: CardType.WILD_LOCATION;
}

export interface WildIndustryCard extends Card {
  type: CardType.WILD_INDUSTRY;
}

export type GameCard = LocationCard | IndustryCard | WildLocationCard | WildIndustryCard;

/**
 * Card deck management
 */
export interface CardDeck {
  drawPile: GameCard[];
  discardPile: GameCard[];
  wildLocationCards: WildLocationCard[];
  wildIndustryCards: WildIndustryCard[];
}

/**
 * Helper type guards
 */
export function isLocationCard(card: GameCard): card is LocationCard {
  return card.type === CardType.LOCATION;
}

export function isIndustryCard(card: GameCard): card is IndustryCard {
  return card.type === CardType.INDUSTRY;
}

export function isWildLocationCard(card: GameCard): card is WildLocationCard {
  return card.type === CardType.WILD_LOCATION;
}

export function isWildIndustryCard(card: GameCard): card is WildIndustryCard {
  return card.type === CardType.WILD_INDUSTRY;
}

export function isWildCard(card: GameCard): boolean {
  return isWildLocationCard(card) || isWildIndustryCard(card);
}
