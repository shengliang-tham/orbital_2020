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
    },
    transactionHistory: [{
        date: Date,
        ticker: String,
        units: Number,
        price: Number,
        lotSize: Number,
        totalPrice: Number
    }]
})

let User = mongoose.model('User', userSchema)

module.exports = User;