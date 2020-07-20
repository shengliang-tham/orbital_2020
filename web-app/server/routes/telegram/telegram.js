/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const User = require('../../models/user');

router.post('/blast-message', async (req, res) => {

  const users = await User.find({
    telegramId: { $ne: null },
  });

  const bot = req.telegramBot;

  const telegramIds = users.reduce((previous, current) => {
    previous.push(current.telegramId);
    return previous;
  }, []);

  for (id of telegramIds) {
    bot.sendMessage(id, req.body.message);
  }

  res.send('Finishing blasting!!!');
});

module.exports = router;
