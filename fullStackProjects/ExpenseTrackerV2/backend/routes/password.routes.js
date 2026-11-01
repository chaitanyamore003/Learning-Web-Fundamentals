const express = require("express");
const passwordController = require("../controllers/password.controller");
const router = express.Router();

router.post("/forgotpassword", passwordController.forgotPassword);
router.post("/updatepassword", passwordController.updatePassword);

module.exports = router;
