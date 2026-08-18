import { io } from 'socket.io-client';

export class SocketClient {
  constructor() {
    this.socket = null;
    this.currentRoom = null;
    this.listeners = [];
  }

  connect() {
    if (!this.socket) {
      // Connect to same origin (works on localhost as well as tunnel/production)
      this.socket = io(window.location.origin, {
        transports: ['websocket', 'polling']
      });

      this.socket.on('room_state_update', (state) => {
        this.currentRoom = state;
        this.listeners.forEach(fn => fn(state));
      });
    }
    return this.socket;
  }

  onRoomUpdate(callback) {
    this.listeners.push(callback);
  }

  createRoom({ user, mode = 3, ante = 10, maxPlayers = 10 }) {
    return new Promise((resolve, reject) => {
      this.connect();
      this.socket.emit('create_room', { user, mode, ante, maxPlayers }, (res) => {
        if (res && res.success) {
          resolve(res.roomId);
        } else {
          reject(new Error(res?.error || 'Failed to create room'));
        }
      });
    });
  }

  joinRoom({ roomId, user }) {
    return new Promise((resolve, reject) => {
      this.connect();
      this.socket.emit('join_room', { roomId, user }, (res) => {
        if (res && res.success) {
          resolve(res);
        } else {
          reject(new Error(res?.error || 'Failed to join room'));
        }
      });
    });
  }

  startRound() {
    return new Promise((resolve, reject) => {
      this.socket.emit('start_round', {}, (res) => {
        if (res && res.success) resolve();
        else reject(new Error(res?.error || 'Failed to deal'));
      });
    });
  }

  playerAction(action, amount = 0) {
    return new Promise((resolve, reject) => {
      this.socket.emit('player_action', { action, amount }, (res) => {
        if (res && res.success) resolve();
        else reject(new Error(res?.error || 'Action failed'));
      });
    });
  }

  getLobbyRooms() {
    return new Promise((resolve) => {
      this.connect();
      this.socket.emit('get_lobby_rooms', (res) => {
        resolve(res?.rooms || []);
      });
    });
  }

  leaveRoom() {
    if (this.socket) {
      this.socket.emit('leave_room');
    }
  }
}

export const socketClient = new SocketClient();
