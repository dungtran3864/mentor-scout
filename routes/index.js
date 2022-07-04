const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validation = require("../utils/validation");
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const courseController = require("../controllers/courseController");

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

router.get(
  "/student/:id",
  validation.checkAuthentication,
  userController.getStudentById
);

router.post(
  "/course",
  validation.checkAuthentication,
  [
    check("name", "Course name cannot be empty").notEmpty().trim(),
    check("capacity", "Capacity cannot be empty").notEmpty(),
  ],
  validation.validateInput,
  courseController.create
);

router.patch(
  "/course/enroll/:id",
  validation.checkAuthentication,
  courseController.enroll
);

router.get(
  "/course/user",
  validation.checkAuthentication,
  courseController.getCoursesByUser
);

router.get("/course", courseController.getCourses);

module.exports = router;
