const mongoose = require("mongoose");

const Course = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

Course.statics.findCourseById = function (id) {
  return this.findById(id);
};

module.exports = mongoose.model("Course", Course);
