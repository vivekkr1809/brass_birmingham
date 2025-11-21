/**
 * Individual location on the game board
 */

import { GameState, BoardLocation as BoardLocationType } from '@brass/shared';

interface BoardLocationProps {
  location: BoardLocationType;
  gameState: GameState;
  isSelected: boolean;
  onSelect: () => void;
}

export function BoardLocation({ location, gameState, isSelected, onSelect }: BoardLocationProps) {
  const { x, y } = location.coordinates;

  // Get tiles placed at this location
  const placedTiles = Array.from(gameState.placedIndustries.values()).filter(
    (tile) => tile.location === location.name
  );

  const hasPlayerTiles = placedTiles.length > 0;
  const tileCount = placedTiles.length;

  return (
    <g transform={`translate(${x}, ${y})`} onClick={onSelect} className="cursor-pointer">
      {/* Location circle */}
      <circle
        r="25"
        fill={isSelected ? '#f59e0b' : hasPlayerTiles ? '#3b82f6' : '#374151'}
        stroke={isSelected ? '#fbbf24' : '#6b7280'}
        strokeWidth="2"
        className="transition-all hover:stroke-amber-500"
      />

      {/* Tile count indicator */}
      {tileCount > 0 && (
        <circle
          r="8"
          cx="20"
          cy="-20"
          fill="#ef4444"
          stroke="#991b1b"
          strokeWidth="1"
        />
      )}
      {tileCount > 0 && (
        <text
          x="20"
          y="-16"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
        >
          {tileCount}
        </text>
      )}

      {/* Location name */}
      <text
        y="5"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {location.name.split('_')[0]}
      </text>

      {/* Industry slots indicator */}
      <text
        y="40"
        textAnchor="middle"
        fill="#9ca3af"
        fontSize="8"
        className="pointer-events-none select-none"
      >
        {location.industrySlots.length} slots
      </text>

      {/* Hover highlight */}
      {isSelected && (
        <circle
          r="30"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="3"
          opacity="0.5"
          className="animate-pulse"
        />
      )}
    </g>
  );
}
