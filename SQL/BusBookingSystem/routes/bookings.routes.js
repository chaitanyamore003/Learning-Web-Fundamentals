const express = require("express");
const bookingsController = require("../controller/bookings.controller");
const router = express.Router();

router.post("/", bookingsController.createBooking);

router.get("/:id/bookings", bookingsController.getUserBookings);

router.get("/:id/bookings", bookingsController.getBusBookings);

module.exports = router;
