const express = require("express");

const orderRouter = express.Router();

orderRouter.get("/", (req, res) => {
  res.send("<h1>Order List</h1>");
});

orderRouter.post("/", (req, res) => {
  res.send("<h1>Order Created</h1>");
});

module.exports = orderRouter;
