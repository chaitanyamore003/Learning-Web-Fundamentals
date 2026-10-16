const express = require("express");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("<h1>User List</h1>");
});

userRouter.post("/", (req, res) => {
  res.send("<h1>User Created</h1>");
});

module.exports = userRouter;
