const express = require("express");
const productController = require("../controllers/product.controller");

const productRouter = express.Router();

productRouter.get("/", productController.getAllProducts);

productRouter.post("/", productController.addProduct);

productRouter.get("/:id", productController.getProductById);

module.exports = productRouter;
