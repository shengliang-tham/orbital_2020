const mongoose = require("mongoose");
let userSchema = mongoose.Schema({
    email: String,
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
    }
})

let User = mongoose.model('User', userSchema)

module.exports = User;