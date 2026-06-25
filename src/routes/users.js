const { Router } = require('express');
const auth = require('../middleware/auth');
const userRepository = require('../repositories/user.repository');

const router = Router();

router.get('/me', auth, (req, res, next) => {
  try {
    const user = userRepository.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
