import { Storage, ADMIN_ID } from './storage.js';

export const AuthManager = {
  isAdmin(userId) {
    return String(userId) === String(ADMIN_ID);
  },

  isUserApproved(userId) {
    if (this.isAdmin(userId)) return true;
    const user = Storage.getUser(userId);
    return user && user.status === 'approved' && !user.isBanned;
  },

  getUserStatus(userId) {
    if (this.isAdmin(userId)) return 'approved';
    const user = Storage.getUser(userId);
    if (!user) return 'not_found';
    if (user.isBanned) return 'banned';
    return user.status || 'pending';
  },

  registerOrGetUser(tgUser) {
    const userId = String(tgUser.id);
    let user = Storage.getUser(userId);

    if (!user) {
      const isSuperAdmin = this.isAdmin(userId);
      user = {
        id: userId,
        username: tgUser.username || '',
        firstName: tgUser.first_name || 'Player',
        lastName: tgUser.last_name || '',
        role: isSuperAdmin ? 'admin' : 'user',
        status: isSuperAdmin ? 'approved' : 'pending',
        chips: isSuperAdmin ? 50000 : 1000,
        createdAt: new Date().toISOString(),
        approvedAt: isSuperAdmin ? new Date().toISOString() : null,
        isBanned: false
      };
      Storage.saveUser(user);
    } else {
      // Update username / name if changed in Telegram
      let changed = false;
      if (tgUser.username && user.username !== tgUser.username) {
        user.username = tgUser.username;
        changed = true;
      }
      if (tgUser.first_name && user.firstName !== tgUser.first_name) {
        user.firstName = tgUser.first_name;
        changed = true;
      }
      if (changed) Storage.saveUser(user);
    }

    return user;
  },

  approveUser(userId) {
    const user = Storage.getUser(userId);
    if (!user) return null;

    user.status = 'approved';
    user.approvedAt = new Date().toISOString();
    if (!user.chips || user.chips < 1000) user.chips = 1000;
    Storage.saveUser(user);
    return user;
  },

  rejectUser(userId) {
    const user = Storage.getUser(userId);
    if (!user) return null;

    user.status = 'rejected';
    user.rejectedAt = new Date().toISOString();
    Storage.saveUser(user);
    return user;
  },

  toggleBan(userId) {
    const user = Storage.getUser(userId);
    if (!user || this.isAdmin(userId)) return null;

    user.isBanned = !user.isBanned;
    Storage.saveUser(user);
    return user;
  },

  setChips(userId, amount) {
    const user = Storage.getUser(userId);
    if (!user) return null;

    user.chips = Math.max(0, parseInt(amount, 10) || 0);
    Storage.saveUser(user);
    return user;
  },

  getPendingUsers() {
    const users = Storage.getUsers();
    return Object.values(users).filter(u => u.status === 'pending' && !u.isBanned);
  },

  getAllUsers() {
    const users = Storage.getUsers();
    return Object.values(users);
  }
};
