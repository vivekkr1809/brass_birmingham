/**
 * WebSocket hook for real-time game updates
 */

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState } from '@brass/shared';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

interface UseWebSocketProps {
  gameId: string | null;
  onGameStateUpdate: (state: GameState) => void;
  onError?: (error: any) => void;
}

export function useWebSocket({ gameId, onGameStateUpdate, onError }: UseWebSocketProps): Socket | null {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');

      // Join game room if gameId is set
      if (gameId) {
        socket.emit('game:join', gameId);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
    });

    socket.on('game:joined', (data: { gameId: string }) => {
      console.log(`🎮 Joined game: ${data.gameId}`);
    });

    // Game state updates
    socket.on('game:state', (state: GameState) => {
      console.log('📦 Game state update received');
      onGameStateUpdate(state);
    });

    // Error handling
    socket.on('error', (error: any) => {
      console.error('❌ WebSocket error:', error);
      onError?.(error);
    });

    // Cleanup on unmount
    return () => {
      if (gameId) {
        socket.emit('game:leave', gameId);
      }
      socket.disconnect();
    };
  }, [gameId, onGameStateUpdate, onError]);

  // Join/leave game room when gameId changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    if (gameId) {
      socket.emit('game:join', gameId);
    }
  }, [gameId]);

  return socketRef.current;
}
