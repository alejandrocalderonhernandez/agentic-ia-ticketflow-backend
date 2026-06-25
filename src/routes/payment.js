const { Router } = require('express');
const auth = require('../middleware/auth');

const router = Router();

router.post('/process', auth, async (req, res, next) => {
  try {
    const { method } = req.body;

    if (!method || !['card', 'paypal'].includes(method)) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'method must be card or paypal' });
    }

    if (Math.random() < 0.10) {
      return res.status(402).json({
        error: 'PAYMENT_DECLINED',
        message: 'Your payment was declined. Please try again.',
      });
    }

    const delay = 2000 + Math.floor(Math.random() * 3000);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const transactionId = `txn-${Math.floor(100000 + Math.random() * 900000)}`;

    res.json({
      transactionId,
      status: 'approved',
      message: 'Payment approved. You will receive a confirmation email.',
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
