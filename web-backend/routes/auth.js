const express = require("express");
const router = express.Router()
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/config');


passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: keys.FACEBOOK.clientID,
    clientSecret: keys.FACEBOOK.clientSecret,
    callbackURL: "/auth/facebook/callback"
},
    (accessToken, refreshToken, profile, cb) => {
        console.log((JSON.stringify(profile)));
        user = { ...profile };
        return cb(null, profile);
    }));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE.clientID,
    clientSecret: keys.GOOGLE.clientSecret,
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
    console.log(res.json())
    res.redirect('http://localhost:3000/home')
})

module.exports = router;