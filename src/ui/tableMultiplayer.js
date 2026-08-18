import { socketClient } from '../api/socketClient.js';
import { createCardElement } from '../cards/cardRenderer.js';
import { triggerHaptic } from '../tma/telegramAdapter.js';
import confetti from 'canvas-confetti';

export class TableMultiplayer {
  constructor(mountEl, user, roomId, { onLeaveRoom }) {
    this.mountEl = mountEl;
    this.user = user;
    this.roomId = roomId;
    this.onLeaveRoom = onLeaveRoom;
    this.currentRaiseAmt = 10;
    this.state = null;

    this.render();
    this.initSocketEvents();
  }

  async initSocketEvents() {
    socketClient.onRoomUpdate((state) => {
      this.state = state;
      this.updateTableUI();
    });

    try {
      await socketClient.joinRoom({ roomId: this.roomId, user: this.user });
    } catch (err) {
      alert(err.message);
      this.onLeaveRoom();
    }
  }

  render() {
    this.mountEl.innerHTML = `
      <div class="multiplayer-table-container" style="display: flex; flex-direction: column; height: 100%; position: relative;">
        
        <!-- Stol Yuqori Paneli -->
        <div class="game-top-bar">
          <div style="display: flex; align-items: center; gap: 6px;">
            <button id="btn-table-leave" class="btn-reset-match">🚪 Chiqish</button>
            <span style="font-weight: 700; font-size: 11px; color: var(--gold-bright);">#${this.roomId}</span>
          </div>
          <div style="display: flex; gap: 4px;">
            <button id="btn-table-invite" class="btn-sm" style="background: rgba(88, 166, 255, 0.2); border-color: #58a6ff; color: #58a6ff; width: auto; padding: 3px 8px;">
              🔗 Do'stlarni Taklif Qilish
            </button>
          </div>
        </div>

        <!-- 10-Kishilik Kazino Oval Stoli -->
        <div class="seka-table" style="flex: 1; margin: 6px 10px; border-radius: 36px; display: flex; flex-direction: column; justify-content: space-between;">
          <div class="table-felt-pattern"></div>

          <!-- Raqiblar O'rindiqlari (Tepadagi o'yinchilar) -->
          <div id="opponents-seating-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; z-index: 2;">
            <!-- Dinamik chiziladi -->
          </div>

          <!-- Stol Markazi (Bank, Status, Svara) -->
          <div class="table-center-hub" style="margin: 4px 0;">
            <div class="pot-display-pill">
              <span class="pot-icon">🪙</span>
              <span class="pot-amount" id="mp-pot-val">BANK: 0</span>
            </div>
            <div class="svara-banner" id="mp-svara-banner" style="display: none;">
              ⚡ SVARA DURANG! BANK KEYINGI RAUNDGA O'TDI ⚡
            </div>
            <div class="round-status-message" id="mp-status-msg" style="font-size: 10.5px;">
              Stolga ulanmoqda...
            </div>
          </div>

          <!-- O'zingizning Hududingiz (Pastda) -->
          <div class="human-player-zone" style="z-index: 2;">
            <div class="cards-row" id="mp-self-cards-row" style="margin-bottom: 4px;">
              <!-- Mening Kartalarim -->
            </div>
            <div class="player-score-hud" id="mp-self-score-hud">
              <span class="score-suit-badge" id="mp-hud-suit-name">Tarqatish kutilmoqda</span>
              <span class="score-points-counter" id="mp-hud-points-val">0 BALL</span>
            </div>
            <div class="player-identity-bar" style="margin-top: 2px;">
              <span class="player-avatar">👤</span>
              <span class="player-name">${this.user.firstName} (Siz)</span>
              <span class="player-chips-badge">💰 <span id="mp-self-chips-val">1000</span></span>
            </div>
          </div>

        </div>

        <!-- Amallar Paneli -->
        <div class="game-action-bar">
          <!-- Tezkor Oshirish Qiymatlari -->
          <div class="quick-raise-pills" id="mp-raise-pills">
            <button class="pill-amt active" data-amt="10">+10</button>
            <button class="pill-amt" data-amt="25">+25</button>
            <button class="pill-amt" data-amt="50">+50</button>
            <button class="pill-amt" data-amt="100">+100</button>
          </div>

          <!-- Asosiy Tugmalar -->
          <div class="main-actions-row">
            <button class="action-btn btn-fold" id="btn-mp-fold">
              <span>🚫 Pas (Tashlash)</span>
            </button>
            <button class="action-btn btn-check-call" id="btn-mp-check-call">
              <span id="mp-lbl-check-call">Chek</span>
              <span class="btn-sub-label" id="mp-sublbl-check-call">Tekinga</span>
            </button>
            <button class="action-btn btn-raise" id="btn-mp-raise">
              <span>⚡ Oshirish</span>
              <span class="btn-sub-label" id="mp-sublbl-raise">+10</span>
            </button>
            <button class="action-btn btn-deal-next" id="btn-mp-deal" style="display: none;">
              <span>♠️ Raundni Boshlash</span>
            </button>
          </div>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.mountEl.querySelector('#btn-table-leave')?.addEventListener('click', () => {
      triggerHaptic('selection');
      socketClient.leaveRoom();
      this.onLeaveRoom();
    });

    this.mountEl.querySelector('#btn-table-invite')?.addEventListener('click', () => {
      const inviteUrl = `https://t.me/dsnhbgsdchjsdfuyhsdfgbot?start=room_${this.roomId}`;
      triggerHaptic('notification', 'success');

      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent('♠️ Seka / Trinka ko\'p o\'yinchili stolimga qo\'shiling!')}`);
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(inviteUrl);
        alert(`Taklif havolasi nusxalandi:\n${inviteUrl}`);
      } else {
        prompt('Do\'stlaringizga yuborish uchun havola:', inviteUrl);
      }
    });

    this.mountEl.querySelectorAll('#mp-raise-pills .pill-amt').forEach(pill => {
      pill.addEventListener('click', () => {
        this.mountEl.querySelectorAll('#mp-raise-pills .pill-amt').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentRaiseAmt = parseInt(pill.dataset.amt, 10) || 10;
        this.updateButtons();
        triggerHaptic('selection');
      });
    });

    this.mountEl.querySelector('#btn-mp-deal')?.addEventListener('click', async () => {
      triggerHaptic('impact', 'medium');
      try {
        await socketClient.startRound();
      } catch (err) {
        alert(err.message);
      }
    });

    this.mountEl.querySelector('#btn-mp-fold')?.addEventListener('click', () => {
      triggerHaptic('impact', 'light');
      socketClient.playerAction('fold');
    });

    this.mountEl.querySelector('#btn-mp-check-call')?.addEventListener('click', () => {
      triggerHaptic('impact', 'medium');
      const action = this.getMyToCall() > 0 ? 'call' : 'check';
      socketClient.playerAction(action);
    });

    this.mountEl.querySelector('#btn-mp-raise')?.addEventListener('click', () => {
      triggerHaptic('impact', 'heavy');
      socketClient.playerAction('raise', this.currentRaiseAmt);
    });
  }

  getMyPlayer() {
    if (!this.state || !this.state.players) return null;
    return this.state.players.find(p => p && p.id === String(this.user.id));
  }

  getMyToCall() {
    const me = this.getMyPlayer();
    if (!me || !this.state) return 0;
    return Math.max(0, this.state.currentBet - (me.currentBet || 0));
  }

  updateTableUI() {
    if (!this.state) return;
    const s = this.state;
    const me = this.getMyPlayer();

    this.mountEl.querySelector('#mp-pot-val').textContent = `BANK: ${s.pot}`;
    this.mountEl.querySelector('#mp-svara-banner').style.display = s.isSvara ? 'block' : 'none';
    this.mountEl.querySelector('#mp-status-msg').textContent = s.roundMessage;

    if (me) {
      this.mountEl.querySelector('#mp-self-chips-val').textContent = me.chips;
      if (me.score && me.cards.length > 0) {
        this.mountEl.querySelector('#mp-hud-suit-name').textContent = me.score.combinationName;
        this.mountEl.querySelector('#mp-hud-points-val').textContent = `${me.score.score} BALL`;
      } else {
        this.mountEl.querySelector('#mp-hud-suit-name').textContent = 'Qo\'lda';
        this.mountEl.querySelector('#mp-hud-points-val').textContent = '0 BALL';
      }

      const selfCardsRow = this.mountEl.querySelector('#mp-self-cards-row');
      selfCardsRow.innerHTML = '';
      me.cards.forEach(card => {
        const isWinningCard = me.score?.bestCardIds?.includes(card.id);
        const cardEl = createCardElement(card, { isHighlighted: isWinningCard });
        selfCardsRow.appendChild(cardEl);
      });
    }

    const opponentsGrid = this.mountEl.querySelector('#opponents-seating-grid');
    opponentsGrid.innerHTML = '';

    const otherPlayers = s.players.filter(p => p && p.id !== String(this.user.id));
    otherPlayers.forEach((opp) => {
      const isOppTurn = s.currentTurnPlayerId === opp.id;
      const isShowdown = s.phase === 'showdown' || s.phase === 'round_over';

      const oppEl = document.createElement('div');
      oppEl.style.display = 'flex';
      oppEl.style.flexDirection = 'column';
      oppEl.style.alignItems = 'center';
      oppEl.style.gap = '2px';
      oppEl.style.opacity = opp.folded ? '0.4' : '1';

      oppEl.innerHTML = `
        <div class="player-identity-bar" style="padding: 2px 8px; font-size: 10px; ${isOppTurn ? 'border: 2px solid var(--gold-pure); box-shadow: 0 0 10px rgba(255,215,0,0.6);' : ''}">
          <span>${opp.isHost ? '👑' : '👤'} ${opp.name}</span>
          <span style="color: var(--gold-bright);">💰${opp.chips}</span>
        </div>
        <div class="cards-row" style="gap: 2px; min-height: 48px; transform: scale(0.65); transform-origin: top center;">
          <!-- Raqib kartalari -->
        </div>
        ${(isShowdown && opp.score) ? `
          <span class="bot-score-badge" style="font-size: 9px; padding: 1px 4px;">
            ${opp.score.score} BALL
          </span>
        ` : ''}
      `;

      const oppCardsRow = oppEl.querySelector('.cards-row');
      opp.cards.forEach(c => {
        const isWin = isShowdown && opp.score?.bestCardIds?.includes(c.id);
        const cEl = createCardElement(c, { isHighlighted: isWin });
        oppCardsRow.appendChild(cEl);
      });

      opponentsGrid.appendChild(oppEl);
    });

    if (s.phase === 'showdown' || s.phase === 'round_over') {
      if (s.roundWinner === me?.name) {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }

    this.updateButtons();
  }

  updateButtons() {
    if (!this.state) return;
    const s = this.state;
    const me = this.getMyPlayer();
    const isMyTurn = s.currentTurnPlayerId === String(this.user.id) && s.phase === 'betting';
    const isHost = me?.isHost;
    const canDeal = isHost && (s.phase === 'lobby' || s.phase === 'round_over' || s.phase === 'showdown');

    const dealBtn = this.mountEl.querySelector('#btn-mp-deal');
    const foldBtn = this.mountEl.querySelector('#btn-mp-fold');
    const checkCallBtn = this.mountEl.querySelector('#btn-mp-check-call');
    const raiseBtn = this.mountEl.querySelector('#btn-mp-raise');
    const pills = this.mountEl.querySelector('#mp-raise-pills');

    dealBtn.style.display = canDeal ? 'flex' : 'none';
    foldBtn.style.display = isMyTurn ? 'flex' : 'none';
    checkCallBtn.style.display = isMyTurn ? 'flex' : 'none';
    raiseBtn.style.display = isMyTurn ? 'flex' : 'none';
    pills.style.display = isMyTurn ? 'flex' : 'none';

    if (isMyTurn) {
      const toCall = this.getMyToCall();
      const lbl = this.mountEl.querySelector('#mp-lbl-check-call');
      const sublbl = this.mountEl.querySelector('#mp-sublbl-check-call');
      const sublblRaise = this.mountEl.querySelector('#mp-sublbl-raise');

      if (toCall > 0) {
        lbl.textContent = `Tenglash (${toCall})`;
        sublbl.textContent = 'Moslash';
      } else {
        lbl.textContent = 'Chek';
        sublbl.textContent = 'Tekinga';
      }

      sublblRaise.textContent = `+${this.currentRaiseAmt}`;
      raiseBtn.disabled = (me?.chips || 0) < (toCall + this.currentRaiseAmt);
    }
  }
}
