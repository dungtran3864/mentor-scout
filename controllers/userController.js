const User = require("../models/user");

const userController = {
  getTeacherById: async (req, res) => {
    try {
      const user = await User.findOne({ role: "teacher", _id: req.params.id });
      res.status(200).send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  getStudentById: async (req, res) => {
    try {
      const user = await User.findOne({ role: "student", _id: req.params.id });
      res.status(200).send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  updateInfo: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          email: req.body.email,
          name: req.body.name,
          birthday: req.body.birthday,
          gender: req.body.gender,
        },
        { returnDocument: "after" }
      );
      res.status(200).send(user);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = userController;
