import { createCard, CardType } from '../cards/cardModel.js';
import { renderCardDOM } from '../cards/cardRenderer.js';
import { triggerHaptic } from '../tma/telegramAdapter.js';
import confetti from 'canvas-confetti';

export class TextureStudio {
  constructor(previewMountId, onCardCreated) {
    this.mountEl = document.getElementById(previewMountId);
    this.onCardCreated = onCardCreated;

    this.cardData = createCard({
      id: 'custom_studio_card',
      name: 'Inferno Drake',
      cost: 6,
      atk: 7,
      def: 5,
      element: 'fire',
      type: CardType.CREATURE,
      rarity: 'legendary',
      theme: 'mythic-fantasy',
      finish: 'holographic',
      backPattern: 'celtic-mandala',
      description: 'Deals 4 fire damage to target enemy and burns surrounding tiles.',
      artKey: 'dragon'
    });

    this.initFormListeners();
    this.render();
  }

  initFormListeners() {
    const inputs = [
      { id: 'studio-theme', key: 'theme' },
      { id: 'studio-back-pattern', key: 'backPattern' },
      { id: 'studio-finish', key: 'finish' },
      { id: 'studio-rarity', key: 'rarity' },
      { id: 'studio-name', key: 'name' },
      { id: 'studio-cost', key: 'cost' },
      { id: 'studio-element', key: 'element' },
      { id: 'studio-type', key: 'type' },
      { id: 'studio-atk', key: 'atk', isNumber: true },
      { id: 'studio-def', key: 'def', isNumber: true },
      { id: 'studio-desc', key: 'description' }
    ];

    inputs.forEach(({ id, key, isNumber }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const updateVal = () => {
        let val = el.value;
        if (isNumber) val = parseInt(val, 10) || 0;
        this.cardData[key] = val;

        // Auto-match artKey based on element/type if applicable
        if (key === 'element') {
          if (val === 'fire') this.cardData.artKey = 'dragon';
          else if (val === 'void') this.cardData.artKey = 'archmage';
          else if (val === 'air') this.cardData.artKey = 'lightning';
          else if (val === 'water') this.cardData.artKey = 'shield';
          else if (val === 'spades') this.cardData.artKey = 'classic_ace';
          else if (val === 'hearts') this.cardData.artKey = 'classic_king';
          else if (val === 'diamonds') this.cardData.artKey = 'classic_queen';
        }

        this.render();
      };

      el.addEventListener('input', updateVal);
      el.addEventListener('change', updateVal);
    });

    // Add to Hand Action
    const createBtn = document.getElementById('btn-create-card');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        const newCard = createCard({
          ...this.cardData,
          id: `custom_${Date.now()}`
        });

        if (this.onCardCreated) {
          this.onCardCreated(newCard);
        }

        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.5 }
        });

        triggerHaptic('notification', 'success');
        alert(`"${newCard.name}" created and added to your Hand! Check the "Play Hand" tab.`);
      });
    }

    // Export Card JSON Action
    const exportBtn = document.getElementById('btn-export-card');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const jsonStr = JSON.stringify(this.cardData, null, 2);
        navigator.clipboard.writeText(jsonStr).then(() => {
          alert('Card JSON copied to clipboard!');
          triggerHaptic('notification', 'success');
        }).catch(() => {
          prompt('Card JSON Configuration:', jsonStr);
        });
      });
    }
  }

  render() {
    if (!this.mountEl) return;
    this.mountEl.innerHTML = '';

    const dom = renderCardDOM(this.cardData, {
      interactive: true,
      initialFlipped: false
    });

    this.mountEl.appendChild(dom);
  }
}
