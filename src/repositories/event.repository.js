const db = require('../db/database');

const findAll = () =>
  db.prepare(`
    SELECT id, venue_id AS venueId, name, date, time, location, image_url AS imageUrl, base_price AS basePrice, currency
    FROM events
    ORDER BY date ASC
  `).all();

const pageStmt = db.prepare(`
  SELECT id, venue_id AS venueId, name, date, time, location, image_url AS imageUrl, base_price AS basePrice, currency
  FROM events
  ORDER BY date ASC
  LIMIT @limit OFFSET @offset
`);

const countStmt = db.prepare('SELECT COUNT(*) AS total FROM events');

const findAllPaginated = ({ limit, offset }) => {
  const data = pageStmt.all({ limit, offset });
  const { total } = countStmt.get();
  return { data, total };
};

module.exports = { findAll, findAllPaginated };
