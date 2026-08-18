import { Server } from 'socket.io';
import { MultiplayerRoom } from './multiplayerRoom.js';
import { AuthManager } from './authManager.js';

export const activeRooms = new Map();

export function initSocketManager(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    let currentRoomId = null;
    let currentUserId = null;

    // 1. Create Room
    socket.on('create_room', (data, callback) => {
      const { user, mode = 3, ante = 10, maxPlayers = 10 } = data;
      if (!user || !AuthManager.isUserApproved(user.id)) {
        return callback?.({ success: false, error: 'Unauthorized user.' });
      }

      const room = new MultiplayerRoom({
        hostId: user.id,
        hostName: user.firstName || user.name,
        mode: parseInt(mode, 10) || 3,
        ante: parseInt(ante, 10) || 10,
        maxPlayers: parseInt(maxPlayers, 10) || 10
      });

      activeRooms.set(room.id, room);
      callback?.({ success: true, roomId: room.id });
    });

    // 2. Join Room
    socket.on('join_room', (data, callback) => {
      const { roomId, user } = data;
      if (!user || !AuthManager.isUserApproved(user.id)) {
        return callback?.({ success: false, error: 'Unauthorized. Contact admin for approval.' });
      }

      let room = activeRooms.get(roomId);
      if (!room) {
        // Auto-create room if not found
        room = new MultiplayerRoom({
          id: roomId,
          hostId: user.id,
          hostName: user.firstName || user.name
        });
        activeRooms.set(roomId, room);
      }

      const joinRes = room.addPlayer(user);
      if (!joinRes.success) {
        return callback?.({ success: false, error: joinRes.error });
      }

      currentRoomId = roomId;
      currentUserId = user.id;
      socket.join(roomId);

      callback?.({ success: true, roomId, seatIndex: joinRes.seatIndex });
      broadcastRoomState(io, room);
    });

    // 3. Start Round (Host only)
    socket.on('start_round', (data, callback) => {
      const room = activeRooms.get(currentRoomId);
      if (!room) return callback?.({ success: false, error: 'Room not found.' });

      if (room.hostId !== String(currentUserId)) {
        return callback?.({ success: false, error: 'Only the room host can deal.' });
      }

      const res = room.startRound();
      if (!res.success) {
        return callback?.({ success: false, error: res.error });
      }

      callback?.({ success: true });
      broadcastRoomState(io, room);
    });

    // 4. Player Action (Fold, Check, Call, Raise)
    socket.on('player_action', (data, callback) => {
      const room = activeRooms.get(currentRoomId);
      if (!room) return callback?.({ success: false, error: 'Room not found.' });

      const { action, amount } = data;
      const res = room.handlePlayerAction(currentUserId, action, amount);
      if (!res.success) {
        return callback?.({ success: false, error: res.error });
      }

      callback?.({ success: true });
      broadcastRoomState(io, room);
    });

    // 5. Get Active Rooms for Lobby
    socket.on('get_lobby_rooms', (callback) => {
      const list = [];
      for (const [id, r] of activeRooms.entries()) {
        const activeCount = r.players.filter(p => p !== null).length;
        list.push({
          id: r.id,
          hostName: r.hostName,
          mode: r.mode,
          ante: r.ante,
          playerCount: activeCount,
          maxPlayers: r.maxPlayers,
          phase: r.phase,
          pot: r.pot
        });
      }
      callback?.({ success: true, rooms: list });
    });

    // 6. Leave / Disconnect
    socket.on('leave_room', () => {
      if (currentRoomId && currentUserId) {
        const room = activeRooms.get(currentRoomId);
        if (room) {
          room.removePlayer(currentUserId);
          socket.leave(currentRoomId);
          broadcastRoomState(io, room);
        }
      }
    });

    socket.on('disconnect', () => {
      if (currentRoomId && currentUserId) {
        const room = activeRooms.get(currentRoomId);
        if (room) {
          room.removePlayer(currentUserId);
          broadcastRoomState(io, room);
        }
      }
    });
  });

  return io;
}

/**
 * Broadcasts sanitized state individually to each socket in the room
 */
export function broadcastRoomState(io, room) {
  const roomSockets = io.sockets.adapter.rooms.get(room.id);
  if (!roomSockets) return;

  for (const socketId of roomSockets) {
    const clientSocket = io.sockets.sockets.get(socketId);
    if (!clientSocket) continue;

    // Find the player associated with this socket
    for (const p of room.players) {
      if (p && p.id) {
        const personalizedState = room.getSanitizedState(p.id);
        clientSocket.emit('room_state_update', personalizedState);
      }
    }
  }
}
