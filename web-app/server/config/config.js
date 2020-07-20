const FACEBOOK = {
  clientID: '489259241767234',
  clientSecret: 'c50d886c4384b911b8f3bdd63b591659',
};
const GOOGLE = {
  clientID: '902651506561-nlab1nfqfqg6jeo4o83fsto1pdvvahj2.apps.googleusercontent.com',
  clientSecret: 'YW6ZyiRTfyP2cJIHP7UTniBm',
};

const mongoURL_DEV = 'mongodb://shengliang:asd123asd@ds239936.mlab.com:39936/orbital-dev';
const mongoURL = 'mongodb://shengliang:asd123asd@ds029106.mlab.com:29106/orbital';

const telegramKey = '1296018483:AAEVNfj_Q2GDeG9MVyqUCh57yXDXeB9_iyI';
const sendGrid = {
  username: 'app172678223@heroku.com',
  password: 'bcxvl3in0954',
};

const GOOGLE_EMAIL = {
  clientId: '414732273480-qgk7n94234fi2e3vfo3c50inritqhd93.apps.googleusercontent.com',
  clientSecret: 'B8PRebcvLEijDF4EtaK9c-SN',
  refreshToken: '1//04ouQKgmW9ZcnCgYIARAAGAQSNwF-L9Iryu0XlMFnQykZi8Mvl5QuOeF5S-ytMDsNvTnusmlMUpyxegsaMqDXf1cmds_-Uo34HfM',
};

const sendGridHeroku = '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';

module.exports = {
  FACEBOOK,
  GOOGLE,
  mongoURL,
  secretKey: 'Orbital2020',
  mongoURL_DEV,
  sendGrid,
  telegramKey,
  sendGridHeroku,
  GOOGLE_EMAIL,
};
