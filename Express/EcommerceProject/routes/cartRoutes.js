const express = require("express");

const cartRouter = express.Router();

cartRouter.get("/:userId", (req, res) => {
  res.send(`<h2>Fetching cart for user with ID: ${req.params.userId}</h2>`);
});

cartRouter.post("/:userId", (req, res) => {
  res.send(
    `<h2>Adding product to cart for user with ID: ${req.params.userId}</h2>`,
  );
});

module.exports = cartRouter;
