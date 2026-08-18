import { socketClient } from '../api/socketClient.js';
import { triggerHaptic } from '../tma/telegramAdapter.js';

export class LobbyView {
  constructor(mountEl, user, { onJoinRoom, onOpenAdmin }) {
    this.mountEl = mountEl;
    this.user = user;
    this.onJoinRoom = onJoinRoom;
    this.onOpenAdmin = onOpenAdmin;
    this.activeRooms = [];
    this.render();
    this.fetchRooms();
  }

  async fetchRooms() {
    this.activeRooms = await socketClient.getLobbyRooms();
    this.renderRoomList();
  }

  render() {
    this.mountEl.innerHTML = `
      <div class="lobby-container" style="padding: 14px; display: flex; flex-direction: column; gap: 12px; height: 100%; overflow-y: auto;">
        
        <!-- Foydalanuvchi Profili -->
        <div class="player-identity-bar" style="justify-content: space-between; padding: 8px 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">👤</span>
            <div>
              <div style="font-weight: 700; font-size: 13px;">${this.user.firstName}</div>
              <div style="font-size: 10px; color: var(--tg-theme-hint-color);">ID: ${this.user.id}</div>
            </div>
          </div>
          <div class="player-chips-badge" style="font-size: 14px;">
            💰 <span id="lobby-chips-val">${this.user.chips || 1000}</span>
          </div>
        </div>

        <!-- Admin Tugmasi (Faqat Admin uchun) -->
        ${this.user.isAdmin ? `
          <button id="btn-open-admin-panel" class="action-btn" style="background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%); border-color: #6366f1;">
            <span>🛡️ Bosh Admin Boshqaruv Paneli</span>
          </button>
        ` : ''}

        <!-- Asosiy O'yin Amallari -->
        <div style="display: flex; gap: 8px;">
          <button id="btn-open-create-modal" class="action-btn btn-deal-next">
            <span>➕ Xona Yaratish</span>
            <span class="btn-sub-label">10 tagacha o'yinchi</span>
          </button>
          <button id="btn-quick-join" class="action-btn btn-check-call">
            <span>⚡ Tezkor Kirish</span>
            <span class="btn-sub-label">Ochiq stolga qo'shilish</span>
          </button>
        </div>

        <!-- Kod yoki Havola orqali qo'shilish -->
        <div style="display: flex; gap: 6px;">
          <input type="text" id="input-room-code" placeholder="Xona kodi yoki havolani kiriting..." 
            style="flex: 1; background: var(--bg-surface-2); border: 1px solid var(--border-subtle); padding: 8px 12px; border-radius: 8px; font-size: 12px; color: #fff;" />
          <button id="btn-join-code" class="action-btn" style="width: 85px; padding: 0;">
            <span>Kirish</span>
          </button>
        </div>

        <!-- Xona Yaratish Modali -->
        <div id="create-room-modal" style="display: none; background: var(--bg-surface-1); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 12px; flex-direction: column; gap: 10px;">
          <div style="font-weight: 700; font-size: 13px; color: var(--gold-bright);">🎴 Yangi Multiplayer Stol Yaratish</div>
          
          <div class="form-row">
            <div class="form-group col">
              <label>Karta Rejimi</label>
              <select id="select-mode">
                <option value="3">3 ta Karta</option>
                <option value="4">4 ta Karta</option>
              </select>
            </div>
            <div class="form-group col">
              <label>Boshlang'ich Tikish (Ante)</label>
              <select id="select-ante">
                <option value="10">10 Chip</option>
                <option value="25">25 Chip</option>
                <option value="50">50 Chip</option>
                <option value="100">100 Chip</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>O'yinchilar Soni (2 - 10)</label>
            <select id="select-max-players">
              <option value="10">10 O'yinchi (To'liq Stol)</option>
              <option value="6">6 O'yinchi</option>
              <option value="4">4 O'yinchi</option>
              <option value="2">2 O'yinchi (Yakkama-yakka)</option>
            </select>
          </div>

          <div style="display: flex; gap: 6px;">
            <button id="btn-submit-create-room" class="btn-admin-act btn-approve">
              🚀 Stolni Ochish
            </button>
            <button id="btn-cancel-create-room" class="btn-admin-act btn-reject">
              Bekor qilish
            </button>
          </div>
        </div>

        <!-- Faol Stollar Ro'yxati -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
          <span style="font-weight: 700; font-size: 12px; color: var(--gold-bright);">🎲 Faol Stollar</span>
          <button id="btn-refresh-rooms" style="font-size: 11px; color: var(--tg-theme-hint-color);">🔄 Yangilash</button>
        </div>

        <div id="lobby-rooms-list" style="display: flex; flex-direction: column; gap: 6px;">
          <!-- Dinamik to'ldiriladi -->
        </div>

      </div>
    `;

    this.attachEvents();
  }

