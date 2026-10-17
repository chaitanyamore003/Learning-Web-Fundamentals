const productService = require("../services/product.service");

const getAllProducts = (req, res) => {
  res.send(productService.fetchProducts());
};

const addProduct = (req, res) => {
  res.send(productService.addProduct());
};

const getProductById = (req, res) => {
  res.send(productService.getProductById(req.params.id));
};

module.exports = {
  getAllProducts,
  addProduct,
  getProductById,
};
