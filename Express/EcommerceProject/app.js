const express = require("express");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const homeRouter = require("./routes/homeRoutes");

const app = express();

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);

app.use("/", homeRouter);

app.use((req, res) => {
  res.status(404).send(`<h1>Error 404 Page Not Found</h1><br>
                            <h2>The page you are looking for does not exists</h2><hr>
                            <a href="/">Return Home</a>`);
});

app.listen(3000, () => {
  console.log("server is started on http://localhost:3000");
});
