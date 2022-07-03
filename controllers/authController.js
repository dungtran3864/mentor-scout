const passport = require("passport");
const User = require("../models/user");

const authController = {
  signUp: async (req, res) => {
    User.register(
      new User({ email: req.body.email, role: req.body.role }),
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
    passport.authenticate("local")(req, res, function () {
      res.send(req.user);
    });
  },
};

module.exports = authController;