  renderRoomList() {
    const listEl = this.mountEl.querySelector('#lobby-rooms-list');
    if (!listEl) return;

    if (this.activeRooms.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 30px 10px; color: var(--tg-theme-hint-color); font-size: 12px;">
          Hozirda ochiq stollar yo'q. Birinchi bo'lib stol yarating!
        </div>
      `;
      return;
    }

    listEl.innerHTML = this.activeRooms.map(r => `
      <div class="admin-user-card" style="margin-bottom: 0;">
        <div class="user-card-header">
          <div>
            <div style="font-weight: 700; font-size: 13px;">${r.hostName}'ning Stoli (${r.mode} ta karta)</div>
            <div style="font-size: 10px; color: var(--tg-theme-hint-color);">Ante: ${r.ante} • O'yinchilar: ${r.playerCount}/${r.maxPlayers}</div>
          </div>
          <button class="btn-sm btn-join-room-item" data-id="${r.id}" style="width: auto; padding: 6px 14px; background: var(--tg-theme-button-color);">
            Stolga Kirish
          </button>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.btn-join-room-item').forEach(btn => {
      btn.addEventListener('click', () => {
        triggerHaptic('selection');
        this.onJoinRoom(btn.dataset.id);
      });
    });
  }

  attachEvents() {
    this.mountEl.querySelector('#btn-open-admin-panel')?.addEventListener('click', () => {
      triggerHaptic('selection');
      this.onOpenAdmin();
    });

    const modal = this.mountEl.querySelector('#create-room-modal');
    this.mountEl.querySelector('#btn-open-create-modal')?.addEventListener('click', () => {
      modal.style.display = 'flex';
      triggerHaptic('selection');
    });

    this.mountEl.querySelector('#btn-cancel-create-room')?.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    this.mountEl.querySelector('#btn-submit-create-room')?.addEventListener('click', async () => {
      const mode = parseInt(this.mountEl.querySelector('#select-mode').value, 10);
      const ante = parseInt(this.mountEl.querySelector('#select-ante').value, 10);
      const maxPlayers = parseInt(this.mountEl.querySelector('#select-max-players').value, 10);

      triggerHaptic('impact', 'medium');
      try {
        const roomId = await socketClient.createRoom({
          user: this.user,
          mode,
          ante,
          maxPlayers
        });
        this.onJoinRoom(roomId);
      } catch (err) {
        alert(err.message);
      }
    });

    const joinCodeBtn = this.mountEl.querySelector('#btn-join-code');
    const inputCode = this.mountEl.querySelector('#input-room-code');
    joinCodeBtn?.addEventListener('click', () => {
      let code = inputCode.value.trim();
      if (code) {
        if (code.includes('room=')) code = code.split('room=')[1].split('&')[0];
        if (code.includes('room_')) code = code.split('room_')[1].split('&')[0];
        triggerHaptic('selection');
        this.onJoinRoom(code);
      }
    });

    this.mountEl.querySelector('#btn-refresh-rooms')?.addEventListener('click', () => {
      triggerHaptic('selection');
      this.fetchRooms();
    });

    this.mountEl.querySelector('#btn-quick-join')?.addEventListener('click', () => {
      if (this.activeRooms.length > 0) {
        triggerHaptic('selection');
        this.onJoinRoom(this.activeRooms[0].id);
      } else {
        alert('Ochiq stollar yo\'q. Siz uchun yangi stol yaratamiz!');
        this.mountEl.querySelector('#btn-open-create-modal').click();
      }
    });
  }
}
