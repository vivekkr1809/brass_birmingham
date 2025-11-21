/**
 * Game action types for Brass Birmingham
 */

import { ActionType, IndustryType, Location, LinkType } from './enums';
import { GameCard } from './card';

/**
 * Base action interface
 */
export interface BaseAction {
  type: ActionType;
  playerId: string;
  cardUsed: GameCard;
}

/**
 * Build action - Place an industry tile
 */
export interface BuildAction extends BaseAction {
  type: ActionType.BUILD;
  location: Location;
  industryType: IndustryType;
  tileId: string; // ID of tile being placed
  coalSources?: ResourceSource[]; // Where coal comes from
  ironSources?: ResourceSource[]; // Where iron comes from
}

/**
 * Network action - Place link tiles
 */
export interface NetworkAction extends BaseAction {
  type: ActionType.NETWORK;
  connections: {
    from: Location;
    to: Location;
    linkType: LinkType;
  }[];
  coalSources?: ResourceSource[]; // For rail era
  beerSource?: ResourceSource; // For 2-link option in rail era
}

/**
 * Develop action - Remove tiles from player mat
 */
export interface DevelopAction extends BaseAction {
  type: ActionType.DEVELOP;
  tileIds: string[]; // 1 or 2 tiles to remove
  ironSources: ResourceSource[];
}

/**
 * Sell action - Flip industry tiles by connecting to merchants
 */
export interface SellAction extends BaseAction {
  type: ActionType.SELL;
  sales: {
    tileId: string; // Industry tile to sell
    merchantId: string; // Merchant to sell to
    beerSource: ResourceSource;
  }[];
}

/**
 * Loan action - Take £30 and decrease income
 */
export interface LoanAction extends BaseAction {
  type: ActionType.LOAN;
}

/**
 * Scout action - Discard 3 cards to get wild cards
 */
export interface ScoutAction extends BaseAction {
  type: ActionType.SCOUT;
  additionalCardsDiscarded: GameCard[]; // 2 more cards beyond the action card
}

/**
 * Pass action - Skip rest of turn
 */
export interface PassAction extends BaseAction {
  type: ActionType.PASS;
}

/**
 * Union of all action types
 */
export type GameAction =
  | BuildAction
  | NetworkAction
  | DevelopAction
  | SellAction
  | LoanAction
  | ScoutAction
  | PassAction;

/**
 * Resource source for action validation
 */
export interface ResourceSource {
  type: 'market' | 'tile' | 'merchant';
  tileId?: string; // If from a tile (coal mine, iron works, brewery)
  merchantId?: string; // If from merchant beer
  cost: number; // Cost of resource (market price or free from tile)
}

/**
 * Action validation result
 */
export interface ActionValidation {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Action result after execution
 */
export interface ActionResult {
  success: boolean;
  errors: string[];
  stateChanges: StateChange[];
}

/**
 * State change from an action
 */
export interface StateChange {
  type:
    | 'money'
    | 'income'
    | 'vp'
    | 'tile_placed'
    | 'tile_flipped'
    | 'tile_removed'
    | 'link_placed'
    | 'card_drawn'
    | 'card_discarded'
    | 'resource_consumed'
    | 'resource_added'
    | 'market_changed';
  playerId: string;
  details: Record<string, any>;
}
