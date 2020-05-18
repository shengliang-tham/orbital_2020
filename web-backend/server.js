const express = require("express");
const cors = require("cors");
const auth = require('./routes/auth');
const mongoose = require("mongoose");
const config = require("./config/config")

mongoose.connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, useUnifiedTopology: true,
});
const app = express();
app.use(cors())

app.use('/auth', auth);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("Server started at " + PORT)
})