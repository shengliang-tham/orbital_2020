const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/config")
const bodyParser = require('body-parser')

//Routes
const auth = require('./routes/auth/auth');
const user = require('./routes/user/user');
const stripe = require('./routes/stripe/stripe')

mongoose.connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(response => {
    console.log("db connected")
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
app.use('/user', user);
app.use('/stripe', stripe)

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log("Server started at " + PORT)
})