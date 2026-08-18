import { AdminApi } from '../api/adminApi.js';
import { triggerHaptic } from '../tma/telegramAdapter.js';
import confetti from 'canvas-confetti';

export class AdminDashboard {
  constructor(mountEl, adminUser, onBack) {
    this.mountEl = mountEl;
    this.adminUser = adminUser;
    this.onBack = onBack;
    this.currentTab = 'pending';
    this.data = { users: [], pending: [], rooms: [] };
    this.loadData();
  }

  async loadData() {
    try {
      const userRes = await AdminApi.getUsers(this.adminUser.id);
      const roomRes = await AdminApi.getActiveRooms(this.adminUser.id);
      this.data.users = userRes.users || [];
      this.data.pending = userRes.pending || [];
      this.data.rooms = roomRes.rooms || [];
      this.render();
    } catch (err) {
      console.error('Admin ma\'lumotlarini yuklashda xatolik:', err);
    }
  }

  render() {
    this.mountEl.innerHTML = `
      <div class="admin-panel-container">
        <!-- Sarlavha -->
        <div class="admin-header">
          <div class="admin-title-badge">
            <span>🛡️</span>
            <span>Admin Boshqaruv Paneli</span>
          </div>
          <button id="btn-admin-close" class="btn-sm" style="width: auto; padding: 4px 10px;">
            🔙 Chiqish
          </button>
        </div>

        <!-- Bo'lim Tablari -->
        <div class="admin-tabs-row">
          <button class="admin-tab-btn ${this.currentTab === 'pending' ? 'active' : ''}" data-tab="pending">
            ⏳ Kutilayotganlar (${this.data.pending.length})
          </button>
          <button class="admin-tab-btn ${this.currentTab === 'users' ? 'active' : ''}" data-tab="users">
            👥 Foydalanuvchilar (${this.data.users.length})
          </button>
          <button class="admin-tab-btn ${this.currentTab === 'rooms' ? 'active' : ''}" data-tab="rooms">
            🎲 O'yinlar (${this.data.rooms.length})
          </button>
        </div>

        <!-- Tab Tarkibi -->
        <div id="admin-tab-content">
          ${this.renderTabContent()}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  renderTabContent() {
    if (this.currentTab === 'pending') {
      if (this.data.pending.length === 0) {
        return `<div style="text-align: center; padding: 40px 10px; color: var(--tg-theme-hint-color);">
          ✅ Kutilayotgan so'rovlar yo'q. Barcha foydalanuvchilar ko'rib chiqilgan!
        </div>`;
      }

      return this.data.pending.map(u => `
        <div class="admin-user-card">
          <div class="user-card-header">
            <div class="user-name-info">
              <span class="user-display-name">${u.firstName} ${u.lastName || ''}</span>
              <span class="user-tg-id">@${u.username || 'username_yoq'} • ID: ${u.id}</span>
            </div>
            <span class="user-status-tag status-pending">Kutilmoqda</span>
          </div>
          <div class="user-card-actions">
            <button class="btn-admin-act btn-approve" data-id="${u.id}">
              ✅ Ruxsat Berish
            </button>
            <button class="btn-admin-act btn-reject" data-id="${u.id}">
              ❌ Rad Etish
            </button>
          </div>
        </div>
      `).join('');
    }

    if (this.currentTab === 'users') {
      return this.data.users.map(u => `
        <div class="admin-user-card">
          <div class="user-card-header">
            <div class="user-name-info">
              <span class="user-display-name">${u.firstName} ${u.lastName || ''} ${u.role === 'admin' ? '👑' : ''}</span>
              <span class="user-tg-id">@${u.username || 'yo\'q'} • ID: ${u.id} • 💰 ${u.chips} chip</span>
            </div>
            <span class="user-status-tag status-${u.isBanned ? 'banned' : u.status}">
              ${u.isBanned ? 'Bloklangan' : (u.status === 'approved' ? 'Tasdiqlangan' : u.status)}
            </span>
          </div>
          <div class="user-card-actions">
            <button class="btn-admin-act btn-chips-edit" data-id="${u.id}" data-chips="${u.chips}">
              💰 Chip Qo'shish
            </button>
            ${u.role !== 'admin' ? `
              <button class="btn-admin-act btn-ban-toggle" data-id="${u.id}">
                ${u.isBanned ? '🟢 Ochish' : '🚫 Bloklash'}
              </button>
            ` : ''}
          </div>
        </div>
      `).join('');
    }

    if (this.currentTab === 'rooms') {
      if (this.data.rooms.length === 0) {
        return `<div style="text-align: center; padding: 40px 10px; color: var(--tg-theme-hint-color);">
          Hozirda jonli multiplayer stollari mavjud emas.
        </div>`;
      }

      return this.data.rooms.map(r => `
        <div class="admin-user-card">
          <div class="user-card-header">
            <div class="user-name-info">
              <span class="user-display-name">Stol #${r.id} (${r.mode} ta karta)</span>
              <span class="user-tg-id">Boshlovchi: ${r.hostName} • O'yinchilar: ${r.playerCount}/${r.maxPlayers}</span>
            </div>
            <span class="user-status-tag status-approved">BANK: ${r.pot}</span>
          </div>
        </div>
      `).join('');
    }
  }

  attachEvents() {
    this.mountEl.querySelector('#btn-admin-close')?.addEventListener('click', () => {
      triggerHaptic('selection');
      this.onBack();
    });

    this.mountEl.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTab = btn.dataset.tab;
        triggerHaptic('selection');
        this.render();
      });
    });

    this.mountEl.querySelectorAll('.btn-approve').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        triggerHaptic('impact', 'medium');
        btn.textContent = 'Tasdiqlanmoqda...';
        await AdminApi.approveUser(this.adminUser.id, id);
        confetti({ particleCount: 25, spread: 60, origin: { y: 0.5 } });
        this.loadData();
      });
    });

    this.mountEl.querySelectorAll('.btn-reject').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        triggerHaptic('impact', 'light');
        btn.textContent = 'Rad etilmoqda...';
        await AdminApi.rejectUser(this.adminUser.id, id);
        this.loadData();
      });
    });

    this.mountEl.querySelectorAll('.btn-chips-edit').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const currentChips = btn.dataset.chips;
        const newAmt = prompt(`Foydalanuvchi ${id} uchun chip miqdorini kiriting:`, currentChips);
        if (newAmt !== null) {
          await AdminApi.setChips(this.adminUser.id, id, newAmt);
          triggerHaptic('notification', 'success');
          this.loadData();
        }
      });
    });

    this.mountEl.querySelectorAll('.btn-ban-toggle').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await AdminApi.toggleBan(this.adminUser.id, id);
        triggerHaptic('notification', 'warning');
        this.loadData();
      });
    });
  }
}
