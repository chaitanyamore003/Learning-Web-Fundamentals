const express = require("express");

const productRouter = express.Router();

productRouter.get("/", (req, res) => {
  res.send(`<h2>Fetching all products</h2>`);
});

productRouter.post("/", (req, res) => {
  res.send(`<h2>Adding a new product</h2>`);
});

productRouter.get("/:id", (req, res) => {
  res.send(`<h2>Fetching product with ID: ${req.params.id}</h2>`);
});

module.exports = productRouter;
