const express = require("express");
const userController = require("../controller/user.controller");
const bookingController = require("../controller/bookings.controller");

const router = express.Router();

router.get("/", userController.getUsers);

router.post("/add", userController.addUser);

router.get("/:id/bookings", bookingController.getUserBookings);

module.exports = router;
