const express = require("express");
const router = express.Router()
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware/auth');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

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
    let token = jwt.sign({ authType: 'facebook', username: "username" },
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


router.post('/register', (req, res) => {
    console.log(req.body)
    console.log("hello")
    User.findOne({
        googleId: null,
        facebookId: null,
        email: req.body.email
    }, (error, user) => {
        //No such user
        if (!user) {

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    console.log(hash)
                    // Store hash in your password DB.
                    let user = new User({
                        email: req.body.email,
                        password: hash
                    })

                    user.save((err) => {
                        console.log(err)
                    })

                });
            });

        }


    })

    let token = jwt.sign({ email: "username" },
        config.secretKey,
        {
            expiresIn: '24h' // expires in 24 hours
        }
    );
    res.json({
        success: true,
        token: token
    })
})

router.post('/login', (req, res) => {
    console.log(req.body)
    User.findOne({
        googleId: null,
        facebookId: null,
        email: req.body.email
    }, (error, user) => {
        console.log(user)
        if (!user)
            res.json({
                success: false,
                message: "No such user found"
            })
        else {
            //Correct password
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let token = jwt.sign({ email: "username" },
                    config.secretKey,
                    {
                        expiresIn: '24h' // expires in 24 hours
                    }
                );
                res.json({
                    success: true,
                    token: token
                })
            }
            //Wrong password
            else {
                res.json({
                    success: false,
                    message: "Wrong password"
                })
            }
        }
    })
})

router.get('/home', middleware.isAuthenticated, (req, res) => {
    console.log("pass")
    res.redirect('http://localhost:3000/home')
})
module.exports = router;