import { CARD_PRESETS } from '../cards/cardPresets.js';
import { renderCardDOM } from '../cards/cardRenderer.js';
import { CardType } from '../cards/cardModel.js';
import { triggerHaptic } from '../tma/telegramAdapter.js';

export class GalleryViewer {
  constructor(gridId, onCardSelect) {
    this.gridEl = document.getElementById(gridId);
    this.onCardSelect = onCardSelect;
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.cards = [...CARD_PRESETS];

    this.initFilters();
    this.render();
  }

  addCard(card) {
    this.cards.unshift(card);
    this.render();
  }

  initFilters() {
    const pills = document.querySelectorAll('#gallery-category-filter .pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentCategory = pill.dataset.category;
        triggerHaptic('selection');
        this.render();
      });
    });

    const searchInput = document.getElementById('gallery-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }
  }

  getFilteredCards() {
    return this.cards.filter(card => {
      // Category filter
      if (this.currentCategory === 'fantasy' && card.type === CardType.CLASSIC) return false;
      if (this.currentCategory === 'classic' && card.type !== CardType.CLASSIC) return false;
      if (this.currentCategory === 'cyber' && card.theme !== 'cyber-neon') return false;

      // Search filter
      if (this.searchQuery) {
        const matchName = card.name.toLowerCase().includes(this.searchQuery);
        const matchDesc = card.description.toLowerCase().includes(this.searchQuery);
        const matchElement = card.element.toLowerCase().includes(this.searchQuery);
        return matchName || matchDesc || matchElement;
      }

      return true;
    });
  }

  render() {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = '';

    const filtered = this.getFilteredCards();

    if (filtered.length === 0) {
      this.gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--tg-theme-hint-color);">
          No cards found matching your search.
        </div>
      `;
      return;
    }

    filtered.forEach(card => {
      const itemEl = document.createElement('div');
      itemEl.className = 'gallery-item';

      const mountEl = document.createElement('div');
      mountEl.className = 'card-mount';

      const miniCard = renderCardDOM(card, {
        interactive: false,
        initialFlipped: false
      });
      mountEl.appendChild(miniCard);

      const nameEl = document.createElement('div');
      nameEl.className = 'gallery-item-name';
      nameEl.textContent = card.name;

      itemEl.appendChild(mountEl);
      itemEl.appendChild(nameEl);

      itemEl.addEventListener('click', () => {
        triggerHaptic('impact', 'medium');
        if (this.onCardSelect) {
          this.onCardSelect(card);
        }
      });

      this.gridEl.appendChild(itemEl);
    });
  }
}
