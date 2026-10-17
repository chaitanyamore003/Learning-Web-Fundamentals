const express = require("express");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const homeRouter = require("./routes/homeRoutes");
const path = require("path");

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

app.use("/", homeRouter);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "error", "404.html"));
});

app.listen(3000, () => {
  console.log("server is started on http://localhost:3000");
});
