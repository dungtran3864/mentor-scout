const passport = require("passport");
const User = require("../models/user");

const authController = {
  signUp: async (req, res) => {
    User.register(
      new User({
        email: req.body.email,
        role: req.body.role,
        name: req.body.name,
        birthday: req.body.birthday,
      }),
      req.body.password,
      (err) => {
        if (err) {
          res.status(400).send(err);
          return;
        }
        passport.authenticate("local")(req, res, function () {
          res.status(200).send("User signed up successfully");
        });
      }
    );
  },
  login: (req, res) => {
    req.body.email = req.body.email.toLowerCase();
    passport.authenticate("local")(req, res, function () {
      res.send(req.user);
    });
  },
  logOut: async (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).send("User logged out successfully");
    });
  },
};

module.exports = authController;
