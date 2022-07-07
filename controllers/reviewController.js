const Review = require("../models/review");
const Course = require("../models/course");
const validation = require("../utils/validation");

const reviewController = {
  getReviews: async (req, res) => {
    const filter = {};
    if (!validation.isQueryParamOmitted(req.query.teacher_id)) {
      filter["teacher"] = req.query.teacher_id;
    }
    if (!validation.isQueryParamOmitted(req.query.course_id)) {
      filter["course"] = req.query.course_id;
    }
    if (!validation.isQueryParamOmitted(req.query.posted_by)) {
      filter["posted_by"] = req.query.posted_by;
    }
    try {
      const reviews = await Review.find(filter)
        .populate("teacher")
        .populate("course")
        .populate("posted_by");
      res.status(200).send(reviews);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  create: async (req, res) => {
    const course = await Course.findOne({
      students: req.user.id,
      _id: req.body.course_id,
    });
    if (!course) {
      return res
        .status(403)
        .send("You haven't taken this course with this teacher");
    }
    try {
      const review = new Review({
        rate: req.body.rate,
        description: req.body.description,
        teacher: course.teacher,
        course: req.body.course_id,
        posted_by: req.user.id,
      });
      await review.save();
      res.status(200).send(review);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  deleteReview: async (req, res) => {
    try {
      const review = await Review.findOne({
        _id: req.params.id,
        posted_by: req.user.id,
      });
      if (review) {
        review.remove();
        res.status(200).send("Deleted review successfully");
      } else {
        res.status(403).send("You don't have this review");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = reviewController;
