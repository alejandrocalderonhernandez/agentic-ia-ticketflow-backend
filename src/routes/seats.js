const { Router } = require('express');
const auth = require('../middleware/auth');
const seatRepository = require('../repositories/seat.repository');

const router = Router();

router.get('/:id/seats', auth, (req, res, next) => {
  try {
    const eventId = req.params.id;

    const venueResult = seatRepository.findVenueTypeByEventId(eventId);

    if (!venueResult) {
      return res.status(404).json({ error: 'EVENT_NOT_FOUND', message: 'Event not found' });
    }

    const zones = seatRepository.findZonesByEventId(eventId);
    const seats = seatRepository.findSeatsByEventId(eventId);

    res.json({ eventId, venueType: venueResult.venueType, zones, seats });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
