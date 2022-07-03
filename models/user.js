const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");
const {USER_ROLES} = require("../utils/constants");

const User = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    require: true,
  },
  birthday: {
    type: Date,
    require: true,
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

User.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const UserModel = mongoose.model("User", User);

passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

module.exports = UserModel;
