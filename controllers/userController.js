const User = require("../models/user");

const userController = {
  getTeacherById: async (req, res) => {
    try {
      const user = await User.where("role")
        .equals("teacher")
        .where("_id")
        .equals(req.params.id)
      res.status(200).send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  getStudentById: async (req, res) => {
    try {
      const user = await User.where("role")
        .equals("student")
        .where("_id")
        .equals(req.params.id);
      res.status(200).send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};

module.exports = userController;
