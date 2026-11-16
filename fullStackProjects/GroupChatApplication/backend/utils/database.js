const express = require("express");
const userController = require("");

const router = express.Router();

router.get("/signup");

router.post("/login");

module.exports = router;
