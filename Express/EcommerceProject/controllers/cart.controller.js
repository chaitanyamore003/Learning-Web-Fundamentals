const getCartItems = (req, res) => {
  res.send(`<h2>Fetching cart for user with ID: ${req.params.userId}</h2>`);
};

const addCartItems = (req, res) => {
  res.send(
    `<h2>Adding product to cart for user with ID: ${req.params.userId}</h2>`,
  );
};

module.exports = {
  getCartItems,
  addCartItems,
};
