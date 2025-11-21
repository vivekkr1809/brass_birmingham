/**
 * Game API routes
 */

import { Router, Request, Response } from 'express';
import { GameService } from '../services/game-service.js';
import { GameConfig, PlayerCount, GameAction } from '@brass/shared';

const router = Router();

/**
 * Create a new game
 * POST /api/games
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const { playerCount, playerIds } = req.body;

    if (!playerCount || !playerIds || !Array.isArray(playerIds)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const config: GameConfig = {
      playerCount: playerCount as PlayerCount,
    };

    const game = GameService.createGame(config, playerIds);
    const summary = GameService.getGameSummary(game.gameId);

    res.status(201).json(summary);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

/**
 * Get game by ID
 * GET /api/games/:gameId
 */
router.get('/:gameId', (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const summary = GameService.getGameSummary(gameId);

    if (!summary) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(summary);
  } catch (error) {
    console.error('Error getting game:', error);
    res.status(500).json({ error: 'Failed to get game' });
  }
});

/**
 * Get full game state (for debugging)
 * GET /api/games/:gameId/state
 */
router.get('/:gameId/state', (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const game = GameService.getGame(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Convert Map to object for JSON serialization
    const state = {
      ...game,
      board: {
        ...game.board,
        locations: Object.fromEntries(game.board.locations),
      },
      placedIndustries: Object.fromEntries(game.placedIndustries),
    };

    res.json(state);
  } catch (error) {
    console.error('Error getting game state:', error);
    res.status(500).json({ error: 'Failed to get game state' });
  }
});

/**
 * Execute an action
 * POST /api/games/:gameId/actions
 */
router.post('/:gameId/actions', (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const action = req.body as GameAction;

    if (!action || !action.type || !action.playerId) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const result = GameService.executeAction(gameId, action);

    if (!result.success) {
      return res.status(400).json({ error: result.errors });
    }

    res.json(result);
  } catch (error) {
    console.error('Error executing action:', error);
    res.status(500).json({ error: 'Failed to execute action' });
  }
});

/**
 * Validate an action (without executing)
 * POST /api/games/:gameId/actions/validate
 */
router.post('/:gameId/actions/validate', (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const action = req.body as GameAction;

    if (!action || !action.type || !action.playerId) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const validation = GameService.validateAction(gameId, action);

    res.json(validation);
  } catch (error) {
    console.error('Error validating action:', error);
    res.status(500).json({ error: 'Failed to validate action' });
  }
});

/**
 * List all games
 * GET /api/games
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const games = GameService.listGames();
    res.json(games);
  } catch (error) {
    console.error('Error listing games:', error);
    res.status(500).json({ error: 'Failed to list games' });
  }
});

/**
 * Delete a game
 * DELETE /api/games/:gameId
 */
router.delete('/:gameId', (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const deleted = GameService.deleteGame(gameId);

    if (!deleted) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

export default router;
