/**
 * Admin API Service for User Management and Access Approvals
 */

const API_BASE = '/api/admin';

export const AdminApi = {
  async getUsers(adminId) {
    const res = await fetch(`${API_BASE}/users`, {
      headers: { 'x-admin-id': adminId }
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
  },

  async approveUser(adminId, targetUserId) {
    const res = await fetch(`${API_BASE}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-id': adminId
      },
      body: JSON.stringify({ adminId, targetUserId })
    });
    if (!res.ok) throw new Error('Failed to approve user');
    return await res.json();
  },

  async rejectUser(adminId, targetUserId) {
    const res = await fetch(`${API_BASE}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-id': adminId
      },
      body: JSON.stringify({ adminId, targetUserId })
    });
    if (!res.ok) throw new Error('Failed to reject user');
    return await res.json();
  },

  async setChips(adminId, targetUserId, amount) {
    const res = await fetch(`${API_BASE}/set-chips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-id': adminId
      },
      body: JSON.stringify({ adminId, targetUserId, amount })
    });
    if (!res.ok) throw new Error('Failed to update chips');
    return await res.json();
  },

  async toggleBan(adminId, targetUserId) {
    const res = await fetch(`${API_BASE}/toggle-ban`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-id': adminId
      },
      body: JSON.stringify({ adminId, targetUserId })
    });
    if (!res.ok) throw new Error('Failed to toggle ban');
    return await res.json();
  },

  async getActiveRooms(adminId) {
    const res = await fetch(`${API_BASE}/rooms`, {
      headers: { 'x-admin-id': adminId }
    });
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return await res.json();
  }
};
