import http from 'http';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initSocketManager } from './socketManager.js';
import { initTelegramBot } from './telegramBot.js';
import { createAdminRouter } from './adminApi.js';
import { createGameServer } from './gameServer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

// 1. Mount Admin & Auth Endpoints
app.use('/api', createAdminRouter());

// 2. Mount Single-Player Engine as sub-router
app.use('/api/game', createGameServer());

// 3. Serve Built Frontend (Single Server Architecture)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback all frontend routes to index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return res.status(404).json({ error: 'Endpoint topilmadi' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// 4. Create HTTP Server for Socket.IO
const httpServer = http.createServer(app);

// 5. Initialize Socket.IO Multiplayer Manager
initSocketManager(httpServer);

// 6. Initialize Telegram Bot
initTelegramBot();

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`♠️♥️ Seka Multiplayer Server & Telegram Bot running on port ${PORT}`);
});
