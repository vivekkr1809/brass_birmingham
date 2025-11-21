import { useParams } from 'react-router-dom';

function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-amber-500 mb-8">Brass Birmingham</h1>

        <div className="card">
          <p className="text-gray-400">Game ID: {gameId}</p>
          <p className="mt-4 text-gray-500">Game board implementation coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
