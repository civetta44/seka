import { AuthApi } from './api/authApi.js';
import { TelegramBridge } from './tma/telegramAdapter.js';
import { initPhoneSimulator } from './ui/phoneSimulator.js';
import { AuthGateView } from './ui/authGateView.js';
import { LobbyView } from './ui/lobbyView.js';
import { TableMultiplayer } from './ui/tableMultiplayer.js';
import { AdminDashboard } from './ui/adminDashboard.js';

class AppRouter {
  constructor() {
    this.viewportEl = document.getElementById('phone-viewport');
    this.currentUser = null;
    this.currentView = null;
    this.init();
  }

  async init() {
    TelegramBridge.init();
    initPhoneSimulator();

    // 1. Get User Profile from Telegram / URL
    this.currentUser = AuthApi.getCurrentUser();
    console.log('👤 Authenticating User:', this.currentUser);

    // 2. Check Authorization Status with Server
    const authStatus = await AuthApi.checkStatus(this.currentUser);

    if (authStatus.status === 'approved' || this.currentUser.isAdmin) {
      this.currentUser.chips = authStatus.user?.chips || this.currentUser.chips || 1000;
      this.routeToApprovedView();
    } else {
      this.showAuthGate();
    }
  }

  showAuthGate() {
    this.currentView = new AuthGateView(this.viewportEl, this.currentUser, (approvedUser) => {
      this.currentUser = approvedUser;
      this.routeToApprovedView();
    });
  }

  routeToApprovedView() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const roomId = hashParams.get('room');
    const isAdminView = hashParams.get('admin') === 'true' && this.currentUser.isAdmin;

    if (isAdminView) {
      this.showAdminDashboard();
    } else if (roomId) {
      this.showMultiplayerTable(roomId);
    } else {
      this.showLobby();
    }
  }

  showLobby() {
    window.location.hash = `uid=${this.currentUser.id}&name=${encodeURIComponent(this.currentUser.firstName)}`;
    this.currentView = new LobbyView(this.viewportEl, this.currentUser, {
      onJoinRoom: (roomId) => this.showMultiplayerTable(roomId),
      onOpenAdmin: () => this.showAdminDashboard()
    });
  }

  showMultiplayerTable(roomId) {
    window.location.hash = `room=${roomId}&uid=${this.currentUser.id}&name=${encodeURIComponent(this.currentUser.firstName)}`;
    this.currentView = new TableMultiplayer(this.viewportEl, this.currentUser, roomId, {
      onLeaveRoom: () => this.showLobby()
    });
  }

  showAdminDashboard() {
    window.location.hash = `admin=true&uid=${this.currentUser.id}`;
    this.currentView = new AdminDashboard(this.viewportEl, this.currentUser, () => {
      this.showLobby();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AppRouter();
  console.log('♠️♥️ Seka Multiplayer TMA Online!');
});
