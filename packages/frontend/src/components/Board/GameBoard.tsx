/**
 * Main game board component
 */

import { useState } from 'react';
import { GameState, Location, BOARD_LOCATIONS } from '@brass/shared';
import { BoardLocation } from './BoardLocation';

interface GameBoardProps {
  gameState: GameState;
  selectedLocation: Location | null;
  onSelectLocation: (location: Location) => void;
}

export function GameBoard({ gameState, selectedLocation, onSelectLocation }: GameBoardProps) {
  const [zoom, setZoom] = useState(1);

  // Board dimensions
  const boardWidth = 1200;
  const boardHeight = 800;

  return (
    <div className="bg-gray-900 rounded-lg p-4 border-2 border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-amber-500">
          Brass Birmingham - {gameState.currentEra === 'canal' ? 'Canal Era' : 'Rail Era'}
        </h2>

        {/* Zoom controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="btn btn-secondary px-3 py-1 text-sm"
          >
            −
          </button>
          <span className="text-white px-3 py-1">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="btn btn-secondary px-3 py-1 text-sm"
          >
            +
          </button>
          <button
            onClick={() => setZoom(1)}
            className="btn btn-secondary px-3 py-1 text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* SVG Board */}
      <div className="bg-gray-800 rounded overflow-auto" style={{ height: '600px' }}>
        <svg
          width={boardWidth * zoom}
          height={boardHeight * zoom}
          viewBox={`0 0 ${boardWidth} ${boardHeight}`}
          className="cursor-move"
        >
          {/* Background */}
          <rect width={boardWidth} height={boardHeight} fill="#1f2937" />

          {/* Grid lines for reference */}
          <g opacity="0.1">
            {Array.from({ length: 20 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 50}
                x2={boardWidth}
                y2={i * 50}
                stroke="#fff"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 60}
                y1="0"
                x2={i * 60}
                y2={boardHeight}
                stroke="#fff"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Connections (links) */}
          {gameState.board.connections
            .filter((conn) => conn.placedLinkPlayerId !== undefined)
            .map((conn) => {
              const fromLoc = BOARD_LOCATIONS.find((l) => l.name === conn.from);
              const toLoc = BOARD_LOCATIONS.find((l) => l.name === conn.to);

              if (!fromLoc || !toLoc) return null;

              const color = conn.linkType === 'canal' ? '#3b82f6' : '#6b7280';

              return (
                <line
                  key={conn.id}
                  x1={fromLoc.coordinates.x}
                  y1={fromLoc.coordinates.y}
                  x2={toLoc.coordinates.x}
                  y2={toLoc.coordinates.y}
                  stroke={color}
                  strokeWidth="4"
                  opacity="0.8"
                />
              );
            })}

          {/* Locations */}
          {BOARD_LOCATIONS.map((location) => (
            <BoardLocation
              key={location.name}
              location={location}
              gameState={gameState}
              isSelected={selectedLocation === location.name}
              onSelect={() => onSelectLocation(location.name as Location)}
            />
          ))}
        </svg>
      </div>

      {/* Board info */}
      <div className="mt-3 flex gap-4 text-sm text-gray-400">
        <div>Round: {gameState.currentRound}/{gameState.maxRounds}</div>
        <div>Players: {gameState.playerCount}</div>
        <div>
          Era: {gameState.currentEra === 'canal' ? '🚢 Canal' : '🚂 Rail'}
        </div>
      </div>
    </div>
  );
}
