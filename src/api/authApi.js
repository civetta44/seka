/**
 * Telegram User Authentication & Permissions Service
 */

export const ADMIN_ID = '8940298485';

export const AuthApi = {
  getCurrentUser() {
    // 1. Check URL Hash (e.g. #uid=12345&name=Alex)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const uidFromHash = hashParams.get('uid');
    const nameFromHash = hashParams.get('name');

    // 2. Check Telegram WebApp initDataUnsafe
    let tgUser = null;
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    }

    if (tgUser) {
      return {
        id: String(tgUser.id),
        firstName: tgUser.first_name || 'Player',
        username: tgUser.username || '',
        isAdmin: String(tgUser.id) === ADMIN_ID
      };
    }

    if (uidFromHash) {
      return {
        id: uidFromHash,
        firstName: nameFromHash ? decodeURIComponent(nameFromHash) : (uidFromHash === ADMIN_ID ? 'Admin' : 'Player'),
        username: '',
        isAdmin: uidFromHash === ADMIN_ID
      };
    }

    // 3. Fallback: Default to Admin
    return {
      id: ADMIN_ID,
      firstName: 'Owner Admin',
      username: 'admin',
      isAdmin: true
    };
  },

  async checkStatus(user) {
    try {
      const res = await fetch(`/api/auth/status?userId=${user.id}`, {
        headers: { 'x-user-id': user.id }
      });
      if (!res.ok) throw new Error('Failed to verify status');
      return await res.json();
    } catch (err) {
      console.warn('Auth check fallback:', err);
      return {
        status: user.id === ADMIN_ID ? 'approved' : 'pending',
        isAdmin: user.id === ADMIN_ID,
        user
      };
    }
  }
};
