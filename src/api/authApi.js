/**
 * Telegram User Authentication & Permissions Service
 */

export const ADMIN_ID = '8940298485';

export const AuthApi = {
  getCurrentUser() {
    // 1. Telegram WebApp Haqiqiy Foydalanuvchisi (ENG YUQORI USTUVORLIK)
    let tgUser = null;
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    }

    if (tgUser && tgUser.id) {
      const uid = String(tgUser.id);
      return {
        id: uid,
        firstName: tgUser.first_name || 'O\'yinchi',
        username: tgUser.username || '',
        isAdmin: uid === ADMIN_ID
      };
    }

    // 2. URL Hash orqali (Faqat Telegram tashqarisida test qilish uchun)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const uidFromHash = hashParams.get('uid');
    const nameFromHash = hashParams.get('name');

    if (uidFromHash) {
      return {
        id: String(uidFromHash),
        firstName: nameFromHash ? decodeURIComponent(nameFromHash) : (uidFromHash === ADMIN_ID ? 'Admin' : `O'yinchi_${uidFromHash.slice(-4)}`),
        username: '',
        isAdmin: String(uidFromHash) === ADMIN_ID
      };
    }

    // 3. Brauzerda test qiluvchi yangi mehmon uchun alohida ID yaratish (Admin bilan aralashib ketmasligi uchun)
    let guestId = localStorage.getItem('seka_player_id');
    let guestName = localStorage.getItem('seka_player_name');
    if (!guestId) {
      guestId = `user_${Math.floor(100000 + Math.random() * 900000)}`;
      guestName = `O'yinchi_${guestId.slice(-3)}`;
      localStorage.setItem('seka_player_id', guestId);
      localStorage.setItem('seka_player_name', guestName);
    }

    return {
      id: guestId,
      firstName: guestName,
      username: '',
      isAdmin: false
    };
  },

  async checkStatus(user) {
    try {
      const res = await fetch(`/api/auth/status?userId=${user.id}`, {
        headers: { 'x-user-id': user.id }
      });
      if (!res.ok) throw new Error('Status tekshirishda xatolik');
      return await res.json();
    } catch (err) {
      console.warn('Auth fallback:', err);
      return {
        status: user.id === ADMIN_ID ? 'approved' : 'pending',
        isAdmin: user.id === ADMIN_ID,
        user
      };
    }
  }
};
