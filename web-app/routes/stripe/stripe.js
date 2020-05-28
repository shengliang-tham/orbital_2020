const express = require("express");
const router = express.Router()
const middleware = require('../middleware/auth');
const stripe = require('stripe')('sk_test_vAMKL5qHxb0WhNvUus50nJFn00KJ5efv1y');

router.post('/generate-intent', middleware.isAuthenticated, (req, res) => {

    const amount = req.body.amount * 100;

    stripe.paymentIntents.create({
        //This is in cents according to API
        amount: amount,
        currency: 'sgd',
    }).then(intent => {
        res.json({
            success: true,
            clientSecret: intent.client_secret
        })
    }).catch(error => {
        res.json({
            success: false,
            message: error
        })
    })
})

module.exports = router; 