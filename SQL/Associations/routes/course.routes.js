const express = require("express");
const courseController = require("../controller/course.controller");

const courseRouter = express.Router();

courseRouter.post("/add", courseController.addCourse);
courseRouter.post("/addStudentCourses", courseController.addStudentsToCourses);

module.exports = courseRouter;
