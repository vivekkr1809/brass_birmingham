/**
 * Main game engine - orchestrates all game logic
 */

import {
  GameState,
  GameAction,
  ActionType,
  ActionResult,
  ActionValidation,
  BuildAction,
  NetworkAction,
  SellAction,
  DevelopAction,
  LoanAction,
  ScoutAction,
  PassAction,
} from '../types';
import { validateBuildAction, executeBuildAction } from '../validators/build-action';
import { validateNetworkAction, executeNetworkAction } from '../validators/network-action';
import { validateSellAction, executeSellAction } from '../validators/sell-action';
import {
  validateDevelopAction,
  executeDevelopAction,
  validateLoanAction,
  executeLoanAction,
  validateScoutAction,
  executeScoutAction,
  validatePassAction,
  executePassAction,
} from '../validators/other-actions';
import { getCurrentPlayer, canPlayerAct } from './turn-manager';
import { endTurn, collectIncome } from './era-manager';

/**
 * Main game engine class
 */
export class GameEngine {
  /**
   * Validate an action
   */
  static validateAction(state: GameState, action: GameAction): ActionValidation {
    // Check if it's the player's turn
    const currentPlayer = getCurrentPlayer(state);
    if (!currentPlayer || currentPlayer.playerId !== action.playerId) {
      return {
        valid: false,
        errors: ['Not your turn'],
      };
    }

    // Check if player can act
    if (!canPlayerAct(currentPlayer)) {
      return {
        valid: false,
        errors: ['Player has no actions remaining or has passed'],
      };
    }

    // Validate specific action type
    switch (action.type) {
      case ActionType.BUILD:
        return validateBuildAction(state, action as BuildAction);
      case ActionType.NETWORK:
        return validateNetworkAction(state, action as NetworkAction);
      case ActionType.SELL:
        return validateSellAction(state, action as SellAction);
      case ActionType.DEVELOP:
        return validateDevelopAction(state, action as DevelopAction);
      case ActionType.LOAN:
        return validateLoanAction(state, action as LoanAction);
      case ActionType.SCOUT:
        return validateScoutAction(state, action as ScoutAction);
      case ActionType.PASS:
        return validatePassAction(state, action as PassAction);
      default:
        return {
          valid: false,
          errors: ['Unknown action type'],
        };
    }
  }

  /**
   * Execute an action
   */
  static executeAction(state: GameState, action: GameAction): ActionResult {
    // Validate first
    const validation = this.validateAction(state, action);
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors,
        stateChanges: [],
      };
    }

    // Execute specific action type
    let result: ActionResult;

    switch (action.type) {
      case ActionType.BUILD:
        result = executeBuildAction(state, action as BuildAction);
        break;
      case ActionType.NETWORK:
        result = executeNetworkAction(state, action as NetworkAction);
        break;
      case ActionType.SELL:
        result = executeSellAction(state, action as SellAction);
        break;
      case ActionType.DEVELOP:
        result = executeDevelopAction(state, action as DevelopAction);
        break;
      case ActionType.LOAN:
        result = executeLoanAction(state, action as LoanAction);
        break;
      case ActionType.SCOUT:
        result = executeScoutAction(state, action as ScoutAction);
        break;
      case ActionType.PASS:
        result = executePassAction(state, action as PassAction);
        break;
      default:
        return {
          success: false,
          errors: ['Unknown action type'],
          stateChanges: [],
        };
    }

    // If action was successful and player has no more actions, end turn
    if (result.success) {
      const currentPlayer = getCurrentPlayer(state);
      if (currentPlayer && (currentPlayer.actionsRemainingThisTurn === 0 || currentPlayer.hasPassed)) {
        endTurn(state);
      }
    }

    return result;
  }

  /**
   * Get available actions for current player
   */
  static getAvailableActions(state: GameState): ActionType[] {
    const currentPlayer = getCurrentPlayer(state);
    if (!currentPlayer || !canPlayerAct(currentPlayer)) {
      return [];
    }

    // All action types are always available (validation will check specifics)
    return [
      ActionType.BUILD,
      ActionType.NETWORK,
      ActionType.DEVELOP,
      ActionType.SELL,
      ActionType.LOAN,
      ActionType.SCOUT,
      ActionType.PASS,
    ];
  }

  /**
   * Check if game is finished
   */
  static isGameFinished(state: GameState): boolean {
    return state.phase === 'finished';
  }

  /**
   * Get game summary/status
   */
  static getGameSummary(state: GameState) {
    const currentPlayer = getCurrentPlayer(state);

    return {
      gameId: state.gameId,
      phase: state.phase,
      currentEra: state.currentEra,
      currentRound: state.currentRound,
      maxRounds: state.maxRounds,
      currentPlayerId: currentPlayer?.playerId,
      playerCount: state.playerCount,
      players: state.players.map((p) => ({
        playerId: p.playerId,
        money: p.money,
        income: p.income,
        victoryPoints: p.victoryPoints,
        handSize: p.hand.length,
        linkTilesRemaining: p.linkTilesRemaining,
        actionsRemaining: p.actionsRemainingThisTurn,
        hasPassed: p.hasPassed,
      })),
    };
  }
}
