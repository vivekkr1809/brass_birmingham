/**
 * Hook for game API operations
 */

import { useState } from 'react';
import { GameAction, ActionResult } from '@brass/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface CreateGameParams {
  playerCount: number;
  playerIds: string[];
}

export function useGameApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGame = async (params: CreateGameParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      const game = await response.json();
      return game;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getGame = async (gameId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/games/${gameId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch game');
      }

      const game = await response.json();
      return game;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getGameState = async (gameId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/games/${gameId}/state`);

      if (!response.ok) {
        throw new Error('Failed to fetch game state');
      }

      const state = await response.json();
      return state;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (gameId: string, action: GameAction): Promise<ActionResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/games/${gameId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.errors?.join(', ') || 'Action failed');
      }

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateAction = async (gameId: string, action: GameAction) => {
    try {
      const response = await fetch(`${API_URL}/games/${gameId}/actions/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });

      return await response.json();
    } catch (err) {
      console.error('Validation error:', err);
      return { valid: false, errors: ['Validation request failed'] };
    }
  };

  const listGames = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/games`);

      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

      const games = await response.json();
      return games;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createGame,
    getGame,
    getGameState,
    executeAction,
    validateAction,
    listGames,
    loading,
    error,
  };
}
