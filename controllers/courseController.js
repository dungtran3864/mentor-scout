const Course = require("../models/course");
const { USER_ROLES } = require("../utils/constants");

const courseController = {
  create: async (req, res) => {
    try {
      const course = new Course({
        name: req.body.name,
        description: req.body.description,
        teacher: req.user.id,
        capacity: req.body.capacity,
      });
      await course.save();
      res.status(200).send(course);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  enroll: async (req, res) => {
    const course = await Course.findCourseById(req.params.id);
    if (course) {
      try {
        if (course.students.length >= course.capacity) {
          return res.status(500).send("This course is already full");
        }
        if (course.students.includes(req.user.id)) {
          return res.status(500).send("Student already enrolls in this course");
        }
        course.students.push(req.user.id);
        await course.save();
        res.status(200).send("Enrolled in this course successfully");
      } catch (err) {
        res.status(500).send(err);
      }
    } else {
      res.status(404).send("Course does not exist");
    }
  },
  getCoursesByUser: async (req, res) => {
    const field = req.user.role === USER_ROLES.STUDENT ? "students" : "teacher";
    try {
      const courses = await Course.where(field)
        .equals(req.user.id)
        .populate("teacher")
        .populate("students");
      res.status(200).send(courses);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getCourses: async (req, res) => {
    try {
      const courses = await Course.find()
        .populate("teacher")
        .populate("students");
      res.status(200).send(courses);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  updateInfo: async (req, res) => {
    try {
      const course = await Course.findOne({
        _id: req.params.id,
        teacher: req.user.id,
      });
      if (!course) {
        res.status(404).send("You don't have this course");
      } else {
        course.name = req.body.name;
        course.description = req.body.description;
        course.capacity = req.body.capacity;
        await course.save();
        res.status(200).send(course);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  deleteCourse: async (req, res) => {
    const course = await Course.findOne({
      _id: req.params.id,
      teacher: req.user.id,
    });
    if (course) {
      await course.remove();
      res.status(200).send("Deleted course successfully");
    } else {
      res.status(403).send("You don't have this course");
    }
  },
  dropOut: async (req, res) => {
    try {
      const course = await Course.findOne({ _id: req.params.id, students: req.user.id });
      if (course) {
        const index = course.students.indexOf(req.user.id);
        course.students.splice(index, 1);
        await course.save();
        res.status(200).send("Dropout this course successfully");
      } else {
        res.status(403).send("You don't have this course");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = courseController;
