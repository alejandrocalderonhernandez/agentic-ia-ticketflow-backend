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

router.get('/paginated', auth, (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const { data, total } = eventRepository.findAllPaginated({ limit, offset });

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

module.exports = router;
