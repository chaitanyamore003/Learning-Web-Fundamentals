const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to the Home Page</h1><br>
        <h2>use below links for navigation</h2><hr>
        <a href="/orders">Orders</a><br>
        <a href="/users">Users</a><br>`);
});

app.get("/orders", (req, res) => {
  res.send("<h1>Welcome to the Orders Page</h1>");
});

app.get("/users", (req, res) => {
  res.send("<h1>Welcome to the Users Page</h1>");
});

app.post("/orders", (req, res) => {
  res.send("<h1>Order has been placed successfully!</h1>");
});

app.post("/users", (req, res) => {
  res.send("<h1>User has been created successfully!</h1>");
});

app.use("*", (req, res) => {
  res
    .status(404)
    .send(
      `<h1>404 Not Found</h1><br>
      <h2>The page you are looking for does not exist.</h2><br>
      <a href='/'>Go back to Home Page</a>`
    );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000, http://localhost:3000");
});
