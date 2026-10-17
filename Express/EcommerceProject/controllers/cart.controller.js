const getCartForUser = (req, res) => {
  res.send(`<h2>Fetching cart for user with ID: ${req.params.userId}</h2>`);
};

const addProductToCart = (req, res) => {
  res.send(
    `<h2>Adding product to cart for user with ID: ${req.params.userId}</h2>`,
  );
};

module.exports = {
  getCartForUser,
  addProductToCart,
};
