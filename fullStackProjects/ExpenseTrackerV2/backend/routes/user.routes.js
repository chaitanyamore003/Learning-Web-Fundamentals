const express = require("express");
const userController = require("../controllers/user.controller");
const authenticateUser = require("../middlewares/auth");
const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/getAllUsers",authenticateUser, userController.getUsers);
router.get("/me",authenticateUser, userController.getMe);

module.exports = router;
