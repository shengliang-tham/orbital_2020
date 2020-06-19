const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const asyncify = require('express-asyncify');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config/config');

const PORT = process.env.PORT || 5000;

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

/**
 * Importing routes
 */
const auth = require('./routes/auth/auth');
const user = require('./routes/user/user');
const stripe = require('./routes/stripe/stripe');

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
  next();
});

app.use(bodyParser.json());

/**
 * @swagger
 *
 * /login:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
app.use('/auth', auth);
app.use('/user', user);
app.use('/stripe', stripe);

let mongoUrl = config.mongoURL;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
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
  console.log(`Server started at ${PORT}`);
});
