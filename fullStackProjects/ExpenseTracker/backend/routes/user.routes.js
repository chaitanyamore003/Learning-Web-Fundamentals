const express = require("express");
const userController = require("../controller/user.controller");

const router = express.Router();

router.get("/", userController.getUsers);

router.post("/add", userController.addUser);

module.exports = router;
