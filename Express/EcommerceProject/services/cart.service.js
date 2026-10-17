const getCartUser = (id) => {
  return `<h2>Fetching cart for user with ID: ${id}</h2>`;
};

const addProduct = (id) => {
  return `<h2>Adding product to cart for user with ID: ${id}</h2>`;
};

module.exports = {
  getCartUser,
  addProduct,
};
