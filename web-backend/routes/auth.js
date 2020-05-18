const express = require("express");
const router = express.Router()
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware/auth')


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
    callbackURL: "/auth/facebook/callback"
},
    (accessToken, refreshToken, profile, cb) => {
        console.log((JSON.stringify(profile)));
        user = { ...profile };
        return cb(null, profile);
    }));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE.clientID,
    clientSecret: config.GOOGLE.clientSecret,
    callbackURL: "/auth/google/callback"
},
    (accessToken, refreshToken, profile, cb) => {
        console.log((JSON.stringify(profile)));
        user = { ...profile };
        return cb(null, profile);
    }));

router.use(passport.initialize())


router.get('/facebook', passport.authenticate("facebook"))
router.get('/facebook/callback', passport.authenticate("facebook"), (req, res) => {
    console.log("authenticated")
    res.redirect('http://localhost:3000/home')
})

router.get('/google', passport.authenticate("google", { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate("google"), (req, res) => {
    console.log("authenticated")
    let token = jwt.sign({ username: "username" },
        config.secretKey,
        {
            expiresIn: '24h' // expires in 24 hours
        }
    );
    // return the JWT token for the future API calls
    res.json({
        success: true,
        message: 'Authentication successful!',
        token: token
    });
    res.redirect('http://localhost:3000/home')
})

router.get('/home', middleware.isAuthenticated, (req, res) => {
    console.log("pass")
    res.redirect('http://localhost:3000/home')
})
module.exports = router;