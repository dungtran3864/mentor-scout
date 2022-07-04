const Course = require("../models/course");
const User = require("../models/user");
const { USER_ROLES } = require("../utils/constants");

const courseController = {
  create: async (req, res) => {
    if (req.user.role !== USER_ROLES.TEACHER) {
      return res
        .status(403)
        .send(
          "You're not a teacher. Only teachers are allowed to create courses."
        );
    }
    try {
      const course = new Course({
        name: req.body.name,
        description: req.body.description,
        teacher: req.user.id,
      });
      await course.save();
      User.findByIdAndUpdate(
        req.user.id,
        { $push: { courses: course } },
        (err) => {
          if (err) {
            res
              .status(500)
              .send("Failed to add course to teacher's teaching list");
          }
          res.status(200).send(course);
        }
      );
    } catch (err) {
      res.status(500).send("Failed to create course");
    }
  },
};

module.exports = courseController;
