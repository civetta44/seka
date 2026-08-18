/**
 * Scalable Vector SVG Card Artworks & Pattern Generators
 * Designed with dynamic gradients, glowing paths, and crisp geometries
 */

export const SuitIcons = {
  spades: `<svg viewBox="0 0 100 100" class="suit-icon"><path fill="currentColor" d="M50 5 C45 25 15 45 15 65 C15 78 28 85 42 78 C44 88 38 95 32 95 L68 95 C62 95 56 88 58 78 C72 85 85 78 85 65 C85 45 55 25 50 5 Z"/></svg>`,
  hearts: `<svg viewBox="0 0 100 100" class="suit-icon"><path fill="#e11d48" d="M50 88 C30 70 10 50 10 32 C10 16 24 10 36 10 C44 10 48 16 50 20 C52 16 56 10 64 10 C76 10 90 16 90 32 C90 50 70 70 50 88 Z"/></svg>`,
  diamonds: `<svg viewBox="0 0 100 100" class="suit-icon"><path fill="#e11d48" d="M50 5 L88 50 L50 95 L12 50 Z"/></svg>`,
  clubs: `<svg viewBox="0 0 100 100" class="suit-icon"><path fill="currentColor" d="M50 10 C40 10 32 18 32 28 C32 36 38 42 44 45 C35 43 20 50 20 63 C20 75 32 82 43 78 C44 88 38 95 32 95 L68 95 C62 95 56 88 57 78 C68 82 80 75 80 63 C80 50 65 43 56 45 C62 42 68 36 68 28 C68 18 60 10 50 10 Z"/></svg>`,
  fire: `<svg viewBox="0 0 100 100" class="suit-icon"><path fill="#f97316" d="M50 5 C60 25 85 40 85 65 C85 85 70 95 50 95 C30 95 15 85 15 65 C15 45 35 35 40 18 C45 30 55 35 55 45 C55 52 48 58 42 58 C38 58 35 55 35 50 C28 62 38 78 50 78 C60 78 68 70 68 58 C68 40 55 25 50 5 Z"/></svg>`,
  water: `<svg viewBox="0 0 100 100" class="suit-icon"><path fill="#38bdf8" d="M50 8 C50 8 20 45 20 68 C20 84 33 94 50 94 C67 94 80 84 80 68 C80 45 50 8 50 8 Z M50 82 C40 82 32 74 32 64 C32 52 45 35 50 28 C55 35 68 52 68 64 C68 74 60 82 50 82 Z"/></svg>`,
  earth: `<svg viewBox="0 0 100 100" class="suit-icon"><path fill="#22c55e" d="M50 8 C30 25 15 50 20 75 C24 90 40 94 50 94 C60 94 76 90 80 75 C85 50 70 25 50 8 Z M50 25 C55 40 65 55 65 70 C65 78 58 84 50 84 C42 84 35 78 35 70 C35 55 45 40 50 25 Z"/></svg>`,
  air: `<svg viewBox="0 0 100 100" class="suit-icon"><path fill="#eab308" d="M55 5 L20 52 L48 52 L35 95 L80 44 L50 44 Z"/></svg>`,
  void: `<svg viewBox="0 0 100 100" class="suit-icon"><path fill="#c084fc" d="M50 5 L62 38 L95 50 L62 62 L50 95 L38 62 L5 50 L38 38 Z"/></svg>`
};

