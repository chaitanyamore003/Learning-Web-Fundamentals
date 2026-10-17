const express = require("express");
const bookRouter = express.Router();

bookRouter.get("/", (req, res) => {
  res.send("<h1>Here is the list of books!</h1>");
});

bookRouter.post("/", (req, res) => {
  res.send("<h1>Book has been added!</h1>");
});

module.exports = bookRouter;
