const express = require("express");
const cors = require("cors");
const auth = require('./routes/auth');
const mongoose = require("mongoose");
const config = require("./config/config")
const bodyParser = require('body-parser')

mongoose.connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, useUnifiedTopology: true,
});
const app = express();
app.use(cors())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
})
app.use(bodyParser.json())

app.use('/auth', auth);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("Server started at " + PORT)
})