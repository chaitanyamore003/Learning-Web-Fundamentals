const express = require("express");
const cartController = require("../controllers/cart.controller");

const cartRouter = express.Router();

cartRouter.get("/:userId", cartController.getCartItems);

cartRouter.post("/:userId", cartController.addCartItems);

module.exports = cartRouter;
