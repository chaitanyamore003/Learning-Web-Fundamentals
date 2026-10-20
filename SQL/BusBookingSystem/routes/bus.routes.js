const express = require("express");
const busController = require("../controller/bus.controller");

const router = express.Router();

router.get("/available/:seats", busController.getAvailableBuses);

router.post("/add", busController.addBus);

module.exports = router;
