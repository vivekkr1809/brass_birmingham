/**
 * Socket.IO event handlers for real-time game communication
 */

import { Server as SocketIOServer, Socket } from 'socket.io';

export function setupSocketHandlers(io: SocketIOServer) {
  io.on('connection', (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join a game room
    socket.on('game:join', (gameId: string) => {
      socket.join(`game:${gameId}`);
      console.log(`🎮 Socket ${socket.id} joined game ${gameId}`);
      socket.emit('game:joined', { gameId });
    });

    // Leave a game room
    socket.on('game:leave', (gameId: string) => {
      socket.leave(`game:${gameId}`);
      console.log(`👋 Socket ${socket.id} left game ${gameId}`);
    });

    // Join a lobby room
    socket.on('lobby:join', (lobbyId: string) => {
      socket.join(`lobby:${lobbyId}`);
      console.log(`🏛️ Socket ${socket.id} joined lobby ${lobbyId}`);
    });

    // Leave a lobby room
    socket.on('lobby:leave', (lobbyId: string) => {
      socket.leave(`lobby:${lobbyId}`);
      console.log(`👋 Socket ${socket.id} left lobby ${lobbyId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });

    // Ping/pong for connection testing
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });
}

/**
 * Emit game state update to all players in a game
 */
export function emitGameStateUpdate(io: SocketIOServer, gameId: string, gameState: any) {
  io.to(`game:${gameId}`).emit('game:state', gameState);
}

/**
 * Emit lobby update to all players in a lobby
 */
export function emitLobbyUpdate(io: SocketIOServer, lobbyId: string, lobby: any) {
  io.to(`lobby:${lobbyId}`).emit('lobby:update', lobby);
}

/**
 * Emit error to a specific socket
 */
export function emitError(socket: Socket, message: string, code?: string) {
  socket.emit('error', { message, code });
}
