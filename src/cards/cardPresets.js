import { createCard, Rarity, CardType, ElementSuit, TextureTheme, CardFinish, BackPattern } from './cardModel.js';

export const CARD_PRESETS = [
  // 1. FANTASY RPG / BATTLER
  createCard({
    id: 'preset_inferno_drake',
    name: 'Inferno Drake',
    type: CardType.CREATURE,
    cost: 6,
    atk: 8,
    def: 6,
    element: ElementSuit.FIRE,
    rarity: Rarity.LEGENDARY,
    theme: TextureTheme.MYTHIC_FANTASY,
    finish: CardFinish.HOLOGRAPHIC,
    backPattern: BackPattern.CELTIC_MANDALA,
    description: 'Battlecry: Unleashes a torrent of dragonfire dealing 5 AOE damage to all enemy units.',
    artKey: 'dragon'
  }),

  createCard({
    id: 'preset_arcane_archmage',
    name: 'Arcane Archmage',
    type: CardType.CREATURE,
    cost: 5,
    atk: 5,
    def: 4,
    element: ElementSuit.VOID,
    rarity: Rarity.EPIC,
    theme: TextureTheme.MYTHIC_FANTASY,
    finish: CardFinish.HOLOGRAPHIC,
    backPattern: BackPattern.STARFIELD_SIGIL,
    description: 'Spell Damage +3. Whenever you cast an arcane spell, draw 1 extra card.',
    artKey: 'archmage'
  }),

  createCard({
    id: 'preset_celestial_paladin',
    name: 'Celestial Paladin',
    type: CardType.CREATURE,
    cost: 4,
    atk: 4,
    def: 7,
    element: ElementSuit.AIR,
    rarity: Rarity.LEGENDARY,
    theme: TextureTheme.OBSIDIAN_GOLD,
    finish: CardFinish.GOLD_FOIL,
    backPattern: BackPattern.DIAMOND_LATTICE,
    description: 'Divine Shield & Taunt. Restores 3 Health to your hero at the end of each turn.',
    artKey: 'paladin'
  }),

  createCard({
    id: 'preset_aegis_shield',
    name: 'Aegis of Eternity',
    type: CardType.ARTIFACT,
    cost: 3,
    atk: 0,
    def: 8,
    element: ElementSuit.WATER,
    rarity: Rarity.RARE,
    theme: TextureTheme.MYTHIC_FANTASY,
    finish: CardFinish.COSMIC_GLITTER,
    backPattern: BackPattern.CELTIC_MANDALA,
    description: 'Equip: Absorbs all incoming damage up to 8 points before shattering.',
    artKey: 'shield'
  }),

  createCard({
    id: 'preset_lightning_storm',
    name: 'Tempest Bolt',
    type: CardType.SPELL,
    cost: 2,
    atk: 4,
    def: 0,
    element: ElementSuit.AIR,
    rarity: Rarity.RARE,
    theme: TextureTheme.MYTHIC_FANTASY,
    finish: CardFinish.HOLOGRAPHIC,
    backPattern: BackPattern.STARFIELD_SIGIL,
    description: 'Instant Spell: Stuns target enemy unit for 1 turn and chains to 1 adjacent foe.',
    artKey: 'lightning'
  }),

  // 2. CYBERPUNK / SCI-FI
  createCard({
    id: 'preset_cyber_ninja',
    name: 'Neural Shinobi',
    type: CardType.CREATURE,
    cost: 4,
    atk: 7,
    def: 2,
    element: ElementSuit.VOID,
    rarity: Rarity.EPIC,
    theme: TextureTheme.CYBER_NEON,
    finish: CardFinish.HOLOGRAPHIC,
    backPattern: BackPattern.CYBER_MATRIX,
    description: 'Stealth & Overclock: Bypasses enemy shields directly attacking opposing core.',
    artKey: 'cyber_ninja'
  }),

  // 3. CLASSIC 52-CARD DECK PRESETS
  createCard({
    id: 'preset_ace_spades',
    name: 'Ace of Spades',
    type: CardType.CLASSIC,
    cost: 11,
    rank: 'A',
    suit: 'spades',
    element: ElementSuit.SPADES,
    rarity: Rarity.LEGENDARY,
    theme: TextureTheme.ROYAL_CASINO,
    finish: CardFinish.GOLD_FOIL,
    backPattern: BackPattern.CASINO_FILIGREE,
    description: 'The highest card in royal poker. Unstoppable standard high trump.',
    artKey: 'classic_ace'
  }),

  createCard({
    id: 'preset_king_hearts',
    name: 'King of Hearts',
    type: CardType.CLASSIC,
    cost: 10,
    rank: 'K',
    suit: 'hearts',
    element: ElementSuit.HEARTS,
    rarity: Rarity.EPIC,
    theme: TextureTheme.ROYAL_CASINO,
    finish: CardFinish.GOLD_FOIL,
    backPattern: BackPattern.CASINO_FILIGREE,
    description: 'The Suicide King. Royal majesty with unwavering heart nobility.',
    artKey: 'classic_king'
  }),

  createCard({
    id: 'preset_queen_diamonds',
    name: 'Queen of Diamonds',
    type: CardType.CLASSIC,
    cost: 10,
    rank: 'Q',
    suit: 'diamonds',
    element: ElementSuit.DIAMONDS,
    rarity: Rarity.RARE,
    theme: TextureTheme.ROYAL_CASINO,
    finish: CardFinish.HOLOGRAPHIC,
    backPattern: BackPattern.CASINO_FILIGREE,
    description: 'Radiant Empress of Fortune. Multiplies coin rewards when played.',
    artKey: 'classic_queen'
  }),

  createCard({
    id: 'preset_jack_clubs',
    name: 'Jack of Clubs',
    type: CardType.CLASSIC,
    cost: 10,
    rank: 'J',
    suit: 'clubs',
    element: ElementSuit.CLUBS,
    rarity: Rarity.COMMON,
    theme: TextureTheme.ROYAL_CASINO,
    finish: CardFinish.NONE,
    backPattern: BackPattern.CASINO_FILIGREE,
    description: 'Loyal Vanguard of the Realm. Solid and dependable hand builder.',
    artKey: 'paladin'
  })
];
