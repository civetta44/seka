import { CARD_PRESETS } from '../cards/cardPresets.js';
import { renderCardDOM } from '../cards/cardRenderer.js';
import { triggerHaptic } from '../tma/telegramAdapter.js';
import confetti from 'canvas-confetti';

export class HandViewer {
  constructor(fanContainerId, arenaDropId) {
    this.fanContainer = document.getElementById(fanContainerId);
    this.arenaDrop = document.getElementById(arenaDropId);
    this.handCards = [
      CARD_PRESETS[0], // Inferno Drake
      CARD_PRESETS[1], // Arcane Mage
      CARD_PRESETS[2], // Paladin
      CARD_PRESETS[4], // Tempest Bolt
      CARD_PRESETS[6]  // Ace of Spades
    ];
    this.playedCards = [];

    this.initControls();
    this.render();
  }

  addCard(card) {
    if (this.handCards.length >= 8) {
      alert('Hand limit reached! Play or clear cards first.');
      return;
    }
    this.handCards.push({ ...card });
    this.render();
    triggerHaptic('impact', 'light');
  }

  initControls() {
    const drawBtn = document.getElementById('btn-draw-card');
    if (drawBtn) {
      drawBtn.addEventListener('click', () => {
        const randCard = CARD_PRESETS[Math.floor(Math.random() * CARD_PRESETS.length)];
        this.addCard(randCard);
      });
    }

    const shuffleBtn = document.getElementById('btn-shuffle-hand');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => {
        this.handCards.sort(() => Math.random() - 0.5);
        this.render();
        triggerHaptic('impact', 'medium');
      });
    }

    const clearBtn = document.getElementById('btn-clear-hand');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.handCards = [];
        this.playedCards = [];
        this.render();
        this.renderPlayedCards();
        triggerHaptic('selection');
      });
    }
  }

  render() {
    if (!this.fanContainer) return;
    this.fanContainer.innerHTML = '';

    const count = this.handCards.length;
    const centerIndex = (count - 1) / 2;

    this.handCards.forEach((card, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'hand-card-item';

      // Arc Fan Math
      const delta = index - centerIndex;
      const angle = delta * 6.5; // degrees
      const xOffset = delta * 42; // px horizontal spacing
      const yOffset = Math.abs(delta) * 5; // slight curve downwards on wings

      itemEl.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${angle}deg)`;
      itemEl.style.zIndex = index + 1;

      const cardDOM = renderCardDOM(card, {
        interactive: false,
        initialFlipped: false
      });

      itemEl.appendChild(cardDOM);

      // Play card click handler
      itemEl.addEventListener('click', () => {
        this.playCard(index);
      });

      this.fanContainer.appendChild(itemEl);
    });
  }

  playCard(index) {
    if (index < 0 || index >= this.handCards.length) return;

    const played = this.handCards.splice(index, 1)[0];
    this.playedCards.push(played);

    triggerHaptic('impact', 'heavy');

    // Confetti burst for impactful card play
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.4 },
      colors: ['#ffd700', '#ef4444', '#3b82f6', '#00f0ff']
    });

    this.render();
    this.renderPlayedCards();
  }

  renderPlayedCards() {
    if (!this.arenaDrop) return;
    this.arenaDrop.innerHTML = '';

    this.playedCards.slice(-4).forEach(card => {
      const wrap = document.createElement('div');
      wrap.className = 'played-card-wrapper';
      const dom = renderCardDOM(card, { interactive: false });
      wrap.appendChild(dom);
      this.arenaDrop.appendChild(wrap);
    });
  }
}
