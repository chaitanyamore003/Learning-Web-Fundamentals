const fetchProducts = (req, res) => {
  res.send(`<h2>Fetching all products</h2>`);
};

const addProduct = (req, res) => {
  res.send(`<h2>Adding a new product</h2>`);
};

const getProductById = (req, res) => {
  res.send(`<h2>Fetching product with ID: ${req.params.id}</h2>`);
};

module.exports = {
  fetchProducts,
  addProduct,
  getProductById,
};
