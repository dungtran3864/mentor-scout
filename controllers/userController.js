const User = require("../models/user");
const { USER_ROLES } = require("../utils/constants");
const Course = require("../models/course");
const Review = require("../models/review");
const _get = require("lodash/get");

const userController = {
  getTeacherById: async (req, res) => {
    try {
      const result = await Promise.all([
        User.findOne({ role: "teacher", _id: req.params.id }).lean(),
        Course.find({ teacher: req.params.id }).lean(),
      ]);
      const [user, courses] = result;
      user.courses = courses;
      res.status(200).send(user);
    } catch (err) {
      res.status(500).send(err);
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
  deleteAccount: async (req, res) => {
    if (req.user.role === USER_ROLES.STUDENT) {
      try {
        await User.deleteOne({ _id: req.user.id }); // delete account
        await Course.updateMany(
          {},
          {
            $pull: {
              students: req.user.id,
            },
          }
        ); // remove student from enrolled courses
        res.status(200).send("Deleted account successfully");
      } catch (err) {
        res.status(500).send(err);
      }
    } else {
      try {
        await User.deleteOne({ _id: req.user.id }); // delete account
        await Course.deleteMany({ teacher: req.user.id }); // delete all courses taught by this teacher
        await Review.deleteMany({ teacher: req.user.id }); // delete all reviews on courses taught by this teacher
        res.status(200).send("Deleted account successfully");
      } catch (err) {
        res.status(500).send(err);
      }
    }
  },
  getTeachers: async (req, res) => {
    try {
      const search = _get(req, "query.search", "");
      const courses = await User.find({
        name: { $regex: search, $options: "i" },
        role: "teacher",
      });
      res.status(200).send(courses);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = userController;
