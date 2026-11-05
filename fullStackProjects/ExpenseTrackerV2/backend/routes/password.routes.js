const express = require("express");
const passwordController = require("../controllers/password.controller");
const router = express.Router();

router.post("/forgotpassword", passwordController.forgotPassword);
router.get("/resetpassword/:id", passwordController.resetPassword);
router.post("/update/:id", passwordController.updatePassword);

module.exports = router;
