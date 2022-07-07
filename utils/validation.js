const { validationResult } = require("express-validator");
const { USER_ROLES } = require("./constants");

const validation = {
  validateInput: (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).send({ errors: error.array() });
    } else {
      return next();
    }
  },
  checkAuthentication: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send("Access denied");
  },
  isQueryParamOmitted: (param) => {
    return !param || param === "";
  },
  validateStudent: (req, res, next) => {
    if (req.user.role !== USER_ROLES.STUDENT) {
      return res
        .status(403)
        .send(
          "You're not a student. Only students are allowed to perform this action."
        );
    } else {
      return next();
    }
  },
  validateTeacher: (req, res, next) => {
    if (req.user.role !== USER_ROLES.TEACHER) {
      return res
        .status(403)
        .send(
          "You're not a teacher. Only teachers are allowed to perform this action."
        );
    } else {
      return next();
    }
  },
};

module.exports = validation;