export const CardIllustrations = {
  dragon: `
    <svg viewBox="0 0 300 240" class="card-art-svg">
      <defs>
        <radialGradient id="dragon-bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#b91c1c" />
          <stop offset="50%" stop-color="#450a0a" />
          <stop offset="100%" stop-color="#090505" />
        </radialGradient>
        <linearGradient id="dragon-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="50%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#78350f" />
        </linearGradient>
      </defs>
      <rect width="300" height="240" fill="url(#dragon-bg)" />
      <!-- Dragon Silhouette & Fire -->
      <path d="M150 30 C170 50 210 60 250 40 C230 80 200 95 185 110 C210 115 240 105 260 90 C240 130 190 145 165 150 C180 165 210 170 230 160 C200 190 150 185 130 170 C100 195 50 180 30 150 C70 155 105 135 115 110 C85 115 60 100 40 80 C80 85 110 65 125 40 Z" fill="#ef4444" opacity="0.6"/>
      <!-- Horns & Head -->
      <path d="M150 45 L175 75 L160 85 L180 105 L150 115 L120 105 L140 85 L125 75 Z" fill="url(#dragon-gold)"/>
      <circle cx="140" cy="85" r="4" fill="#fff" />
      <circle cx="160" cy="85" r="4" fill="#fff" />
      <path d="M110 35 Q135 55 145 65" stroke="#fef08a" stroke-width="4" fill="none"/>
      <path d="M190 35 Q165 55 155 65" stroke="#fef08a" stroke-width="4" fill="none"/>
      <!-- Embers & Sparks -->
      <circle cx="90" cy="60" r="3" fill="#fef08a" opacity="0.8"/>
      <circle cx="210" cy="70" r="2" fill="#f97316" opacity="0.9"/>
      <circle cx="70" cy="120" r="2.5" fill="#fef08a" opacity="0.7"/>
      <circle cx="230" cy="130" r="3.5" fill="#ef4444" opacity="0.8"/>
    </svg>
  `,

  archmage: `
    <svg viewBox="0 0 300 240" class="card-art-svg">
      <defs>
        <radialGradient id="mage-bg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#4c1d95" />
          <stop offset="60%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#090514" />
        </radialGradient>
        <linearGradient id="arcane-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f472b6" />
          <stop offset="50%" stop-color="#c084fc" />
          <stop offset="100%" stop-color="#60a5fa" />
        </linearGradient>
      </defs>
      <rect width="300" height="240" fill="url(#mage-bg)" />
      <!-- Magic Circles & Runes -->
      <circle cx="150" cy="110" r="65" stroke="url(#arcane-glow)" stroke-width="2" fill="none" stroke-dasharray="8 4" opacity="0.7"/>
      <circle cx="150" cy="110" r="45" stroke="#e879f9" stroke-width="1.5" fill="none" opacity="0.8"/>
      <polygon points="150,55 195,135 105,135" stroke="url(#arcane-glow)" stroke-width="2" fill="none" opacity="0.6"/>
      <polygon points="150,165 195,85 105,85" stroke="url(#arcane-glow)" stroke-width="2" fill="none" opacity="0.6"/>
      <!-- Hood & Orb -->
      <path d="M150 70 C130 70 115 95 115 130 C125 155 175 155 185 130 C185 95 170 70 150 70 Z" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
      <circle cx="150" cy="125" r="14" fill="url(#arcane-glow)" filter="drop-shadow(0 0 10px #c084fc)"/>
    </svg>
  `,

  paladin: `
    <svg viewBox="0 0 300 240" class="card-art-svg">
      <defs>
        <radialGradient id="paladin-bg" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ca8a04" />
          <stop offset="50%" stop-color="#422006" />
          <stop offset="100%" stop-color="#0b0804" />
        </radialGradient>
      </defs>
      <rect width="300" height="240" fill="url(#paladin-bg)" />
      <!-- Knight Helmet & Radiant Sunburst -->
      <g transform="translate(150,110)">
        <circle cx="0" cy="0" r="70" stroke="#fef08a" stroke-width="1.5" fill="none" stroke-dasharray="4 6" opacity="0.5"/>
        <!-- Rays -->
        <line x1="0" y1="-80" x2="0" y2="-65" stroke="#fef08a" stroke-width="3"/>
        <line x1="0" y1="80" x2="0" y2="65" stroke="#fef08a" stroke-width="3"/>
        <line x1="-80" y1="0" x2="-65" y2="0" stroke="#fef08a" stroke-width="3"/>
        <line x1="80" y1="0" x2="65" y2="0" stroke="#fef08a" stroke-width="3"/>
        <!-- Great Helm -->
        <path d="M-30 -35 C-30 -55 30 -55 30 -35 L25 25 L0 45 L-25 25 Z" fill="#e2e8f0" stroke="#ffd700" stroke-width="3"/>
        <path d="M-20 -15 L20 -15 M0 -35 L0 30" stroke="#ffd700" stroke-width="4"/>
      </g>
    </svg>
  `,

  cyber_ninja: `
    <svg viewBox="0 0 300 240" class="card-art-svg">
      <defs>
        <radialGradient id="cyber-bg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#083344" />
          <stop offset="60%" stop-color="#020617" />
          <stop offset="100%" stop-color="#000000" />
        </radialGradient>
      </defs>
      <rect width="300" height="240" fill="url(#cyber-bg)" />
      <!-- Hex Grid Lines -->
      <path d="M20 20 L280 20 M20 60 L280 60 M20 100 L280 100 M20 140 L280 140 M20 180 L280 180 M20 220 L280 220" stroke="#00f0ff" stroke-width="0.5" opacity="0.2"/>
      <!-- Cyber Visor & Katana Glow -->
      <g transform="translate(150,115)">
        <polygon points="-40,-20 40,-20 30,35 -30,35" fill="#0f172a" stroke="#ff007f" stroke-width="2"/>
        <line x1="-30" y1="-5" x2="30" y2="-5" stroke="#00f0ff" stroke-width="6" stroke-linecap="round" filter="drop-shadow(0 0 6px #00f0ff)"/>
        <path d="M-70 50 L60 -60" stroke="#00f0ff" stroke-width="3" filter="drop-shadow(0 0 8px #00f0ff)"/>
      </g>
    </svg>
  `,

  shield: `
    <svg viewBox="0 0 300 240" class="card-art-svg">
      <defs>
        <radialGradient id="shield-bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#1e3a8a" />
          <stop offset="100%" stop-color="#050a17" />
        </radialGradient>
      </defs>
      <rect width="300" height="240" fill="url(#shield-bg)" />
      <g transform="translate(150,115)">
        <path d="M-45 -55 L45 -55 C45 -55 50 15 0 60 C-50 15 -45 -55 -45 -55 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="4"/>
        <path d="M-30 -40 L30 -40 C30 -40 35 10 0 45 C-35 10 -30 -40 -30 -40 Z" fill="none" stroke="#ffd700" stroke-width="2"/>
        <circle cx="0" cy="-5" r="14" fill="#38bdf8" filter="drop-shadow(0 0 8px #38bdf8)"/>
      </g>
    </svg>
  `,

  lightning: `
    <svg viewBox="0 0 300 240" class="card-art-svg">
      <defs>
        <radialGradient id="storm-bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#713f12" />
          <stop offset="100%" stop-color="#0c0702" />
        </radialGradient>
      </defs>
      <rect width="300" height="240" fill="url(#storm-bg)" />
      <g transform="translate(150,110)">
        <polygon points="10,-70 -30,0 5,0 -15,70 35,-5 2,-5" fill="#facc15" stroke="#fef08a" stroke-width="3" filter="drop-shadow(0 0 12px #facc15)"/>
      </g>
    </svg>
  `,

  classic_king: `
    <svg viewBox="0 0 200 240" class="classic-face-art-svg">
      <rect width="200" height="240" fill="#fdfaf3" />
      <g transform="translate(100, 120)">
        <!-- King Crown -->
        <path d="M-40 -40 L-30 -15 L0 -30 L30 -15 L40 -40 L30 10 L-30 10 Z" fill="#d4af37" stroke="#854d0e" stroke-width="2"/>
        <!-- King Face/Beard -->
        <circle cx="0" cy="20" r="28" fill="#fcd34d" stroke="#b45309" stroke-width="2"/>
        <path d="M-20 20 C-20 45 20 45 20 20 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
        <!-- Robe -->
        <path d="M-50 45 L50 45 L40 90 L-40 90 Z" fill="#1e3a8a" stroke="#d4af37" stroke-width="2"/>
        <line x1="-30" y1="50" x2="30" y2="50" stroke="#d4af37" stroke-width="3"/>
      </g>
    </svg>
  `,

  classic_queen: `
    <svg viewBox="0 0 200 240" class="classic-face-art-svg">
      <rect width="200" height="240" fill="#fdfaf3" />
      <g transform="translate(100, 120)">
        <path d="M-35 -35 L-20 -15 L0 -40 L20 -15 L35 -35 L25 15 L-25 15 Z" fill="#d4af37" stroke="#b45309" stroke-width="2"/>
        <circle cx="0" cy="22" r="24" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>
        <path d="M-45 45 L45 45 L35 90 L-35 90 Z" fill="#991b1b" stroke="#d4af37" stroke-width="2"/>
      </g>
    </svg>
  `,

  classic_ace: `
    <svg viewBox="0 0 200 240" class="classic-face-art-svg">
      <rect width="200" height="240" fill="#fdfaf3" />
      <g transform="translate(100, 120)">
        <circle cx="0" cy="0" r="60" stroke="#d4af37" stroke-width="2" fill="none" stroke-dasharray="4 4"/>
        <path d="M0 -35 C-5 -15 -35 5 -35 25 C-35 38 -22 45 -8 38 C-6 48 -12 55 -18 55 L18 55 C12 55 6 48 8 38 C22 45 35 38 35 25 C35 5 5 -15 0 -35 Z" fill="#111827"/>
      </g>
    </svg>
  `
};

