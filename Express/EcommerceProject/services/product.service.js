const path = require("path");

const fetchProducts = () => {
  return path.join(
    __dirname,
    "..",
    "views",
    "product",
    "fetchingProducts.html",
  );
};

const addProduct = (productName) => {
  return `<h2>Adding a new product: ${productName}</h2>`;
};

const getProductById = (id) => {
  return `<h2>Fetching product with ID: ${id}</h2>`;
};

module.exports = {
  fetchProducts,
  addProduct,
  getProductById,
};
