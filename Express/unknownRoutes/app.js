const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to the Home Page</h1><br>
        <h2>use below links for navigation</h2><hr>
        <a href="/products">Products</a><br>
        <a href="/categories">Categories</a><br>`);
});

app.get("/products", (req, res) => {
  res.send("<h1>Welcome to the Products Page</h1>");
});

app.get("/categories", (req, res) => {
  res.send("<h1>Welcome to the Categories Page</h1>");
});

app.post("/products", (req, res) => {
  res.send("<h1>Product has been added successfully!</h1>");
});

app.post("/categories", (req, res) => {
  res.send("<h1>Category has been added successfully!</h1>");
});

app.use((req, res) => {
  res.status(404).send(
    `<h1>404 Not Found</h1>
     <h2>The page you are looking for does not exist.</h2>
     <a href="/">Go back to Home Page</a>`,
  );
});

app.listen(4000, () => {
  console.log("Server is up and running on port 4000, http://localhost:4000");
});
