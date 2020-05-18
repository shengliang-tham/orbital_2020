const express = require("express");
const router = express.Router()
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware/auth')
const User = require('../models/user')

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK.clientID,
    clientSecret: config.FACEBOOK.clientSecret,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'email']
},
    (accessToken, refreshToken, profile, cb) => {
        User.findOne({
            facebookId: profile.id
        }, (error, user) => {
            if (!user) {
                let user = new User({
                    email: profile.emails[0].value,
                    facebookId: profile.id
                })

                user.save((err) => {
                    console.log(err)
                })
            }
        })
        return cb(null, profile);
    }));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE.clientID,
    clientSecret: config.GOOGLE.clientSecret,
    callbackURL: "/auth/google/callback"
},
    (accessToken, refreshToken, profile, cb) => {
        User.findOne({
            googleId: profile.id
        }, (error, user) => {
            if (!user) {
                let user = new User({
                    email: profile.emails[0].value,
                    googleId: profile.id
                })

                user.save((err) => {
                    console.log(err)
                })
            }

        })
        return cb(null, profile);
    }));

router.use(passport.initialize())


router.get('/facebook', passport.authenticate("facebook", { scope: ['email'] }))
router.get('/facebook/callback', passport.authenticate("facebook"), (req, res) => {
    let token = jwt.sign({ username: "username" },
        config.secretKey,
        {
            expiresIn: '24h' // expires in 24 hours
        }
    );

    res.cookie('jwt', token);
    res.redirect('http://localhost:3000/auth-redirect')
})

router.get('/google', passport.authenticate("google", { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate("google"), (req, res) => {
    let token = jwt.sign({ username: "username" },
        config.secretKey,
        {
            expiresIn: '24h' // expires in 24 hours
        }
    );

    res.cookie('jwt', token);
    res.redirect('http://localhost:3000/auth-redirect')
})

router.get('/home', middleware.isAuthenticated, (req, res) => {
    console.log("pass")
    res.redirect('http://localhost:3000/home')
})
module.exports = router;