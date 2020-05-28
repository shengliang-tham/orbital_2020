const express = require("express");
const router = express.Router()
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const middleware = require('../middleware/auth');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const authTypes = require('./authType')

const frontendUrl = process.env.NODE_ENV === "production" ? "https://orbital-2020.herokuapp.com/auth-redirect" : 'http://localhost:3000/auth-redirect';

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
    let token = signToken(authTypes.authTypeFacebook, user.facebookId);
    res.cookie('jwt', token);
    res.redirect(frontendUrl)
})

router.get('/google', passport.authenticate("google", { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate("google"), (req, res) => {
    const user = req.user;
    let token = signToken(authTypes.authTypeGoogle, user.googleId);
    res.cookie('jwt', token);
    res.redirect(frontendUrl)
})


router.post('/register', (req, res) => {

    User.findOne({ googleId: null, facebookId: null, email: req.body.email }).then(user => {
        if (user) {
            res.json({
                success: false,
                message: "Email has been used"
            })
        }
        //No such user
        if (!user) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt)
            let user = new User({
                email: req.body.email,
                password: hash
            })
            user.save().then(savedUser => {
                const token = signToken(authTypes.authTypeEmail, savedUser._id);
                res.json({
                    success: true,
                    token: token
                })
            });

        }
    }).catch(error => {
        res.json({
            success: false,
            message: error
        })
    })
})

router.post('/login', (req, res) => {
    User.findOne({
        googleId: null,
        facebookId: null,
        email: req.body.email
    }).then(user => {
        if (!user) {
            res.json({
                success: false,
                message: "No such user found"
            })
        } else {
            const samePassword = bcrypt.compareSync(req.body.password, user.password);
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

    }).catch(error => {
        res.json({
            success: false,
            message: error
        })
    })
})


const signToken = (authType, id) => {
    console.log("sign token " + authType)

    // switch (authType) {
    //     case authTypes.authTypeFacebook:
    //         return jwt.sign({
    //             authType: authTypes.authTypeFacebook,
    //             id: id
    //         }, config.secretKey, {
    //             expiresIn: '24h' // expires in 24 hours
    //         });
    //     case authTypes.authTypeGoogle:
    //         return jwt.sign({
    //             authType: authTypeGoogle,
    //             id: id
    //         }, config.secretKey, {
    //             expiresIn: '24h' // expires in 24 hours
    //         });
    //     default: return jwt.sign({
    //         authType: authTypeEmail,
    //         id: id
    //     }, config.secretKey, {
    //         expiresIn: '24h' // expires in 24 hours
    //     });
    // }

    return jwt.sign({
        authType: authType,
        id: id
    }, config.secretKey, {
        expiresIn: '24h' // expires in 24 hours
    });
}

router.get('/home', middleware.isAuthenticated, (req, res) => {
    console.log("pass")
    res.redirect('http://localhost:3000/home')
})
module.exports = router;