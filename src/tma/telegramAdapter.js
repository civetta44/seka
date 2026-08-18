/**
 * Telegram Mini App (TMA) SDK Bridge & Helpers
 */

export const TelegramBridge = {
  isAvailable: false,
  tg: null,

  init() {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      this.tg = window.Telegram.WebApp;
      this.isAvailable = true;
      
      try {
        this.tg.ready();
        this.tg.expand();
        this.syncTheme();
      } catch (err) {
        console.warn('Telegram WebApp init warning:', err);
      }
    }
  },

  syncTheme() {
    if (!this.tg || !this.tg.themeParams) return;
    const params = this.tg.themeParams;
    const root = document.documentElement;

    if (params.bg_color) root.style.setProperty('--tg-theme-bg-color', params.bg_color);
    if (params.text_color) root.style.setProperty('--tg-theme-text-color', params.text_color);
    if (params.hint_color) root.style.setProperty('--tg-theme-hint-color', params.hint_color);
    if (params.link_color) root.style.setProperty('--tg-theme-link-color', params.link_color);
    if (params.button_color) root.style.setProperty('--tg-theme-button-color', params.button_color);
    if (params.button_text_color) root.style.setProperty('--tg-theme-button-text-color', params.button_text_color);
    if (params.secondary_bg_color) root.style.setProperty('--tg-theme-secondary-bg-color', params.secondary_bg_color);
    if (params.header_bg_color) root.style.setProperty('--tg-theme-header-bg-color', params.header_bg_color);
  }
};

/**
 * Triggers haptic feedback via Telegram SDK or browser vibration API
 * @param {'impact'|'notification'|'selection'} type 
 * @param {'light'|'medium'|'heavy'|'rigid'|'soft'|'success'|'warning'|'error'} style 
 */
export function triggerHaptic(type = 'impact', style = 'light') {
  if (TelegramBridge.isAvailable && TelegramBridge.tg?.HapticFeedback) {
    const haptic = TelegramBridge.tg.HapticFeedback;
    if (type === 'impact') {
      haptic.impactOccurred(style);
    } else if (type === 'notification') {
      haptic.notificationOccurred(style);
    } else if (type === 'selection') {
      haptic.selectionChanged();
    }
  } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
    // Fallback vibration
    navigator.vibrate(type === 'impact' ? 15 : 10);
  }
}
