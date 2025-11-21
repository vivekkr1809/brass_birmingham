import { useParams } from 'react-router-dom';

function LobbyPage() {
  const { lobbyId } = useParams<{ lobbyId: string }>();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-amber-500 mb-8">Game Lobby</h1>

        <div className="card">
          <p className="text-gray-400">Lobby ID: {lobbyId}</p>
          <p className="mt-4 text-gray-500">Lobby implementation coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default LobbyPage;
