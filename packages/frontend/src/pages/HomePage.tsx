import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');

  const handleCreateGame = () => {
    if (playerName.trim()) {
      // TODO: Create lobby via API
      console.log('Creating game for:', playerName);
    }
  };

  const handleJoinGame = () => {
    if (playerName.trim()) {
      // TODO: Show join game dialog
      console.log('Joining game as:', playerName);
    }
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
              onClick={handleCreateGame}
              disabled={!playerName.trim()}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create New Game
            </button>

            <button
              onClick={handleJoinGame}
              disabled={!playerName.trim()}
              className="w-full btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Existing Game
            </button>
          </div>
        </div>

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
