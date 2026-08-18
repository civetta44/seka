import { renderCardDOM } from '../cards/cardRenderer.js';
import { toggleCardFlip } from '../cards/cardShaders.js';
import { CARD_PRESETS } from '../cards/cardPresets.js';
import { triggerHaptic } from '../tma/telegramAdapter.js';
import confetti from 'canvas-confetti';

export class CardInspector {
  constructor(mountId, infoMountId) {
    this.mountEl = document.getElementById(mountId);
    this.infoMountEl = document.getElementById(infoMountId);
    this.currentCard = CARD_PRESETS[0];
    this.currentCardWrapper = null;
    this.isFoilEnabled = true;

    this.initControls();
    this.render();
  }

  setCard(card) {
    this.currentCard = { ...card };
    this.render();

    // Trigger subtle celebratory confetti on Legendary card inspections
    if (this.currentCard.rarity === 'legendary') {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.55 },
        colors: ['#ffd700', '#d4af37', '#ffffff']
      });
    }
  }

  render() {
    if (!this.mountEl) return;
    this.mountEl.innerHTML = '';

    // Render DOM
    this.currentCardWrapper = renderCardDOM(this.currentCard, {
      interactive: true,
      initialFlipped: false
    });

    if (!this.isFoilEnabled) {
      this.currentCardWrapper.classList.add('finish-none');
    }

    this.mountEl.appendChild(this.currentCardWrapper);
    this.renderInfoPanel();
    this.syncThemeChips();
  }

  renderInfoPanel() {
    if (!this.infoMountEl) return;
    const card = this.currentCard;

    this.infoMountEl.innerHTML = `
      <div class="card-info-header">
        <span class="info-title">${card.name}</span>
        <span class="info-badge" style="background: rgba(255, 215, 0, 0.15); color: var(--gold-pure); border: 1px solid rgba(255, 215, 0, 0.3);">
          ${card.rarity.toUpperCase()}
        </span>
      </div>
      <div class="info-desc">
        ${card.description}
      </div>
      <div style="display: flex; gap: 12px; font-size: 11px; color: var(--tg-theme-hint-color); margin-top: 4px;">
        <span>Type: <b style="color: #fff;">${card.type}</b></span>
        <span>Theme: <b style="color: #fff;">${card.theme}</b></span>
        <span>Finish: <b style="color: #fff;">${card.finish}</b></span>
      </div>
    `;
  }

  syncThemeChips() {
    const chips = document.querySelectorAll('#theme-chips .chip');
    chips.forEach(chip => {
      if (chip.dataset.theme === this.currentCard.theme) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  initControls() {
    // Flip Button
    const flipBtn = document.getElementById('btn-flip-card');
    if (flipBtn) {
      flipBtn.addEventListener('click', () => {
        if (this.currentCardWrapper) {
          toggleCardFlip(this.currentCardWrapper);
        }
      });
    }

    // Toggle Foil Button
    const foilBtn = document.getElementById('btn-toggle-foil');
    const foilStatus = document.getElementById('foil-status');
    if (foilBtn) {
      foilBtn.addEventListener('click', () => {
        this.isFoilEnabled = !this.isFoilEnabled;
        if (foilStatus) {
          foilStatus.textContent = this.isFoilEnabled ? 'ON' : 'OFF';
        }
        triggerHaptic('selection');
        this.render();
      });
    }

    // Randomize Card Button
    const randBtn = document.getElementById('btn-random-card');
    if (randBtn) {
      randBtn.addEventListener('click', () => {
        const nextCard = CARD_PRESETS[Math.floor(Math.random() * CARD_PRESETS.length)];
        this.setCard(nextCard);
        triggerHaptic('impact', 'medium');
      });
    }

    // Theme Chips
    const chips = document.querySelectorAll('#theme-chips .chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const theme = chip.dataset.theme;
        this.currentCard.theme = theme;
        triggerHaptic('selection');
        this.render();
      });
    });
  }
}
