const db = require('../db/database');

const create = (booking) =>
  db.prepare(`
    INSERT INTO bookings (
      id, user_id, event_id, seat_id, status, total, currency,
      contact_email, contact_phone, payment_method, transaction_id
    ) VALUES (
      @id, @userId, @eventId, @seatId, @status, @total, @currency,
      @contactEmail, @contactPhone, @paymentMethod, @transactionId
    )
  `).run(booking);

const dataStmt = db.prepare(`
  SELECT
    b.id, b.status, b.total, b.currency, b.contact_email AS contactEmail,
    b.payment_method AS paymentMethod, b.transaction_id AS transactionId,
    b.created_at AS createdAt, b.cancelled_at AS cancelledAt,
    e.id AS eventId, e.name AS eventName, e.date AS eventDate,
    e.time AS eventTime, e.location,
    s.id AS seatId, s.row, s.col,
    z.name AS zone
  FROM bookings b
  JOIN events e ON b.event_id = e.id
  JOIN seats s  ON b.seat_id  = s.id
  JOIN zones z  ON s.zone_id  = z.id
  WHERE b.user_id = ?
    AND (b.status = @status OR @status IS NULL)
    AND (e.name LIKE @eventName OR @eventName IS NULL)
    AND (e.date >= @dateFrom OR @dateFrom IS NULL)
    AND (e.date <= @dateTo OR @dateTo IS NULL)
  ORDER BY b.created_at DESC
  LIMIT @limit OFFSET @offset
`);

const countStmt = db.prepare(`
  SELECT COUNT(*) AS total
  FROM bookings b
  JOIN events e ON b.event_id = e.id
  WHERE b.user_id = ?
    AND (b.status = @status OR @status IS NULL)
    AND (e.name LIKE @eventName OR @eventName IS NULL)
    AND (e.date >= @dateFrom OR @dateFrom IS NULL)
    AND (e.date <= @dateTo OR @dateTo IS NULL)
`);

const findAllByUser = (userId, filters) => {
  const params = {
    status: filters.status,
    eventName: filters.eventName,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    limit: filters.limit,
    offset: filters.offset,
  };
  const data = dataStmt.all(userId, params);
  const { total } = countStmt.get(userId, params);
  return { data, total };
};

const findByIdAndUser = (bookingId, userId) =>
  db.prepare('SELECT id, status FROM bookings WHERE id = ? AND user_id = ?').get(bookingId, userId);

const cancel = (bookingId) =>
  db.prepare("UPDATE bookings SET status = 'cancelled', cancelled_at = datetime('now') WHERE id = ?").run(bookingId);

const findSeatIdByBookingId = (bookingId) =>
  db.prepare('SELECT seat_id AS seatId FROM bookings WHERE id = ?').get(bookingId);

const findFullById = (bookingId) =>
  db.prepare(`
    SELECT
      b.id, b.status, b.total, b.currency, b.contact_email AS contactEmail,
      b.payment_method AS paymentMethod, b.transaction_id AS transactionId,
      b.created_at AS createdAt, b.cancelled_at AS cancelledAt,
      e.id AS eventId, e.name AS eventName, e.date AS eventDate,
      e.time AS eventTime, e.location,
      s.id AS seatId, s.row, s.col,
      z.name AS zone
    FROM bookings b
    JOIN events e ON b.event_id = e.id
    JOIN seats s  ON b.seat_id  = s.id
    JOIN zones z  ON s.zone_id  = z.id
    WHERE b.id = ?
  `).get(bookingId);

module.exports = { create, findAllByUser, findByIdAndUser, cancel, findSeatIdByBookingId, findFullById };
