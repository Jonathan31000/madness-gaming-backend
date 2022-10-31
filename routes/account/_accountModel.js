var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var Account = new Schema({
  username: {
    required: true,
    type: String,
  },
  firstname: {
    required: true,
    type: String,
  },
  lastname: {
    required: true,
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  lastConnection: {
    type: Date,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profilePicturePath: {
    type: String,
    default: "default-user-photo.png",
  },
  role: {
    type: String,
    enum: ["super-admin", "admin", "user"],
    default: "user",
  },
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model("accounts", Account);