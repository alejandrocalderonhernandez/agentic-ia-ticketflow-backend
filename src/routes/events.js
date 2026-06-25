const { Router } = require('express');
const auth = require('../middleware/auth');
const eventRepository = require('../repositories/event.repository');

const router = Router();

router.get('/', auth, (req, res, next) => {
  try {
    const data = eventRepository.findAll();
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
