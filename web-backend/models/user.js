const mongoose = require("mongoose");
let userSchema = mongoose.Schema({
    email: String,
    password: {
        type: String,
        default: null
    },
    facebookId: {
        type: String,
        default: null
    },
    googleId: {
        type: String,
        default: null
    },
    created: {
        type: Date,
        default: Date.now
    },
    accountBalance: {
        type: Number,
        default: 0
    }
})

let User = mongoose.model('User', userSchema)

module.exports = User;