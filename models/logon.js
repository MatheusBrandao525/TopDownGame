const mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var logonSchema = new mongoose.Schema({
  username: String,
  password: String,
  last: Date
});

logonSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Logon", logonSchema);
