/**
 * Card Model & Schema Definition
 */

export const Rarity = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

export const CardType = {
  CREATURE: 'creature',
  SPELL: 'spell',
  ARTIFACT: 'artifact',
  CLASSIC: 'classic'
};

export const ElementSuit = {
  FIRE: 'fire',
  WATER: 'water',
  EARTH: 'earth',
  AIR: 'air',
  VOID: 'void',
  SPADES: 'spades',
  HEARTS: 'hearts',
  DIAMONDS: 'diamonds',
  CLUBS: 'clubs'
};

export const TextureTheme = {
  MYTHIC_FANTASY: 'mythic-fantasy',
  ROYAL_CASINO: 'royal-casino',
  CYBER_NEON: 'cyber-neon',
  OBSIDIAN_GOLD: 'obsidian-gold',
  RETRO_PIXEL: 'retro-pixel'
};

export const CardFinish = {
  HOLOGRAPHIC: 'holographic',
  GOLD_FOIL: 'gold-foil',
  COSMIC_GLITTER: 'cosmic-glitter',
  NONE: 'none'
};

export const BackPattern = {
  CELTIC_MANDALA: 'celtic-mandala',
  CASINO_FILIGREE: 'casino-filigree',
  CYBER_MATRIX: 'cyber-matrix',
  DIAMOND_LATTICE: 'diamond-lattice',
  STARFIELD_SIGIL: 'starfield-sigil'
};

/**
 * Creates a normalized Card Data Object
 */
export function createCard(data = {}) {
  return {
    id: data.id || `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: data.name || 'Mystic Card',
    type: data.type || CardType.CREATURE,
    cost: data.cost ?? 3,
    atk: data.atk ?? 3,
    def: data.def ?? 3,
    element: data.element || ElementSuit.FIRE,
    rarity: data.rarity || Rarity.RARE,
    theme: data.theme || TextureTheme.MYTHIC_FANTASY,
    finish: data.finish || CardFinish.HOLOGRAPHIC,
    backPattern: data.backPattern || BackPattern.CELTIC_MANDALA,
    description: data.description || 'A mysterious card woven with arcane energy.',
    artKey: data.artKey || 'dragon',
    rank: data.rank || null, // For classic cards (A, K, Q, J, 10, etc.)
    suit: data.suit || null  // For classic cards (spades, hearts, etc.)
  };
}
