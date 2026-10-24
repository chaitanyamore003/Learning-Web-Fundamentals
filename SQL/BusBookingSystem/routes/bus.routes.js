const express = require("express");
const busController = require("../controller/bus.controller");
const bookingController = require("../controller/bookings.controller");

const router = express.Router();

router.get("/available/:seats", busController.getAvailableBuses);

router.post("/add", busController.addBus);

router.get("/:id/bookings", bookingController.getBusBookings);

module.exports = router;
