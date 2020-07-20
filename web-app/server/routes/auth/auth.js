/* eslint-disable no-underscore-dangle */
const express = require('express');
const asyncify = require('express-asyncify');

const router = asyncify(express.Router());
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;
const config = require('../../config/config');
const User = require('../../models/user');
const VerificationToken = require('../../models/verificationToken');
const authTypes = require('./authType');

const oauth2Client = new OAuth2(
  config.GOOGLE_EMAIL.clientId,
  config.GOOGLE_EMAIL.clientSecret,
  'https://developers.google.com/oauthplayground', // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: config.GOOGLE_EMAIL.refreshToken,
});

const accessToken = oauth2Client.getAccessToken();


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

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     description: Register new users
 *     consumes:
 *     - "application/json"
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: The user to create
 *         in: body
 *         schema:
 *          type: object
 *          required:
 *            - email
 *              password
 *          properties:
 *            email:
 *              type: string
 *              example: test@test.com
 *            password:
 *              type: string
 *              example: abc123
 *     responses:
 *        success:
 *         description: A JSON response containing a boolean variable success.
 */
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

      const verificationToken = new VerificationToken({ _userId: newUser._id, token: crypto.randomBytes(16).toString('hex') });
      await verificationToken.save();

      const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'indomie.orbital@gmail.com',
          clientId: config.GOOGLE_EMAIL.clientId,
          clientSecret: config.GOOGLE_EMAIL.clientSecret,
          refreshToken: config.GOOGLE_EMAIL.refreshToken,
          accessToken,
        },
      });

      const mailOptions = {
        to: newUser.email,
        from: 'indomie.orbital@gmail.com',
        subject: 'Account Verification Token',
        text: `${'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/'}${req.headers.host}\/auth/confirmation\/${verificationToken.token}\n`,
      };

      await smtpTransport.sendMail(mailOptions);

      res.json({
        success: true,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     description: Login
 *     consumes:
 *     - "application/json"
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: The credentials that user have used to register
 *         in: body
 *         schema:
 *          type: object
 *          required:
 *            - email
 *              password
 *          properties:
 *            email:
 *              type: string
 *              example: test@test.com
 *            password:
 *              type: string
 *              example: abc123
 *     responses:
 *        success:
 *         description: A JSON response containing a boolean variable success.
 */
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ googleId: null, facebookId: null, email: req.body.email });

    if (!user) {
      res.json({
        success: false,
        message: 'No such user found',
      });
    } else {
      if (!user.isVerified) {
        res.json({
          success: false,
          message: 'Please activate your account first!',
        });
      }

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

router.get('/confirmation/:token', async (req, res) => {
  try {
    const token = await VerificationToken.findOne({ token: req.params.token });
    if (!token) return res.status(400).send('We were unable to find a valid token. Your token my have expired.');

    const user = await User.findOneAndUpdate({
      _id: token._userId,
    }, {
      $set: {
        isVerified: true,
      },
    }, { returnOriginal: false });

    if (!user) return res.status(400).send('We were unable to find a user for this token.');

    res.status(200).send('The account has been verified. Please log in.');
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

module.exports = router;
