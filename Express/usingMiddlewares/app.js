const express = require("express");
const app = express();

//middleware for adding new property to request object
app.use((req, res, next) => {
  req.user = "Guest";
  next();
});

//middleware for route /welcome
app.get("/welcome", (req, res) => {
  res.send(`Welcome, ${req.user}!`);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
