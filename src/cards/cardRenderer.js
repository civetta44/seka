/**
 * Seka / Trinka 36-Karta Dastasi Uchun 2D Vektorli Karta Rendereri
 */

const SUIT_ICONS_SVG = {
  hearts: `<svg viewBox="0 0 100 100" class="card-suit-svg"><path fill="#e11d48" d="M50 88 C30 70 10 50 10 32 C10 16 24 10 36 10 C44 10 48 16 50 20 C52 16 56 10 64 10 C76 10 90 16 90 32 C90 50 70 70 50 88 Z"/></svg>`,
  diamonds: `<svg viewBox="0 0 100 100" class="card-suit-svg"><path fill="#e11d48" d="M50 5 L90 50 L50 95 L10 50 Z"/></svg>`,
  clubs: `<svg viewBox="0 0 100 100" class="card-suit-svg"><path fill="#1e293b" stroke="#0f172a" stroke-width="2" d="M50 10 C40 10 32 18 32 28 C32 36 38 42 44 45 C35 43 20 50 20 63 C20 75 32 82 43 78 C44 88 38 95 32 95 L68 95 C62 95 56 88 57 78 C68 82 80 75 80 63 C80 50 65 43 56 45 C62 42 68 36 68 28 C68 18 60 10 50 10 Z"/></svg>`,
  spades: `<svg viewBox="0 0 100 100" class="card-suit-svg"><path fill="#1e293b" stroke="#0f172a" stroke-width="2" d="M50 5 C45 25 15 45 15 65 C15 78 28 85 42 78 C44 88 38 95 32 95 L68 95 C62 95 56 88 58 78 C72 85 85 78 85 65 C85 45 55 25 50 5 Z"/></svg>`
};

const ROYAL_PORTRAITS_SVG = {
  A: (suit) => `
    <div class="center-ace-emblem">
      <div class="ace-filigree-ring"></div>
      <div class="ace-main-suit">${SUIT_ICONS_SVG[suit]}</div>
      <span class="ace-label">11 BALL</span>
    </div>
  `,
  K: (suit) => `
    <div class="center-royal-portrait">
      <div class="royal-crown">👑</div>
      <div class="royal-character">QIROL</div>
      <div class="royal-suit-badge">${SUIT_ICONS_SVG[suit]}</div>
      <span class="royal-pts">10 BALL</span>
    </div>
  `,
  Q: (suit) => `
    <div class="center-royal-portrait">
      <div class="royal-crown">👸</div>
      <div class="royal-character">DAMA</div>
      <div class="royal-suit-badge">${SUIT_ICONS_SVG[suit]}</div>
      <span class="royal-pts">10 BALL</span>
    </div>
  `,
  J: (suit) => `
    <div class="center-royal-portrait">
      <div class="royal-crown">⚔️</div>
      <div class="royal-character">VALET</div>
      <div class="royal-suit-badge">${SUIT_ICONS_SVG[suit]}</div>
      <span class="royal-pts">10 BALL</span>
    </div>
  `
};

function getNumericPipsHTML(rank, suit) {
  const count = parseInt(rank, 10);
  let pips = '';
  for (let i = 0; i < count; i++) {
    pips += `<div class="card-pip-item">${SUIT_ICONS_SVG[suit]}</div>`;
  }
  return `<div class="numeric-pips-grid pips-${rank}">${pips}</div><span class="numeric-pts">${count} BALL</span>`;
}

export function createCardElement(card, options = {}) {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const isHidden = card.isHidden || card.id === 'hidden';
  const isHighlighted = options.isHighlighted || false;

  const cardEl = document.createElement('div');
  cardEl.className = `seka-card ${isRed ? 'suit-red' : 'suit-black'} ${isHidden ? 'is-hidden' : ''} ${isHighlighted ? 'highlight-winning-card' : ''}`;
  cardEl.dataset.cardId = card.id;

  const frontFace = document.createElement('div');
  frontFace.className = 'card-face front-face';

  if (!isHidden) {
    const cornerTL = document.createElement('div');
    cornerTL.className = 'card-corner corner-tl';
    cornerTL.innerHTML = `<span class="corner-rank">${card.rank}</span><span class="corner-suit">${SUIT_ICONS_SVG[card.suit]}</span>`;

    const centerArt = document.createElement('div');
    centerArt.className = 'card-center-artwork';
    if (ROYAL_PORTRAITS_SVG[card.rank]) {
      centerArt.innerHTML = ROYAL_PORTRAITS_SVG[card.rank](card.suit);
    } else {
      centerArt.innerHTML = getNumericPipsHTML(card.rank, card.suit);
    }

    const cornerBR = document.createElement('div');
    cornerBR.className = 'card-corner corner-br';
    cornerBR.innerHTML = `<span class="corner-rank">${card.rank}</span><span class="corner-suit">${SUIT_ICONS_SVG[card.suit]}</span>`;

    const goldBorder = document.createElement('div');
    goldBorder.className = 'card-inner-gold-border';

    frontFace.appendChild(goldBorder);
    frontFace.appendChild(cornerTL);
    frontFace.appendChild(centerArt);
    frontFace.appendChild(cornerBR);
  }

  const backFace = document.createElement('div');
  backFace.className = 'card-face back-face';
  backFace.innerHTML = `
    <div class="casino-back-pattern">
      <div class="back-inner-rim"></div>
      <div class="back-central-crest">
        <div class="crest-emblem">♠️</div>
        <span class="crest-title">SEKA</span>
      </div>
    </div>
  `;

  cardEl.appendChild(frontFace);
  cardEl.appendChild(backFace);

  return cardEl;
}
