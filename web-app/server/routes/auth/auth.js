/* eslint-disable no-underscore-dangle */
const express = require('express');
const asyncify = require('express-asyncify');

const router = asyncify(express.Router());
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config/config');
const User = require('../../models/user');
const authTypes = require('./authType');

const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://orbital-2020.herokuapp.com/' : 'http://localhost:3000/';

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

/**
 * Function to generate token
 * @param {*} authType Authentication Type
 * @param {*} id User's Id based on mLab
 */
const signToken = async (authType, id) => jwt.sign({
  authType,
  id,
}, config.secretKey, {
  expiresIn: '24h', // expires in 24 hours
});

/**
 * Facebook Strategy
 */
passport.use(new FacebookStrategy({
  clientID: config.FACEBOOK.clientID,
  clientSecret: config.FACEBOOK.clientSecret,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'email'],
}, async (accessToken, refreshToken, profile, cb) => {
  const facebookUser = await User.findOne({ facebookId: profile.id });
  if (!facebookUser) {
    await new User({
      email: profile.emails[0].value,
      facebookId: profile.id,
    }).save();
  }

  return cb(null, profile);
}));

/**
 * Google Strategy
 */
passport.use(new GoogleStrategy({
  clientID: config.GOOGLE.clientID,
  clientSecret: config.GOOGLE.clientSecret,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, cb) => {
  const googleUser = await User.findOne({ googleId: profile.id });
  if (!googleUser) {
    let user = new User({
      email: profile.emails[0].value,
      googleId: profile.id,
    });
    user = await user.save();
    return cb(null, user);
  }
  return cb(null, googleUser);
}));

router.use(passport.initialize());

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook'), async (req, res) => {
  const { user } = req;
  const token = await signToken(authTypes.authTypeFacebook, user.facebookId);
  res.cookie('jwt', token);
  res.redirect(`${frontendUrl}auth-redirect`);
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google'), async (req, res) => {
  const { user } = req;
  const token = await signToken(authTypes.authTypeGoogle, user.googleId);
  res.cookie('jwt', token);
  res.redirect(`${frontendUrl}auth-redirect`);
});

router.post('/register', async (req, res) => {
  try {
    const user = await User.findOne({ googleId: null, facebookId: null, email: req.body.email });
    if (user) {
      res.json({
        success: false,
        message: 'Email has been used',
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      let newUser = new User({
        email: req.body.email,
        password: hash,
      });
      newUser = await newUser.save();
      const token = await signToken(authTypes.authTypeEmail, newUser._id);
      res.json({
        success: true,
        token,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ googleId: null, facebookId: null, email: req.body.email });

    if (!user) {
      res.json({
        success: false,
        message: 'No such user found',
      });
    } else {
      const samePassword = await bcrypt.compare(req.body.password, user.password);
      if (samePassword) {
        const token = await signToken('email', user._id);
        res.json({
          success: true,
          token,
        });
      } else {
        res.json({
          success: false,
          message: 'Wrong password',
        });
      }
    }
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

module.exports = router;
