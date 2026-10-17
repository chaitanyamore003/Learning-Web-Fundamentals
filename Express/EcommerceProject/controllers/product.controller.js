const productService = require("../services/product.service");

const getAllProducts = (req, res) => {
  res.sendFile(productService.fetchProducts());
};

const addProduct = (req, res) => {
  let productName = req.body.productName;
  res.send(productService.addProduct(productName));
};

const getProductById = (req, res) => {
  res.send(productService.getProductById(req.params.id));
};

module.exports = {
  getAllProducts,
  addProduct,
  getProductById,
};
