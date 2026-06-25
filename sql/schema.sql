-- =============================================================
-- TicketFlow API — Database Schema
-- SQLite — executed on every container start
-- =============================================================

PRAGMA foreign_keys = ON;

-- -------------------------------------------------------------
-- USERS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    lastname     TEXT NOT NULL,
    email        TEXT NOT NULL UNIQUE,
    password     TEXT NOT NULL,
    phone        TEXT NOT NULL,
    created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- -------------------------------------------------------------
-- TOKENS
-- In-memory Map is the primary store.
-- This table is a fallback log — not required for auth flow.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tokens (
    token        TEXT PRIMARY KEY,
    user_id      TEXT NOT NULL,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- -------------------------------------------------------------
-- VENUES
-- Physical location — arena, halfmoon, flat
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venues (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    venue_type   TEXT NOT NULL CHECK (venue_type IN ('arena', 'halfmoon', 'flat')),
    created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- -------------------------------------------------------------
-- ZONES
-- Price zones within a venue — VIP, Premium, General
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zones (
    id           TEXT PRIMARY KEY,
    venue_id     TEXT NOT NULL,
    name         TEXT NOT NULL,
    color        TEXT NOT NULL,
    price        REAL NOT NULL,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- -------------------------------------------------------------
-- EVENTS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id           TEXT PRIMARY KEY,
    venue_id     TEXT NOT NULL,
    name         TEXT NOT NULL,
    date         TEXT NOT NULL,
    time         TEXT NOT NULL,
    location     TEXT NOT NULL,
    image_url    TEXT NOT NULL,
    base_price   REAL NOT NULL,
    currency     TEXT NOT NULL DEFAULT 'USD',
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- -------------------------------------------------------------
-- SEATS
-- Seats belong to a venue — shared across all events at that venue.
-- Status resets to seed values on every container restart.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seats (
    id           TEXT PRIMARY KEY,
    venue_id     TEXT NOT NULL,
    zone_id      TEXT NOT NULL,
    row          INTEGER NOT NULL,
    col          INTEGER NOT NULL,
    status       TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied')),
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (venue_id) REFERENCES venues(id),
    FOREIGN KEY (zone_id)  REFERENCES zones(id)
);

-- -------------------------------------------------------------
-- BOOKINGS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id               TEXT PRIMARY KEY,
    user_id          TEXT NOT NULL,
    event_id         TEXT NOT NULL,
    seat_id          TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
    total            REAL NOT NULL,
    currency         TEXT NOT NULL DEFAULT 'USD',
    contact_email    TEXT NOT NULL,
    contact_phone    TEXT NOT NULL,
    payment_method   TEXT NOT NULL CHECK (payment_method IN ('card', 'paypal')),
    transaction_id   TEXT NOT NULL,
    created_at       TEXT NOT NULL DEFAULT (datetime('now')),
    cancelled_at     TEXT,
    FOREIGN KEY (user_id)  REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (seat_id)  REFERENCES seats(id)
);