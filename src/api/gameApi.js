/**
 * Client API Service to communicate with authoritative Seka Server
 */

const API_BASE = 'http://localhost:3001/api/game';

export const GameApi = {
  async getState() {
    const res = await fetch(`${API_BASE}/state`);
    if (!res.ok) throw new Error('Failed to fetch game state');
    return await res.json();
  },

  async setMode(mode) {
    const res = await fetch(`${API_BASE}/set-mode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode })
    });
    if (!res.ok) throw new Error('Failed to set game mode');
    return await res.json();
  },

  async resetMatch() {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to reset match');
    return await res.json();
  },

  async deal() {
    const res = await fetch(`${API_BASE}/deal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to deal');
    }
    return await res.json();
  },

  async takeAction(action, raiseAmount = 10) {
    const res = await fetch(`${API_BASE}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, raiseAmount })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Action failed');
    }
    return await res.json();
  }
};
