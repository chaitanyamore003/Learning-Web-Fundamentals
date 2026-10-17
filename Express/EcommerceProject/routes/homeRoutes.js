const express = require("express");

const homeRouter = express.Router();

homeRouter.get("/", (req, res) => {
  res.send(`<h1>Welcome to Ecommerce Project</h1><br>
            <h2>use below links for navigation</h2><hr>
                <a href="/users">Users</a><br>
                <a href="/products">Products</a><br>
                <a href="/cart">Cart</a> <h3>to use cart routes make sure to provide id in req paramater</h3><br>`);
});

module.exports = homeRouter;
