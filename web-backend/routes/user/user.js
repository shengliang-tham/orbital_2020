const express = require("express");
const router = express.Router()
const middleware = require('../middleware/auth');
const { authTypeEmail } = require('../auth/authType')
const User = require('../../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

router.post('/update-email', middleware.isAuthenticated, (req, res) => {
    console.log(req)
    const { authType } = req.decoded
    if (authType === authTypeEmail) {
        User.findOneAndUpdate({
            _id: new ObjectId(req.decoded.id)
        }, { $set: { email: req.body.email } })
            .then(user => {
                console.log(user)
                res.json({
                    success: true,
                })
            }).catch(error => {
                res.json({
                    success: false,
                    message: error
                })
            })
    } else {
        User.findOneAndUpdate({
            [authType]: req.decoded.id
        }, { $set: { email: req.body.email } })
            .then(user => {
                console.log(user)
                res.json({
                    success: true,
                })
            }).catch(error => {
                res.json({
                    success: false,
                    message: error
                })
            })
    }
})

router.post('/update-password', middleware.isAuthenticated, (req, res) => {
    console.log(req)
    const { authType } = req.decoded
    if (authType === authTypeEmail) {
        User.findOneAndUpdate({
            _id: new ObjectId(req.decoded.id)
        }, { $set: { email: req.body.email } })
            .then(user => {
                console.log(user)
                res.json({
                    success: true,
                })
            }).catch(error => {
                res.json({
                    success: false,
                    message: error
                })
            })
    } else {
        res.json({
            success: false,
            message: "Only can change password using email authentication"
        })
    }
})

module.exports = router; 