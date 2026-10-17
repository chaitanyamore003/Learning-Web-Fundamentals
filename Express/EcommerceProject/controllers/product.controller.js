const productService = require("../services/product.service");
const sendErrResponse = require("../utils/response");

const getAllProducts = (req, res) => {
  res.sendFile(productService.fetchProducts());
};

const addProduct = (req, res) => {
  let productName = req.body.productName;

  productName = false;
  if (!productName) {
    return sendErrResponse(res, {
      message: "Product Name not found",
      statusCode: 404,
    });
  }
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
