const express = require("express");
const passwordController = require("../controllers/password.controller");
const router = express.Router();

router.post("/forgotpassword", passwordController.forgotPassword);
router.get("/resetpassword/:id", passwordController.resetPassword);

module.exports = router;
