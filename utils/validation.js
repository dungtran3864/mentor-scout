const { validationResult } = require("express-validator");

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
};

module.exports = validation;
