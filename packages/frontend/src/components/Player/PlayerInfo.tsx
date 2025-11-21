/**
 * Player information display
 */

import { PlayerState } from '@brass/shared';
import clsx from 'clsx';

interface PlayerInfoProps {
  player: PlayerState;
  isCurrentPlayer?: boolean;
  isSelf?: boolean;
}

export function PlayerInfo({ player, isCurrentPlayer, isSelf }: PlayerInfoProps) {
  return (
    <div
      className={clsx('bg-gray-800 rounded-lg p-4 border-2 transition-all', {
        'border-amber-500 shadow-lg': isCurrentPlayer,
        'border-blue-500': isSelf && !isCurrentPlayer,
        'border-gray-700': !isCurrentPlayer && !isSelf,
      })}
    >
      {/* Player name and status */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">
          {player.playerId}
          {isSelf && <span className="text-blue-400 ml-2">(You)</span>}
        </h3>
        {isCurrentPlayer && (
          <span className="px-2 py-1 bg-amber-500 text-black text-xs font-bold rounded">
            CURRENT TURN
          </span>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-900 rounded p-2">
          <div className="text-gray-400">Money</div>
          <div className="text-xl font-bold text-green-400">£{player.money}</div>
        </div>

        <div className="bg-gray-900 rounded p-2">
          <div className="text-gray-400">Income</div>
          <div className={clsx('text-xl font-bold', {
            'text-green-400': player.income >= 0,
            'text-red-400': player.income < 0,
          })}>
            {player.income >= 0 ? '+' : ''}{player.income}
          </div>
        </div>

        <div className="bg-gray-900 rounded p-2">
          <div className="text-gray-400">Victory Points</div>
          <div className="text-xl font-bold text-purple-400">{player.victoryPoints}</div>
        </div>

        <div className="bg-gray-900 rounded p-2">
          <div className="text-gray-400">Link Tiles</div>
          <div className="text-xl font-bold text-blue-400">{player.linkTilesRemaining}</div>
        </div>
      </div>

      {/* Actions remaining */}
      {isSelf && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-400">Actions:</span>
          <div className="flex gap-1">
            {Array.from({ length: player.actionsRemainingThisTurn }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-amber-500 rounded-full" />
            ))}
            {player.hasPassed && (
              <span className="text-red-400 ml-2">PASSED</span>
            )}
          </div>
        </div>
      )}

      {/* Hand size (for opponents) */}
      {!isSelf && (
        <div className="mt-3 text-sm text-gray-400">
          Cards in hand: {player.hand.length}
        </div>
      )}
    </div>
  );
}
