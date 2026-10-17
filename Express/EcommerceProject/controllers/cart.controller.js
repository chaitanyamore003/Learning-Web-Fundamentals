const cartServices = require("../services/cart.service");

const getCartForUser = (req, res) => {
  res.send(cartServices.getCartUser(req.params.userId));
};

const addProductToCart = (req, res) => {
  res.send(cartServices.addProduct(req.params.userId));
};

module.exports = {
  getCartForUser,
  addProductToCart,
};
