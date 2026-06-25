const db = require('../db/database');

const findAll = () =>
  db.prepare(`
    SELECT id, venue_id AS venueId, name, date, time, location, image_url AS imageUrl, base_price AS basePrice, currency
    FROM events
    ORDER BY date ASC
  `).all();

module.exports = { findAll };
