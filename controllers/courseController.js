const Course = require("../models/course");
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
        capacity: req.body.capacity,
      });
      await course.save();
      res.status(200).send(course);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  enroll: async (req, res) => {
    if (req.user.role !== USER_ROLES.STUDENT) {
      return res
        .status(403)
        .send(
          "You're not a student. Only students are allowed to enroll in courses."
        );
    }
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
      const courses = await Course.find();
      res.status(200).send(courses);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  updateInfo: async (req, res) => {
    if (req.user.role === USER_ROLES.STUDENT) {
      return res
        .status(403)
        .send(
          "You're not a teacher. Only teachers can update the course's information"
        );
    }
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
};

module.exports = courseController;
