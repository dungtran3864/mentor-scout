const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validation = require("../utils/validation");
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const courseController = require("../controllers/courseController");
const reviewController = require("../controllers/reviewController");

router.post(
  "/register",
  [
    check("email")
      .notEmpty()
      .withMessage("Email is missing")
      .isEmail()
      .withMessage("Email is not valid")
      .normalizeEmail(),
    check("name", "Name is missing").notEmpty().trim(),
    check("password", "Password is missing").notEmpty().trim().escape(),
    check("role", "User role cannot be empty").notEmpty().trim(),
    check("gender", "Gender cannot be empty").notEmpty().trim(),
    check("birthday")
      .notEmpty()
      .withMessage("Date cannot be empty")
      .isDate()
      .withMessage("Date is not valid"),
  ],
  validation.validateInput,
  authController.signUp
);

router.post(
  "/login",
  [
    check("email", "Email is missing").notEmpty(),
    check("password", "Password is missing").notEmpty().trim().escape(),
  ],
  validation.validateInput,
  authController.login
);

router.post("/logout", authController.logOut);

router.get("/teacher/:id", userController.getTeacherById);

router.get("/teacher", userController.getTeachers);

router.get(
  "/student/:id",
  validation.checkAuthentication,
  userController.getStudentById
);

router.patch(
  "/user",
  validation.checkAuthentication,
  [
    check("email")
      .notEmpty()
      .withMessage("Email is missing")
      .isEmail()
      .withMessage("Email is not valid")
      .normalizeEmail(),
    check("name", "Name is missing").notEmpty().trim(),
    check("gender", "Gender cannot be empty").notEmpty().trim(),
    check("birthday")
      .notEmpty()
      .withMessage("Date cannot be empty")
      .isDate()
      .withMessage("Date is not valid"),
  ],
  validation.validateInput,
  userController.updateInfo
);

router.delete(
  "/user",
  validation.checkAuthentication,
  userController.deleteAccount
);

router.post(
  "/course",
  validation.checkAuthentication,
  [
    check("name", "Course name cannot be empty").notEmpty().trim(),
    check("capacity", "Capacity cannot be empty").notEmpty(),
  ],
  validation.validateInput,
  validation.validateTeacher,
  courseController.create
);

router.post(
  "/course/enroll/:id",
  validation.checkAuthentication,
  validation.validateStudent,
  courseController.enroll
);

router.get(
  "/user/course",
  validation.checkAuthentication,
  courseController.getCoursesByUser
);

router.patch(
  "/course/:id",
  validation.checkAuthentication,
  [
    check("name", "Name cannot be empty").notEmpty().trim(),
    check("capacity", "Capacity cannot be empty").notEmpty(),
  ],
  validation.validateInput,
  validation.validateTeacher,
  courseController.updateInfo
);

router.get("/course", courseController.getCourses);

router.get("/course/:id", courseController.getCourseById);

router.delete(
  "/course/:id",
  validation.checkAuthentication,
  validation.validateTeacher,
  courseController.deleteCourse
);

router.delete(
  "/course/dropout/:id",
  validation.checkAuthentication,
  validation.validateStudent,
  courseController.dropOut
);

router.get("/review", reviewController.getReviews);

router.post(
  "/review",
  validation.checkAuthentication,
  [
    check("rate", "Rate cannot be empty").notEmpty(),
    check("course_id", "Course_id cannot be empty").notEmpty(),
  ],
  validation.validateInput,
  validation.validateStudent,
  reviewController.create
);

router.delete(
  "/review/:id",
  validation.checkAuthentication,
  validation.validateStudent,
  reviewController.deleteReview
);

module.exports = router;
