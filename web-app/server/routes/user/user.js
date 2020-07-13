/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcryptjs');
const middleware = require('../middleware/auth');
const { authTypeEmail } = require('../auth/authType');
const User = require('../../models/user');
const { telegramKey } = require('../../config/config');

/**
 * @swagger
 *
 * /user/update-email:
 *   post:
 *     description: To allow existing users to update their email address.
 *     consumes:
 *     - "application/json"
 *     produces:
 *       - application/json
 *     security:
 *      - token: []
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *          type: object
 *          required:
 *            - email
 *          properties:
 *            email:
 *              type: string
 *              example: new@email.com
 *     responses:
 *        success:
 *         description: A JSON response containing a boolean variable success.
 */
router.post('/update-email', middleware.isAuthenticated, async (req, res) => {
  const { authType } = req.decoded;
  let user;
  try {
    if (authType === authTypeEmail) {
      user = await User.findOneAndUpdate({
        _id: new ObjectId(req.decoded.id),
      }, {
        $set: { email: req.body.email },
      }, { returnOriginal: false });
    } else {
      user = await User.findOneAndUpdate({
        [authType]: req.decoded.id,
      }, {
        $set: { email: req.body.email },
      }, { returnOriginal: false });
    }
    res.json({
      success: true,
      user,
    });
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
 * /user/update-password:
 *   post:
 *     description: To allow existing users who registered through email to update their password.
 *     consumes:
 *     - "application/json"
 *     produces:
 *       - application/json
 *     security:
 *      - token: []
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *          type: object
 *          required:
 *            - password
 *          properties:
 *            password:
 *              type: string
 *              example: NewPassword123
 *     responses:
 *        success:
 *         description: A JSON response containing a boolean variable success.
 */
router.post('/update-password', middleware.isAuthenticated, async (req, res) => {
  const { authType } = req.decoded;
  if (authType === authTypeEmail) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    try {
      const user = await User.findOneAndUpdate({
        _id: new ObjectId(req.decoded.id),
      }, { $set: { password: hash } });

      if (user) {
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
  } else {
    res.json({
      success: false,
      message: 'Only can change password using email authentication',
    });
  }
});

/**
 * @swagger
 *
 * /user/retrieve-user:
 *   get:
 *     description: To retrieve user's information from the database.
 *     produces:
 *       - application/json
 *     security:
 *      - token: []
 *     responses:
 *        success:
 *         description: A JSON response containing a boolean variable success and user's data.
 */
router.get('/retrieve-user', middleware.isAuthenticated, async (req, res) => {
  const { authType } = req.decoded;
  let user;

  try {
    if (authType === authTypeEmail) {
      user = await User.findOne({
        _id: new ObjectId(req.decoded.id),
      });
    } else {
      user = await User.findOne({
        [authType]: req.decoded.id,
      });
    }

    res.json({
      success: true,
      user,
    });
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
 * /user/update-balance:
 *   post:
 *     description: To update users' balance. E.g. Top up
 *     consumes:
 *     - "application/json"
 *     produces:
 *       - application/json
 *     security:
 *      - token: []
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *          type: object
 *          required:
 *            - topUpAmount
 *          properties:
 *            topUpAmount:
 *              type: number
 *              minimum: 1
 *              example: 100
 *     responses:
 *        success:
 *         description: A JSON response containing a boolean variable success and user's data.
 */
router.post('/update-balance', middleware.isAuthenticated, async (req, res) => {
  const { authType } = req.decoded;
  let user;

  try {
    if (authType === authTypeEmail) {
      user = await User.findOneAndUpdate({
        _id: new ObjectId(req.decoded.id),
      }, {
        $inc: { accountBalance: (req.body.topUpAmount) / 100 },
      }, { returnOriginal: false });
    } else {
      user = await User.findOneAndUpdate({
        [authType]: req.decoded.id,
      }, {
        $inc: { accountBalance: (req.body.topUpAmount) / 100 },
      }, { returnOriginal: false });
    }

    res.json({
      success: true,
      user,
    });
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
 * /user/withdraw-balance:
 *   post:
 *     description: To update users' balance. E.g. Top up
 *     consumes:
 *     - "application/json"
 *     produces:
 *       - application/json
 *     security:
 *      - token: []
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *          type: object
 *          required:
 *            - withdrawAmount
 *          properties:
 *            topUpAmount:
 *              type: number
 *              minimum: 1
 *              example: 100
 *     responses:
 *        success:
 *         description: A JSON response containing a boolean variable success and user's data.
 */
router.post('/withdraw-balance', middleware.isAuthenticated, async (req, res) => {
  const { authType } = req.decoded;
  let user;

  try {
    if (authType === authTypeEmail) {
      user = await User.findOneAndUpdate({
        _id: new ObjectId(req.decoded.id),
      }, {
        $inc: { accountBalance: -1 * (req.body.withdrawAmount) },
      }, { returnOriginal: false });
    } else {
      user = await User.findOneAndUpdate({
        [authType]: req.decoded.id,
      }, {
        $inc: { accountBalance: -1 * (req.body.withdrawAmount) },
      }, { returnOriginal: false });
    }

    res.json({
      success: true,
      user,
    });
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
 * /user/buy-order:
 *   post:
 *     description: Allows user to create a buy order.
 *     consumes:
 *     - "application/json"
 *     produces:
 *       - application/json
 *     security:
 *      - token: []
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *          type: object
 *          required:
 *            - buyOrder
 *          properties:
 *            ticker:
 *              type: string
 *              example: Z74
 *            unit:
 *              type: integer
 *              example: 1
 *            currentPrice:
 *              type: number
 *              example: 10.0
 *            lotSize:
 *              type: integer
 *              example: 100
 *            totalPrice:
 *              type: integer
 *              example: 100
 *            accountBalance:
 *              type: number
 *              example: 10000
 *     responses:
 *        success:
 *         description: A JSON response containing a boolean variable success and user's data.
 */
router.post('/buy-order', middleware.isAuthenticated, async (req, res) => {
  const { authType } = req.decoded;
  let user;

  try {
    if (authType === authTypeEmail) {
      user = await User.findOne({
        _id: new ObjectId(req.decoded.id),
      });
    } else {
      user = await User.findOne({
        [authType]: req.decoded.id,
      });
    }

    // Insufficient Funds
    if (req.body.totalPrice > user.accountBalance) {
      res.json({
        success: false,
        message: 'Insufficient Funds',
      });
    }

    const transaction = {
      date: new Date(),
      ticker: req.body.ticker,
      units: req.body.unit,
      openPrice: req.body.currentPrice,
      lotSize: req.body.lotSize,
      totalPrice: req.body.totalPrice,
      status: 'open',
    };

    user = await User.findOneAndUpdate({
      _id: user._id,
    }, {
      $inc: {
        accountBalance: -1 * req.body.totalPrice,
      },
      $push: {
        openPosition: transaction,
      },
    }, { returnOriginal: false });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

router.post('/sell-order', middleware.isAuthenticated, async (req, res) => {
  const { authType } = req.decoded;
  let user;

  try {
    if (authType === authTypeEmail) {
      user = await User.findOne({
        _id: new ObjectId(req.decoded.id),
      });
    } else {
      user = await User.findOne({
        [authType]: req.decoded.id,
      });
    }

    const transaction = {
      date: new Date(),
      ticker: req.body.ticker,
      units: req.body.unit,
      openPrice: req.body.openPrice,
      closePrice: req.body.closePrice,
      lotSize: req.body.lotSize,
      totalPrice: req.body.closePrice * req.body.lotSize * req.body.unit,
      gain: req.body.gain,
      status: 'close',
    };

    user = await User.findOneAndUpdate({
      _id: user._id,
    }, {
      $inc: {
        accountBalance: transaction.totalPrice,
      },
      $push: {
        transactionHistory: transaction,
      },
      $pull: {
        openPosition: {
          _id: req.body.selectedInstrumentId,
        },
      },
    }, { returnOriginal: false });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

router.get('/telegram-activate', middleware.isAuthenticated, async (req, res) => {
  const { authType } = req.decoded;

  let user;

  try {
    if (authType === authTypeEmail) {
      user = await User.findOne({
        _id: new ObjectId(req.decoded.id),
      });
    } else {
      user = await User.findOne({
        [authType]: req.decoded.id,
      });
    }

    const url = `https://telegram.me/IndomieOrbitalBot?start=${user._id}`;
    res.json(url);
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

module.exports = router;
