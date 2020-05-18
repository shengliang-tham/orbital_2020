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

//Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK.clientID,
    clientSecret: config.FACEBOOK.clientSecret,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'email']
}, async (accessToken, refreshToken, profile, cb) => {
    const facebookUser = await User.findOne({ facebookId: profile.id })
    if (!facebookUser) {
        let user = new User({
            email: profile.emails[0].value,
            facebookId: profile.id
        })
        user = await user.save();
    }

    return cb(null, profile);
}))


// Google Strategy
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE.clientID,
    clientSecret: config.GOOGLE.clientSecret,
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, cb) => {
        const googleUser = await User.findOne({ googleId: profile.id });
        if (!googleUser) {
            let user = new User({
                email: profile.emails[0].value,
                googleId: profile.id
            })
            user = await user.save();
            return cb(null, user);
        } else {
            return cb(null, googleUser);
        }
    }));

router.use(passport.initialize())


router.get('/facebook', passport.authenticate("facebook", { scope: ['email'] }))
router.get('/facebook/callback', passport.authenticate("facebook"), (req, res) => {
    let user = req.user;
    let token = signToken("facebook", user.googleId);
    res.cookie('jwt', token);
    res.redirect('http://localhost:3000/auth-redirect')
})

router.get('/google', passport.authenticate("google", { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate("google"), (req, res) => {
    const user = req.user;
    let token = signToken("google", user.googleId);
    res.cookie('jwt', token);
    res.redirect('http://localhost:3000/auth-redirect')
})


router.post('/register', async (req, res) => {
    try {
        const user = await User.findOne({ googleId: null, facebookId: null, email: req.body.email })
        if (user) {
            res.json({
                success: false,
                message: "Email has been used"
            })
        }
        //No such user
        if (!user) {
            const generateSalt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt)
            let user = new User({
                email: req.body.email,
                password: hash
            })
            user = await user.save();
            console.log(user._id)
            const token = signToken("email", user._id);
            res.json({
                success: true,
                token: token
            })
        }
    } catch (error) {
        res.json({
            success: false,
            message: error
        })
    }

})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            googleId: null,
            facebookId: null,
            email: req.body.email
        });
        if (!user) {
            res.json({
                success: false,
                message: "No such user found"
            })
        } else {
            const samePassword = await bcrypt.compareSync(req.body.password, user.password);
            if (samePassword) {
                const token = signToken("email", user._id);
                res.json({
                    success: true,
                    token: token
                })
            } else {
                res.json({
                    success: false,
                    message: "Wrong password"
                })
            }
        }
    } catch (error) {
        res.json({
            success: false,
            message: error
        })
    }

})


const signToken = (authType, id) => {
    switch (authType) {
        case "facebook":
            return jwt.sign({
                authType: "facebook",
                id: id
            }, config.secretKey, {
                expiresIn: '24h' // expires in 24 hours
            });
        case "google":
            return jwt.sign({
                authType: "google",
                id: id
            }, config.secretKey, {
                expiresIn: '24h' // expires in 24 hours
            });
        default: return jwt.sign({
            authType: "email",
            id: id
        }, config.secretKey, {
            expiresIn: '24h' // expires in 24 hours
        });
    }
}

router.get('/home', middleware.isAuthenticated, (req, res) => {
    console.log("pass")
    res.redirect('http://localhost:3000/home')
})
module.exports = router;