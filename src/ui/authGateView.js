import { AuthApi } from '../api/authApi.js';
import { triggerHaptic } from '../tma/telegramAdapter.js';

export class AuthGateView {
  constructor(mountEl, user, onApproved) {
    this.mountEl = mountEl;
    this.user = user;
    this.onApproved = onApproved;
    this.render();
  }

  render() {
    this.mountEl.innerHTML = `
      <div class="auth-gate-container">
        <div class="auth-gate-icon">⏳</div>
        <div class="auth-gate-title">Kirish So'rovi Kutilmoqda</div>
        <p class="auth-gate-desc">
          Seka / Trinka Online — yopiq multiplayer klub. Sizning ruxsat so'rovingiz klub administratoriga yuborildi.
        </p>
        <div class="auth-gate-user-badge">
          <div>👤 <b>${this.user.firstName}</b></div>
          <div style="color: var(--tg-theme-hint-color); font-size: 11px; margin-top: 4px;">ID: ${this.user.id}</div>
        </div>
        <button id="btn-recheck-auth" class="action-btn btn-deal-next" style="width: 220px; margin-top: 8px;">
          <span>🔄 Holatni Tekshirish</span>
        </button>
      </div>
    `;

    const checkBtn = this.mountEl.querySelector('#btn-recheck-auth');
    checkBtn.addEventListener('click', async () => {
      triggerHaptic('selection');
      checkBtn.innerHTML = '<span>Tekshirilmoqda...</span>';
      const authRes = await AuthApi.checkStatus(this.user);
      if (authRes.status === 'approved' || authRes.isAdmin) {
        triggerHaptic('notification', 'success');
        this.onApproved(authRes.user || this.user);
      } else {
        triggerHaptic('notification', 'warning');
        checkBtn.innerHTML = '<span>⏳ Hali kutilmoqda</span>';
        setTimeout(() => {
          checkBtn.innerHTML = '<span>🔄 Holatni Tekshirish</span>';
        }, 1500);
      }
    });
  }
}
