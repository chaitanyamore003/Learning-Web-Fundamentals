const attendanceController = require("../controllers/attendence.controller");
const express = require("express");

const router = express.Router();

router.get("/report", attendanceController.getAttendanceReport);

router.get("/:date", attendanceController.getAttendanceByDate);

router.post("/mark", attendanceController.markAttendance);

module.exports = router;
