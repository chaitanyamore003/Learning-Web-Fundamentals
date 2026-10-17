const fetchProducts = () => {
  return `<h2>Fetching all products</h2>`;
};

const addProduct = () => {
  return `<h2>Adding a new product</h2>`;
};

const getProductById = (id) => {
  return `<h2>Fetching product with ID: ${id}</h2>`;
};

module.exports = {
  fetchProducts,
  addProduct,
  getProductById,
};
