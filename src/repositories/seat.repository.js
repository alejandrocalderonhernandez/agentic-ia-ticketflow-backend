const db = require('../db/database');

const findVenueTypeByEventId = (eventId) =>
  db.prepare(`
    SELECT v.venue_type AS venueType
    FROM venues v
    JOIN events e ON e.venue_id = v.id
    WHERE e.id = ?
  `).get(eventId);

const findZonesByEventId = (eventId) =>
  db.prepare(`
    SELECT z.id, z.name, z.color, z.price
    FROM zones z
    JOIN events e ON e.venue_id = z.venue_id
    WHERE e.id = ?
    ORDER BY z.price DESC
  `).all(eventId);

const findSeatsByEventId = (eventId) =>
  db.prepare(`
    SELECT s.id AS seatId, s.row, s.col, s.zone_id AS zone, s.status
    FROM seats s
    JOIN events e ON e.venue_id = s.venue_id
    WHERE e.id = ?
    ORDER BY s.row ASC, s.col ASC
  `).all(eventId);

const findSeatStatus = (seatId) =>
  db.prepare('SELECT status FROM seats WHERE id = ?').get(seatId);

const markAsOccupied = (seatId) =>
  db.prepare("UPDATE seats SET status = 'occupied' WHERE id = ?").run(seatId);

const markAsAvailable = (seatId) =>
  db.prepare("UPDATE seats SET status = 'available' WHERE id = ?").run(seatId);

module.exports = { findVenueTypeByEventId, findZonesByEventId, findSeatsByEventId, findSeatStatus, markAsOccupied, markAsAvailable };
