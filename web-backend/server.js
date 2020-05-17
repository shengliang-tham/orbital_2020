const express = require("express");
const cors = require("cors");
const auth = require('./routes/auth');

const app = express();
app.use(cors())

app.use('/auth', auth);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("Server started at " + PORT)
})