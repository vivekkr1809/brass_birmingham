/**
 * Zustand store for game state management
 */

import { create } from 'zustand';
import { GameState, GameAction, ActionResult } from '@brass/shared';

interface GameStore {
  // Current game state
  gameState: GameState | null;
  gameId: string | null;
  currentPlayerId: string | null;

  // UI state
  selectedCard: any | null;
  selectedLocation: string | null;
  selectedTiles: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setGameState: (state: GameState) => void;
  setGameId: (id: string) => void;
  setCurrentPlayerId: (id: string) => void;
  selectCard: (card: any) => void;
  selectLocation: (location: string | null) => void;
  toggleTileSelection: (tileId: string) => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  gameState: null,
  gameId: null,
  currentPlayerId: null,
  selectedCard: null,
  selectedLocation: null,
  selectedTiles: [],
  isLoading: false,
  error: null,

  // Actions
  setGameState: (state) => set({ gameState: state, error: null }),

  setGameId: (id) => set({ gameId: id }),

  setCurrentPlayerId: (id) => set({ currentPlayerId: id }),

  selectCard: (card) => set({ selectedCard: card }),

  selectLocation: (location) => set({ selectedLocation: location }),

  toggleTileSelection: (tileId) =>
    set((state) => ({
      selectedTiles: state.selectedTiles.includes(tileId)
        ? state.selectedTiles.filter((id) => id !== tileId)
        : [...state.selectedTiles, tileId],
    })),

  clearSelection: () =>
    set({
      selectedCard: null,
      selectedLocation: null,
      selectedTiles: [],
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      gameState: null,
      gameId: null,
      currentPlayerId: null,
      selectedCard: null,
      selectedLocation: null,
      selectedTiles: [],
      isLoading: false,
      error: null,
    }),
}));
