const express = require("express");
const cartController = require("../controllers/cart.controller");

const cartRouter = express.Router();

cartRouter.get("/:userId", cartController.getCartForUser);

cartRouter.post("/:userId", cartController.addProductToCart);

module.exports = cartRouter;
