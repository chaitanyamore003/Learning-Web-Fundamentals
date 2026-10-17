const express = require("express");
const userController = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.get("/", userController.getAllUsers);

userRouter.post("/", userController.addUser);

userRouter.get("/:id", userController.getUserById);

module.exports = userRouter;
