/**
 * Phone Simulator and Device Preset View Controller
 */

export function initPhoneSimulator() {
  const wrapper = document.getElementById('simulator-wrapper');
  const phoneFrame = document.getElementById('phone-frame');
  const modeButtons = document.querySelectorAll('.btn-mode');
  const deviceSelect = document.getElementById('device-select');

  // Mode Switcher (Mobile Bezel vs Fullscreen Responsive)
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.mode;
      if (mode === 'fullscreen') {
        wrapper.classList.add('fullscreen-mode');
      } else {
        wrapper.classList.remove('fullscreen-mode');
      }
    });
  });

  // Device Size Presets
  const deviceSizes = {
    'iphone-15': { width: '393px', height: '852px' },
    'telegram-mini': { width: '390px', height: '844px' },
    'pixel-8': { width: '412px', height: '915px' },
    'galaxy-s24': { width: '360px', height: '780px' }
  };

  if (deviceSelect) {
    deviceSelect.addEventListener('change', (e) => {
      const preset = deviceSizes[e.target.value] || deviceSizes['telegram-mini'];
      phoneFrame.style.width = preset.width;
      phoneFrame.style.height = preset.height;
    });
  }
}
