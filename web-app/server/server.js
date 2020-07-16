const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const asyncify = require('express-asyncify');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config');
const User = require('./models/user');

const PORT = process.env.PORT || 5000;
const telegramToken = config.telegramKey;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Indomie Backend API',
      version: '1.0.0',
    },
    servers: [`http://localhost:${PORT}`],
    securityDefinitions: {
      token: {
        type: 'apiKey',
        in: 'authorization',
        name: 'authorization',
      },
    },
  },
  apis: ['./routes/**/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const bot = new TelegramBot(telegramToken, { polling: true });

/**
 * Importing routes
 */
const auth = require('./routes/auth/auth');
const user = require('./routes/user/user');
const stripe = require('./routes/stripe/stripe');
const telegram = require('./routes/telegram/telegram');

const app = asyncify(express());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * Configuring cors for all endpoints
 */
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  req.telegramBot = bot;
  next();
});

app.use(bodyParser.json());

app.use('/auth', auth);
app.use('/user', user);
app.use('/stripe', stripe);
app.use('/telegram', telegram);

let mongoUrl = config.mongoURL;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
  });
} else {
  mongoUrl = config.mongoURL_DEV;
}

/**
 * Connecting to mlab db
 */
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => {
  console.log('db connected');
});

app.listen(PORT, () => {
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (msg.text.includes('/start')) {
      const userId = msg.text.substring(7);
      console.log(userId);
      if (userId) {
        const user = await User.findOneAndUpdate({
          _id: userId,
        }, {
          $set: {
            telegramId: msg.from.id,
          },
        });
        bot.sendMessage(chatId, `Hello ${msg.chat.username}, your account has been linked !`);
      } else {
        bot.sendMessage(chatId, `Hello ${msg.chat.username}, please click through the application to link your account!`);
      }
    }
    console.log(msg)
    // send a message to the chat acknowledging receipt of their message
    // bot.sendMessage(chatId, 'Received your message');
  });
  console.log(`Server started at ${PORT}`);
});
