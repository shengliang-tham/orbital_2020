const express = require('express');

const router = express.Router();
const stripe = require('stripe')('sk_test_vAMKL5qHxb0WhNvUus50nJFn00KJ5efv1y');
const middleware = require('../middleware/auth');

router.post('/generate-intent', middleware.isAuthenticated, async (req, res) => {
  const amount = req.body.amount * 100;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      // This is in cents according to API
      amount,
      currency: 'sgd',
    });
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

module.exports = router;
