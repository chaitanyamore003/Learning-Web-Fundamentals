const express = require("express");
const bookingsController = require("../controller/bookings.controller");
const router = express.Router();

router.post("/create", bookingsController.createBooking);

module.exports = router;
