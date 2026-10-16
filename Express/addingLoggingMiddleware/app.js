const express = require("express");
const app = express();

// Middleware to log request details
app.use((req, res, next) => {
  console.log(`${req.method} request made to ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to the Home Page</h1><br>
        <h2>use below links for navigation</h2><hr>
        <a href="/products">Products</a><br>
        <a href="/categories">Categories</a><br>`);
});

app.get("/products", (req, res) => {
  res.send("<h1>Here is the list of all products.</h1>");
});

app.get("/categories", (req, res) => {
  res.send("<h1>Here is the list of all categories.</h1>");
});

app.post("/products", (req, res) => {
  res.send("<h1>A new product has been added.</h1>");
});

app.post("/categories", (req, res) => {
  res.send("<h1>A new category has been created.</h1>");
});

app.listen(3000, () => {
  console.log("Server is up and running on port 3000, http://localhost:3000");
});
