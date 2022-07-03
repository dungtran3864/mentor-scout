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
};

module.exports = validation;
