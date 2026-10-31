const express = require("express");
const premiumController = require("../controllers/premium.controller");
const authenticateUser = require("../middlewares/auth");

const router = express.Router();

router.get(
  "/getLeaderboard",
  authenticateUser,
  premiumController.getLeaderboard,
);

module.exports = router;
