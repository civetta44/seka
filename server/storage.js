import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ROOMS_FILE = path.join(DATA_DIR, 'rooms.json');

export const ADMIN_ID = '8940298485';

function readJSON(file, defaultVal) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultVal, null, 2));
      return defaultVal;
    }
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return defaultVal;
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
  }
}

export const Storage = {
  getUsers() {
    const users = readJSON(USERS_FILE, {});
    // Ensure Super Admin is always registered and approved
    if (!users[ADMIN_ID]) {
      users[ADMIN_ID] = {
        id: ADMIN_ID,
        username: 'SuperAdmin',
        firstName: 'Owner',
        role: 'admin',
        status: 'approved',
        chips: 50000,
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
        isBanned: false
      };
      writeJSON(USERS_FILE, users);
    }
    return users;
  },

  saveUsers(users) {
    writeJSON(USERS_FILE, users);
  },

  getUser(userId) {
    const users = this.getUsers();
    return users[String(userId)] || null;
  },

  saveUser(user) {
    const users = this.getUsers();
    users[String(user.id)] = user;
    this.saveUsers(users);
  },

  getRooms() {
    return readJSON(ROOMS_FILE, {});
  },

  saveRooms(rooms) {
    writeJSON(ROOMS_FILE, rooms);
  }
};
