const { validate } = require('../utils/token');

const auth = (req, res, next) => {
  const header = req.headers['authorization'];

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or missing token' });
  }

  const token = header.split(' ')[1];
  const userId = validate(token);

  if (!userId) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or missing token' });
  }

  req.userId = userId;
  next();
};

module.exports = auth;
