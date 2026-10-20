const express = require("express");
const studentController = require("../controller/student.controller");

const router = express.Router();

router.get("/", studentController.getStudents);

router.post("/add", studentController.addStudent);

router.get("/:id", studentController.getStudentById);

router.put("/update/:id", studentController.updateStudentById);

router.delete("/delete/:id", studentController.deleteStudentById);

module.exports = router;
