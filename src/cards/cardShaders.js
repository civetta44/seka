import { triggerHaptic } from '../tma/telegramAdapter.js';

/**
 * Attaches 3D dynamic tilt, specular lighting & holographic refraction to a card DOM element.
 * @param {HTMLElement} wrapper - Card wrapper
 * @param {HTMLElement} card3D - Flippable 3D card element
 */
export function attachCardPhysics(wrapper, card3D) {
  let bounds = null;
  let isHovered = false;

  function updateBounds() {
    bounds = wrapper.getBoundingClientRect();
  }

  function handlePointerMove(e) {
    if (!bounds) updateBounds();
    if (!bounds || bounds.width === 0) return;

    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : null);
    if (clientX === null || clientY === null) return;

    const mouseX = clientX - bounds.left;
    const mouseY = clientY - bounds.top;

    const pctX = Math.min(Math.max(mouseX / bounds.width, 0), 1);
    const pctY = Math.min(Math.max(mouseY / bounds.height, 0), 1);

    // Compute 3D Rotations (Tilt angles)
    const rotateX = (0.5 - pctY) * 26; // max ~ 13 deg
    const rotateY = (pctX - 0.5) * 26;

    // Specular Glare & Holo Rainbow angles
    const glareX = `${(pctX * 100).toFixed(1)}%`;
    const glareY = `${(pctY * 100).toFixed(1)}%`;
    const holoAngle = `${Math.round(Math.atan2(pctY - 0.5, pctX - 0.5) * (180 / Math.PI) + 90)}deg`;
    const holoBgPos = `${(pctX * 100).toFixed(1)}% ${(pctY * 100).toFixed(1)}%`;

    // Apply CSS Variables
    wrapper.style.setProperty('--glare-x', glareX);
    wrapper.style.setProperty('--glare-y', glareY);
    wrapper.style.setProperty('--holo-angle', holoAngle);
    wrapper.style.setProperty('--holo-bg-pos', holoBgPos);
    wrapper.style.setProperty('--glare-opacity', '0.45');
    wrapper.style.setProperty('--holo-opacity', '0.6');

    // If card is flipped, invert Y-axis rotation
    const isFlipped = card3D.classList.contains('flipped');
    const baseRotY = isFlipped ? 180 : 0;
    const currentRotY = isFlipped ? baseRotY - rotateY : rotateY;

    card3D.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`;
  }

  function handlePointerEnter() {
    isHovered = true;
    updateBounds();
    card3D.style.transition = 'transform 0.1s ease-out';
  }

  function handlePointerLeave() {
    isHovered = false;
    card3D.style.transition = 'transform 0.5s var(--ease-spring)';
    const isFlipped = card3D.classList.contains('flipped');
    card3D.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
    wrapper.style.setProperty('--glare-opacity', '0.15');
    wrapper.style.setProperty('--holo-opacity', '0.35');
  }

  wrapper.addEventListener('mouseenter', handlePointerEnter);
  wrapper.addEventListener('mousemove', handlePointerMove);
  wrapper.addEventListener('mouseleave', handlePointerLeave);

  // Mobile Touch Support
  wrapper.addEventListener('touchstart', (e) => {
    handlePointerEnter();
    handlePointerMove(e);
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    handlePointerMove(e);
  }, { passive: true });

  wrapper.addEventListener('touchend', handlePointerLeave);
}

/**
 * Toggles the flip state of a card with haptic feedback
 */
export function toggleCardFlip(cardWrapper) {
  const card3D = cardWrapper.querySelector('.card-3d');
  if (!card3D) return;

  const isFlipped = card3D.classList.toggle('flipped');
  triggerHaptic('impact', 'light');
  return isFlipped;
}
