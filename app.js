const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

// 404 - Not Found Fallback
app.use(function (req, res, next) {
  res.send("Unknown resource: " + req.path);
});
// Uncaught Error Fallback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