export const CardBackSVGs = {
  'celtic-mandala': `
    <svg viewBox="0 0 240 336" class="card-back-svg">
      <defs>
        <radialGradient id="back-celtic-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#020617" />
        </radialGradient>
      </defs>
      <rect width="240" height="336" fill="url(#back-celtic-bg)"/>
      <g transform="translate(120, 168)" stroke="#d4af37" fill="none">
        <circle cx="0" cy="0" r="75" stroke-width="2" stroke-dasharray="3 3"/>
        <circle cx="0" cy="0" r="60" stroke-width="3"/>
        <circle cx="0" cy="0" r="45" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="30" stroke-width="2"/>
        <!-- Star / Mandala spokes -->
        <polygon points="0,-60 42,-42 60,0 42,42 0,60 -42,42 -60,0 -42,-42" stroke-width="2"/>
        <polygon points="0,-45 32,-32 45,0 32,32 0,45 -32,32 -45,0 -32,-32" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="10" fill="#d4af37"/>
      </g>
    </svg>
  `,

  'casino-filigree': `
    <svg viewBox="0 0 240 336" class="card-back-svg">
      <defs>
        <radialGradient id="back-casino-bg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#991b1b" />
          <stop offset="100%" stop-color="#450a0a" />
        </radialGradient>
      </defs>
      <rect width="240" height="336" fill="url(#back-casino-bg)"/>
      <!-- Diamond Filigree Grid -->
      <g stroke="#ffd700" stroke-width="1" fill="none" opacity="0.4">
        <pattern id="casino-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10 0 L20 10 L10 20 L0 10 Z"/>
        </pattern>
        <rect width="240" height="336" fill="url(#casino-grid)"/>
      </g>
      <g transform="translate(120, 168)">
        <circle cx="0" cy="0" r="45" fill="#450a0a" stroke="#ffd700" stroke-width="3"/>
        <polygon points="0,-25 18,-5 12,20 -12,20 -18,-5" fill="#ffd700"/>
      </g>
    </svg>
  `,

  'cyber-matrix': `
    <svg viewBox="0 0 240 336" class="card-back-svg">
      <defs>
        <radialGradient id="back-cyber-bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#083344" />
          <stop offset="100%" stop-color="#020617" />
        </radialGradient>
      </defs>
      <rect width="240" height="336" fill="url(#back-cyber-bg)"/>
      <g stroke="#00f0ff" fill="none" opacity="0.6">
        <circle cx="120" cy="168" r="50" stroke-width="2"/>
        <circle cx="120" cy="168" r="30" stroke-width="1" stroke-dasharray="6 3"/>
        <path d="M120 30 L120 138 M120 198 L120 306 M30 168 L90 168 M150 168 L210 168" stroke-width="2"/>
        <polygon points="120,150 135,168 120,186 105,168" fill="#00f0ff"/>
      </g>
    </svg>
  `,

  'diamond-lattice': `
    <svg viewBox="0 0 240 336" class="card-back-svg">
      <rect width="240" height="336" fill="#171717"/>
      <g stroke="#e6b800" stroke-width="1.5" fill="none" opacity="0.6">
        <pattern id="lattice-grid" width="24" height="36" patternUnits="userSpaceOnUse">
          <path d="M12 0 L24 18 L12 36 L0 18 Z"/>
        </pattern>
        <rect width="240" height="336" fill="url(#lattice-grid)"/>
      </g>
      <g transform="translate(120, 168)">
        <polygon points="0,-40 30,0 0,40 -30,0" fill="#171717" stroke="#e6b800" stroke-width="3"/>
        <circle cx="0" cy="0" r="10" fill="#e6b800"/>
      </g>
    </svg>
  `,

  'starfield-sigil': `
    <svg viewBox="0 0 240 336" class="card-back-svg">
      <rect width="240" height="336" fill="#0b0f19"/>
      <g transform="translate(120, 168)" stroke="#a855f7" fill="none">
        <circle cx="0" cy="0" r="65" stroke-width="2" opacity="0.6"/>
        <polygon points="0,-60 18,-18 60,0 18,18 0,60 -18,18 -60,0 -18,-18" stroke-width="2" fill="rgba(168,85,247,0.15)"/>
        <circle cx="0" cy="0" r="12" fill="#c084fc"/>
      </g>
    </svg>
  `
};
