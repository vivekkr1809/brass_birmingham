/**
 * Main game page component
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGameStore } from '../stores/game-store';
import { useWebSocket } from '../hooks/useWebSocket';
import { useGameApi } from '../hooks/useGameApi';
import { GameBoard } from '../components/Board/GameBoard';
import { PlayerHand } from '../components/Player/PlayerHand';
import { PlayerInfo } from '../components/Player/PlayerInfo';
import { ActionPanel } from '../components/Actions/ActionPanel';
import { Markets } from '../components/UI/Markets';
import {
  ActionType,
  Location,
  GameEngine,
} from '@brass/shared';

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { getGameState } = useGameApi();

  const {
    gameState,
    currentPlayerId,
    selectedCard,
    selectedLocation,
    isLoading,
    error,
    setGameState,
    setGameId,
    selectCard,
    selectLocation,
    clearSelection,
  } = useGameStore();

  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Initialize game state
  useEffect(() => {
    if (gameId) {
      setGameId(gameId);
      loadGameState();
    }
  }, [gameId]);

  const loadGameState = async () => {
    if (!gameId) return;

    try {
      const state = await getGameState(gameId);
      setGameState(state);
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
  };

  // WebSocket for real-time updates
  useWebSocket({
    gameId: gameId || null,
    onGameStateUpdate: (state) => {
      setGameState(state);
    },
    onError: (err) => {
      console.error('WebSocket error:', err);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-amber-500">Loading game...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={loadGameState}
            className="btn btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-500">Game not found</div>
      </div>
    );
  }

  // Get current player
  const currentPlayer = gameState.players.find(
    (p) => p.playerId === gameState.turnOrder[gameState.currentPlayerIndex]?.playerId
  );

  const myPlayer = gameState.players.find((p) => p.playerId === currentPlayerId);
  const isMyTurn = currentPlayer?.playerId === currentPlayerId;

  // Get available actions
  const availableActions = GameEngine.getAvailableActions(gameState);

  const handleCancelAction = () => {
    clearSelection();
    setSelectedAction(null);
    setActionError(null);
  };

  // Render action execution placeholder
  const renderActionExecution = () => {
    if (!selectedAction) return null;

    return (
      <div className="bg-gray-900 rounded-lg p-4 border-2 border-amber-500">
        <h3 className="text-lg font-bold text-amber-500 mb-3">
          Execute {selectedAction}
        </h3>

        <div className="space-y-2 text-sm text-gray-300 mb-4">
          {selectedCard && <div>Card: {selectedCard.type}</div>}
          {selectedLocation && <div>Location: {selectedLocation}</div>}
        </div>

        <div className="bg-blue-900 border border-blue-700 rounded p-3 mb-4 text-xs text-blue-100">
          <strong>Action execution UI ready for implementation!</strong>
          <br />
          <br />
          The backend API is fully functional and handles:
          <ul className="list-disc list-inside mt-2">
            <li>Tile selection and placement validation</li>
            <li>Automatic resource sourcing (coal, iron, beer)</li>
            <li>Network connectivity checks</li>
            <li>Merchant selection and sales logic</li>
            <li>All game rule enforcement</li>
          </ul>
          <br />
          Next step: Build detailed tile/merchant selection UI components.
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => alert('Action execution coming soon! Backend is ready.')}
            className="btn btn-primary flex-1"
          >
            ✓ Execute (Coming Soon)
          </button>
          <button
            onClick={handleCancelAction}
            className="btn btn-danger flex-1"
          >
            ✗ Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-display text-4xl font-bold text-amber-500">
          Brass Birmingham
        </h1>
        <div className="flex gap-4 items-center">
          <span className="text-gray-400">
            Game ID: <span className="text-white font-mono">{gameId}</span>
          </span>
          <button
            onClick={loadGameState}
            className="btn btn-secondary"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* Action error display */}
      {actionError && (
        <div className="bg-red-900 border border-red-700 text-red-100 rounded-lg p-4">
          <strong>Action Error:</strong> {actionError}
        </div>
      )}


      {/* Main game area */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left sidebar - Players */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold text-amber-500">Players</h2>

          {gameState.players.map((player) => (
            <PlayerInfo
              key={player.playerId}
              player={player}
              isCurrentPlayer={player.playerId === currentPlayer?.playerId}
              isSelf={player.playerId === currentPlayerId}
            />
          ))}

          {/* Markets */}
          <Markets
            coalMarket={gameState.board.coalMarket}
            ironMarket={gameState.board.ironMarket}
          />
        </div>

        {/* Center - Game board */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          <GameBoard
            gameState={gameState}
            selectedLocation={selectedLocation as Location | null}
            onSelectLocation={(loc) => selectLocation(loc)}
          />

          {/* Action panel */}
          {isMyTurn && myPlayer && (
            <ActionPanel
              availableActions={availableActions}
              selectedAction={selectedAction}
              onSelectAction={setSelectedAction}
              disabled={!myPlayer || myPlayer.hasPassed}
            />
          )}

          {!isMyTurn && (
            <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-700 text-center">
              <p className="text-xl text-gray-400">
                Waiting for {currentPlayer?.playerId}'s turn...
              </p>
            </div>
          )}
        </div>

        {/* Right sidebar - Hand and actions */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {myPlayer && (
            <>
              <PlayerHand
                cards={myPlayer.hand}
                selectedCard={selectedCard}
                onSelectCard={(card) => selectCard(card)}
                disabled={!isMyTurn || myPlayer.hasPassed}
              />

              {/* Action execution */}
              {selectedAction && renderActionExecution()}

              {/* Game info */}
              <div className="bg-gray-900 rounded-lg p-4 border-2 border-gray-700 text-sm">
                <h3 className="font-bold text-white mb-2">Game Info</h3>
                <div className="space-y-1 text-gray-400">
                  <div>Era: {gameState.currentEra}</div>
                  <div>Round: {gameState.currentRound}/{gameState.maxRounds}</div>
                  <div>Phase: {gameState.phase}</div>
                  <div>Current: {currentPlayer?.playerId}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
