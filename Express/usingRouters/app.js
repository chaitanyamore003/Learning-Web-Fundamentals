const express = require("express");
const app = express();

const userRouter = require("./user.routes");
const orderRouter = require("./orders.routes");

app.use("/users", userRouter);
app.use("/orders", orderRouter);

app.use((req, res) => {
  res.status(404).send(`<h1>404 Not Found</h1>`);
});

app.listen(3000, () => {
  console.log("Server is up and running on port 3000, http://localhost:3000");
});
