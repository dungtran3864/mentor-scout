const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");

const User = new mongoose.Schema({
  role: {
    type: String,
  },
});

User.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const UserModel = mongoose.model("User", User);

passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

module.exports = UserModel;

