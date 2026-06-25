const { Router } = require('express');
const auth = require('../middleware/auth');
const bookingRepository = require('../repositories/booking.repository');
const seatRepository = require('../repositories/seat.repository');

const router = Router();

router.post('/', auth, (req, res, next) => {
  try {
    const { eventId, seatId, contactEmail, contactPhone, payment, total } = req.body;

    if (!eventId || !seatId || !contactEmail || !contactPhone || !payment) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'eventId, seatId, contactEmail, contactPhone and payment are required' });
    }

    const seatStatus = seatRepository.findSeatStatus(seatId);

    if (!seatStatus || seatStatus.status === 'occupied') {
      return res.status(409).json({ error: 'SEAT_UNAVAILABLE', message: 'The selected seat is not available' });
    }

    const bookingId = `TF-${Math.floor(100000 + Math.random() * 900000)}`;

    bookingRepository.create({
      id: bookingId,
      userId: req.userId,
      eventId,
      seatId,
      status: 'confirmed',
      total: total || 0,
      currency: 'USD',
      contactEmail,
      contactPhone,
      paymentMethod: payment.method,
      transactionId: payment.transactionId,
    });

    seatRepository.markAsOccupied(seatId);

    const booking = bookingRepository.findFullById(bookingId);

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

router.get('/', auth, (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const filters = {
      status: req.query.status || null,
      eventName: req.query.eventName ? `%${req.query.eventName}%` : null,
      dateFrom: req.query.dateFrom || null,
      dateTo: req.query.dateTo || null,
      limit,
      offset,
    };

    const { data, total } = bookingRepository.findAllByUser(req.userId, filters);

    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/cancel', auth, (req, res, next) => {
  try {
    const booking = bookingRepository.findByIdAndUser(req.params.id, req.userId);

    if (!booking) {
      return res.status(404).json({ error: 'BOOKING_NOT_FOUND', message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(409).json({ error: 'INVALID_TRANSITION', message: 'This booking cannot be cancelled in its current state' });
    }

    bookingRepository.cancel(req.params.id);

    const { seatId } = bookingRepository.findSeatIdByBookingId(req.params.id);
    seatRepository.markAsAvailable(seatId);

    res.json({
      id: booking.id,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
