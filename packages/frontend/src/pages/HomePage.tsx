import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameApi } from '../hooks/useGameApi';
import { useGameStore } from '../stores/game-store';

function HomePage() {
  const navigate = useNavigate();
  const { createGame, loading, error } = useGameApi();
  const { setCurrentPlayerId } = useGameStore();

  const [playerName, setPlayerName] = useState('');
  const [playerCount, setPlayerCount] = useState(2);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [additionalPlayers, setAdditionalPlayers] = useState<string[]>(['Player 2']);

  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    const playerIds = [playerName, ...additionalPlayers.filter((p) => p.trim())];

    if (playerIds.length !== playerCount) {
      alert(`Please provide ${playerCount} player names`);
      return;
    }

    try {
      const game = await createGame({
        playerCount,
        playerIds,
      });

      // Set current player ID
      setCurrentPlayerId(playerName);

      // Navigate to game
      navigate(`/game/${game.gameId}`);
    } catch (err) {
      console.error('Failed to create game:', err);
    }
  };

  const updateAdditionalPlayers = (count: number) => {
    const players = Array.from({ length: count - 1 }, (_, i) => `Player ${i + 2}`);
    setAdditionalPlayers(players);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="font-display text-6xl font-bold text-amber-500 mb-4">
            Brass Birmingham
          </h1>
          <p className="text-gray-400 text-lg">
            A digital implementation of the industrial revolution board game
          </p>
        </div>

        {!showCreateForm ? (
          <div className="card max-w-md mx-auto">
            <div className="mb-6">
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="input"
                maxLength={20}
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowCreateForm(true)}
                disabled={!playerName.trim() || loading}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🎮 Create New Game
              </button>

              <button
                onClick={() => alert('Browse games coming soon!')}
                className="w-full btn btn-secondary"
              >
                🔍 Browse Games (Coming Soon)
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded text-red-100 text-sm">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="card max-w-md mx-auto">
            <button
              onClick={() => setShowCreateForm(false)}
              className="mb-4 text-gray-400 hover:text-white"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-amber-500 mb-6">Create Game</h2>

            {/* Player count selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of Players
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      setPlayerCount(count);
                      updateAdditionalPlayers(count);
                    }}
                    className={`py-2 px-4 rounded ${
                      playerCount === count
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {count} Players
                  </button>
                ))}
              </div>
            </div>

            {/* Player names */}
            <div className="mb-6 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Player 1 (You)
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="input"
                  placeholder="Your name"
                />
              </div>

              {additionalPlayers.map((player, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Player {index + 2}
                  </label>
                  <input
                    type="text"
                    value={player}
                    onChange={(e) => {
                      const newPlayers = [...additionalPlayers];
                      newPlayers[index] = e.target.value;
                      setAdditionalPlayers(newPlayers);
                    }}
                    className="input"
                    placeholder={`Player ${index + 2} name`}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleCreateGame}
              disabled={loading}
              className="w-full btn btn-primary disabled:opacity-50"
            >
              {loading ? 'Creating...' : '✓ Create Game'}
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Original game by Martin Wallace, Gavan Brown, and Matt Tolman</p>
          <p className="mt-1">Published by Roxley Games</p>
          <p className="mt-2">This is a fan-made digital implementation for educational purposes</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
