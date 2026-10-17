const express = require("express");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send(`<h2>Fetching all users</h2>`);
});

userRouter.post("/", (req, res) => {
  res.send(`<h2>Adding a new user</h2>`);
});

userRouter.get("/:id", (req, res) => {
  res.send(`<h2>Fetching user with ID: ${req.params.id}</h2>`);
});

module.exports = userRouter;
