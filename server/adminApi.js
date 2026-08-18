import express from 'express';
import { AuthManager } from './authManager.js';
import { activeRooms } from './socketManager.js';

export function createAdminRouter() {
  const router = express.Router();

  // Middleware: Verify Admin
  function requireAdmin(req, res, next) {
    const adminId = req.headers['x-admin-id'] || req.body?.adminId || req.query?.adminId;
    if (!AuthManager.isAdmin(adminId)) {
      return res.status(403).json({ error: 'Access forbidden. Administrator privileges required.' });
    }
    next();
  }

  // 1. Auth Status Endpoint for Client
  router.get('/auth/status', (req, res) => {
    const userId = req.query.userId || req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter.' });
    }

    const status = AuthManager.getUserStatus(userId);
    const user = AuthManager.registerOrGetUser({ id: userId });
    const isAdmin = AuthManager.isAdmin(userId);

    res.json({
      status: isAdmin ? 'approved' : status,
      isAdmin,
      user
    });
  });

  // 2. List All Users & Pending Requests
  router.get('/admin/users', requireAdmin, (req, res) => {
    const allUsers = AuthManager.getAllUsers();
    const pendingUsers = AuthManager.getPendingUsers();
    res.json({
      totalCount: allUsers.length,
      pendingCount: pendingUsers.length,
      users: allUsers,
      pending: pendingUsers
    });
  });

  // 3. Approve User
  router.post('/admin/approve', requireAdmin, (req, res) => {
    const { targetUserId } = req.body;
    const approved = AuthManager.approveUser(targetUserId);
    if (!approved) return res.status(404).json({ error: 'User not found.' });

    res.json({ success: true, user: approved });
  });

  // 4. Reject User
  router.post('/admin/reject', requireAdmin, (req, res) => {
    const { targetUserId } = req.body;
    const rejected = AuthManager.rejectUser(targetUserId);
    if (!rejected) return res.status(404).json({ error: 'User not found.' });

    res.json({ success: true, user: rejected });
  });

  // 5. Toggle Ban
  router.post('/admin/toggle-ban', requireAdmin, (req, res) => {
    const { targetUserId } = req.body;
    const updated = AuthManager.toggleBan(targetUserId);
    if (!updated) return res.status(404).json({ error: 'User not found.' });

    res.json({ success: true, user: updated });
  });

  // 6. Set Chips
  router.post('/admin/set-chips', requireAdmin, (req, res) => {
    const { targetUserId, amount } = req.body;
    const updated = AuthManager.setChips(targetUserId, amount);
    if (!updated) return res.status(404).json({ error: 'User not found.' });

    res.json({ success: true, user: updated });
  });

  // 7. Get Active Rooms
  router.get('/admin/rooms', requireAdmin, (req, res) => {
    const rooms = [];
    for (const [id, r] of activeRooms.entries()) {
      rooms.push({
        id: r.id,
        hostName: r.hostName,
        mode: r.mode,
        ante: r.ante,
        playerCount: r.players.filter(p => p !== null).length,
        maxPlayers: r.maxPlayers,
        phase: r.phase,
        pot: r.pot,
        createdAt: r.createdAt
      });
    }
    res.json({ count: rooms.length, rooms });
  });

  return router;
}
