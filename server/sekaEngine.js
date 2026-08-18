/**
 * Seka / Trinka (Сека / Трынька) Karta O'yini Dvigateli & Baholash Tizimi
 */

export const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const CARD_VALUES = {
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 10,
  'Q': 10,
  'K': 10,
  'A': 11
};

export const SUIT_NAMES_UZ = {
  hearts: 'Yurak',
  diamonds: 'G\'isht',
  clubs: 'Chillik',
  spades: 'Qarg\'a'
};

export const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

export const SUIT_COLORS = {
  hearts: '#e11d48',
  diamonds: '#e11d48',
  clubs: '#f0f6fc',
  spades: '#f0f6fc'
};

/**
 * 36 talik yangi karta dastasini yaratish
 */
export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${rank}_${suit}`,
        rank,
        suit,
        value: CARD_VALUES[rank],
        symbol: SUIT_SYMBOLS[suit]
      });
    }
  }
  return deck;
}

/**
 * Fisher-Yates aralashtirish algoritmi
 */
export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Seka/Trinka qoidalari bo'yicha qo'lni hisoblash
 * @param {Array} cards - Kartalar massivi [{ rank, suit, value, id }]
 * @returns {Object} { score, combinationName, winningSuit, bestCardIds, isSpecial }
 */
export function evaluateHand(cards) {
  if (!cards || cards.length === 0) {
    return { score: 0, combinationName: 'Bo\'sh qo\'l', winningSuit: null, bestCardIds: [], isSpecial: false };
  }

  const evaluations = [];

  // 1. Bir xil rangdagi (mast) kartalar yig'indisi
  const suitsMap = {};
  for (const card of cards) {
    if (!suitsMap[card.suit]) suitsMap[card.suit] = [];
    suitsMap[card.suit].push(card);
  }

  for (const [suit, suitCards] of Object.entries(suitsMap)) {
    const sum = suitCards.reduce((acc, c) => acc + c.value, 0);
    const suitName = SUIT_NAMES_UZ[suit] || suit;
    evaluations.push({
      type: 'suit',
      score: sum,
      name: `${suitName} (${SUIT_SYMBOLS[suit]})`,
      winningSuit: suit,
      bestCardIds: suitCards.map(c => c.id),
      cardCount: suitCards.length
    });
  }

  // 2. Maxsus kombinatsiya — Ikkita Tuz ("Два Туза") = 22 ball
  const aces = cards.filter(c => c.rank === 'A');
  if (aces.length === 2) {
    evaluations.push({
      type: 'two_aces',
      score: 22,
      name: 'Ikkita Tuz ("Два Туза")',
      winningSuit: null,
      bestCardIds: aces.map(c => c.id),
      cardCount: 2,
      isSpecial: true
    });
  }

  // 3. Maxsus kombinatsiya — Uchlik ("Тройка") & To'rtlik ("Каре")
  const rankMap = {};
  for (const card of cards) {
    if (!rankMap[card.rank]) rankMap[card.rank] = [];
    rankMap[card.rank].push(card);
  }

  for (const [rank, rankCards] of Object.entries(rankMap)) {
    if (rankCards.length === 4) {
      const fourScore = rank === 'A' ? 44 : rankCards.length * CARD_VALUES[rank];
      evaluations.push({
        type: 'four_of_a_kind',
        score: fourScore,
        name: `To'rtlik (${rank} lar - "Каре")`,
        winningSuit: null,
        bestCardIds: rankCards.map(c => c.id),
        cardCount: 4,
        isSpecial: true
      });
    } else if (rankCards.length === 3) {
      const threeScore = rank === 'A' ? 33 : rankCards.length * CARD_VALUES[rank];
      evaluations.push({
        type: 'three_of_a_kind',
        score: threeScore,
        name: `Uchlik (${rank} lar - "Тройка")`,
        winningSuit: null,
        bestCardIds: rankCards.map(c => c.id),
        cardCount: 3,
        isSpecial: true
      });
    }
  }

  // 4. Katta yagona karta (Fallback)
  const highestCard = [...cards].sort((a, b) => b.value - a.value)[0];
  evaluations.push({
    type: 'single_high',
    score: highestCard.value,
    name: `Katta karta: ${highestCard.rank}${highestCard.symbol}`,
    winningSuit: highestCard.suit,
    bestCardIds: [highestCard.id],
    cardCount: 1
  });

  // Eng yuqori ballni tanlash
  evaluations.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if ((b.cardCount || 0) !== (a.cardCount || 0)) return (b.cardCount || 0) - (a.cardCount || 0);
    if (b.isSpecial && !a.isSpecial) return 1;
    return 0;
  });

  const best = evaluations[0];

  return {
    score: best.score,
    combinationName: best.name,
    winningSuit: best.winningSuit,
    bestCardIds: best.bestCardIds,
    isSpecial: !!best.isSpecial,
    type: best.type
  };
}
