// IndexedDB wrapper for HeroTrack data storage
import { openDB } from 'idb';

const DB_NAME = 'HeroTrackDB';
const DB_VERSION = 1;

// Database schema
const STORES = {
  TOURNAMENTS: 'tournaments',
  MATCHES: 'matches',
  SETTINGS: 'settings'
};

let db = null;

// Initialize database
export async function initDB() {
  if (db) return db;
  
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Tournaments store
      if (!db.objectStoreNames.contains(STORES.TOURNAMENTS)) {
        const tournamentStore = db.createObjectStore(STORES.TOURNAMENTS, {
          keyPath: 'id',
          autoIncrement: true
        });
        tournamentStore.createIndex('date', 'date');
        tournamentStore.createIndex('userId', 'userId');
      }

      // Matches store
      if (!db.objectStoreNames.contains(STORES.MATCHES)) {
        const matchStore = db.createObjectStore(STORES.MATCHES, {
          keyPath: 'id',
          autoIncrement: true
        });
        matchStore.createIndex('tournamentId', 'tournamentId');
        matchStore.createIndex('round', 'round');
        matchStore.createIndex('userId', 'userId');
      }

      // Settings store
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, {
          keyPath: 'userId'
        });
      }
    }
  });
  
  return db;
}

// Tournament operations
export async function createTournament(tournament) {
  const database = await initDB();
  const tx = database.transaction(STORES.TOURNAMENTS, 'readwrite');
  const result = await tx.store.add({
    ...tournament,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  await tx.done;
  return result;
}

export async function getTournaments(userId) {
  const database = await initDB();
  const tx = database.transaction(STORES.TOURNAMENTS, 'readonly');
  const tournaments = await tx.store.index('userId').getAll(userId);
  return tournaments.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getTournament(id) {
  const database = await initDB();
  return await database.get(STORES.TOURNAMENTS, id);
}

export async function updateTournament(id, updates) {
  const database = await initDB();
  const tx = database.transaction(STORES.TOURNAMENTS, 'readwrite');
  const tournament = await tx.store.get(id);
  if (tournament) {
    const updated = {
      ...tournament,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await tx.store.put(updated);
  }
  await tx.done;
  return tournament;
}

// Match operations
export async function createMatch(match) {
  const database = await initDB();
  const tx = database.transaction(STORES.MATCHES, 'readwrite');
  const result = await tx.store.add({
    ...match,
    createdAt: new Date().toISOString()
  });
  await tx.done;
  return result;
}

export async function getMatchesByTournament(tournamentId) {
  const database = await initDB();
  const tx = database.transaction(STORES.MATCHES, 'readonly');
  const matches = await tx.store.index('tournamentId').getAll(tournamentId);
  return matches.sort((a, b) => a.round - b.round);
}

export async function getAllMatches(userId) {
  const database = await initDB();
  const tx = database.transaction(STORES.MATCHES, 'readonly');
  return await tx.store.index('userId').getAll(userId);
}

export async function updateMatch(id, updates) {
  const database = await initDB();
  const tx = database.transaction(STORES.MATCHES, 'readwrite');
  const match = await tx.store.get(id);
  if (match) {
    const updated = { ...match, ...updates };
    await tx.store.put(updated);
  }
  await tx.done;
  return match;
}

// Settings operations
export async function getUserSettings(userId) {
  const database = await initDB();
  const settings = await database.get(STORES.SETTINGS, userId);
  return settings || getDefaultSettings();
}

export async function updateUserSettings(userId, settings) {
  const database = await initDB();
  const tx = database.transaction(STORES.SETTINGS, 'readwrite');
  await tx.store.put({ userId, ...settings });
  await tx.done;
}

function getDefaultSettings() {
  return {
    showOpponentName: true,
    showMapName: true,
    showTeamScreenshot: true,
    defaultRounds: 3
  };
}
