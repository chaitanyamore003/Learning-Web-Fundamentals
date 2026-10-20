const express = require("express");
const studentRouter = express.Router();
const studentController = require("../controller/student.controller");

studentRouter.post("/add", studentController.addEntry);
studentRouter.put("/update/:id", studentController.updateEntry);
studentRouter.delete("/delete/:id", studentController.deleteEntry);

module.exports = studentRouter;
