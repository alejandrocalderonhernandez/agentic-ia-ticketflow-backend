const { Router } = require('express');
const auth = require('../middleware/auth');
const tokenUtils = require('../utils/token');

const router = Router();

router.post('/logout', auth, (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    tokenUtils.revoke(token);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
