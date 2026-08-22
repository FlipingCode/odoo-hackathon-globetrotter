const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../globetrotter.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`✅ Connected to SQLite database at: ${dbPath}`);
    initSchema();
  }
});

db.run('PRAGMA foreign_keys = ON;');

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function exec(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function initSchema() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      preferred_currency TEXT DEFAULT 'USD',
      language TEXT DEFAULT 'en',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      cover_image TEXT,
      target_budget REAL DEFAULT 0,
      currency TEXT DEFAULT 'USD',
      is_public INTEGER DEFAULT 0,
      share_slug TEXT UNIQUE,
      cloned_from_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stops (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL,
      city_name TEXT NOT NULL,
      country TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      arrival_date TEXT NOT NULL,
      departure_date TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      stay_cost_per_night REAL DEFAULT 0,
      transport_cost_to_stop REAL DEFAULT 0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      stop_id TEXT NOT NULL,
      trip_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'sightseeing',
      estimated_cost REAL DEFAULT 0,
      currency TEXT DEFAULT 'USD',
      duration_minutes INTEGER DEFAULT 60,
      day_number INTEGER DEFAULT 1,
      scheduled_time TEXT,
      booking_status TEXT DEFAULT 'planned',
      location TEXT,
      image_url TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(stop_id) REFERENCES stops(id) ON DELETE CASCADE,
      FOREIGN KEY(trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS custom_expenses (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL,
      stop_id TEXT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      expense_date TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(trip_id) REFERENCES trips(id) ON DELETE CASCADE,
      FOREIGN KEY(stop_id) REFERENCES stops(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS cities_catalog (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      region TEXT,
      cost_index TEXT DEFAULT 'Moderate',
      popularity_score REAL DEFAULT 4.5,
      description TEXT,
      image_url TEXT,
      avg_daily_stay_cost REAL DEFAULT 80,
      avg_daily_meal_cost REAL DEFAULT 35
    );

    CREATE TABLE IF NOT EXISTS activities_catalog (
      id TEXT PRIMARY KEY,
      city_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'Sightseeing',
      estimated_cost REAL DEFAULT 20,
      duration_minutes INTEGER DEFAULT 90,
      popularity_score REAL DEFAULT 4.7,
      image_url TEXT,
      FOREIGN KEY(city_id) REFERENCES cities_catalog(id) ON DELETE CASCADE
    );
  `;

  try {
    await exec(schema);
    console.log('✅ Relational Database Schema initialized successfully.');
  } catch (err) {
    console.error('❌ Schema initialization error:', err.message);
  }
}

module.exports = { db, run, get, all, exec, initSchema };