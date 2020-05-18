let mongoose = require('mongoose');

//Define a schema
let Schema = mongoose.Schema;
let UserModelSchema = new Schema({
    email: String,
});

module.exports = UserModelSchema;