const studentController = require("../controllers/student.controller");
const express = require("express");

const router = express.Router();

router.get("/", studentController.getAllStudents);

router.post("/add", studentController.addStudent);

module.exports = router;
