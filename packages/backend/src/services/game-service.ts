/**
 * Game service for managing game state and actions
 */

import {
  GameState,
  GameConfig,
  GameAction,
  ActionResult,
  createGame,
  GameEngine,
} from '@brass/shared';

/**
 * In-memory game store (replace with database in production)
 */
class GameStore {
  private games: Map<string, GameState> = new Map();

  set(gameId: string, state: GameState): void {
    this.games.set(gameId, state);
  }

  get(gameId: string): GameState | undefined {
    return this.games.get(gameId);
  }

  delete(gameId: string): boolean {
    return this.games.delete(gameId);
  }

  list(): GameState[] {
    return Array.from(this.games.values());
  }
}

const gameStore = new GameStore();

/**
 * Game service
 */
export class GameService {
  /**
   * Create a new game
   */
  static createGame(config: GameConfig, playerIds: string[]): GameState {
    const game = createGame(config, playerIds);
    gameStore.set(game.gameId, game);
    return game;
  }

  /**
   * Get game by ID
   */
  static getGame(gameId: string): GameState | undefined {
    return gameStore.get(gameId);
  }

  /**
   * Execute an action
   */
  static executeAction(gameId: string, action: GameAction): ActionResult {
    const game = gameStore.get(gameId);

    if (!game) {
      return {
        success: false,
        errors: ['Game not found'],
        stateChanges: [],
      };
    }

    const result = GameEngine.executeAction(game, action);

    if (result.success) {
      gameStore.set(gameId, game);
    }

    return result;
  }

  /**
   * Validate an action without executing
   */
  static validateAction(gameId: string, action: GameAction) {
    const game = gameStore.get(gameId);

    if (!game) {
      return {
        valid: false,
        errors: ['Game not found'],
      };
    }

    return GameEngine.validateAction(game, action);
  }

  /**
   * Get game summary
   */
  static getGameSummary(gameId: string) {
    const game = gameStore.get(gameId);

    if (!game) {
      return null;
    }

    return GameEngine.getGameSummary(game);
  }

  /**
   * Get all games
   */
  static listGames() {
    return gameStore.list().map((game) => GameEngine.getGameSummary(game));
  }

  /**
   * Delete a game
   */
  static deleteGame(gameId: string): boolean {
    return gameStore.delete(gameId);
  }
}
