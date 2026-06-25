const { Router } = require('express');
const userRepository = require('../repositories/user.repository');
const tokenUtils = require('../utils/token');

const router = Router();

router.post('/login', (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'email and password are required' });
    }

    const user = userRepository.findByCredentials(email, password);

    if (!user) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
    }

    const token = tokenUtils.generate(user.id);

    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
