const express = require("express");
const cors = require("cors");
const db = require("./database");
require("dotenv").config();

//importing models
require("./models/associations");

//importing routers
const userRouter = require("./routes/user.routes");
const expenseRouter = require("./routes/expense.routes");

const app = express();

//open for all
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/expenses", expenseRouter);

app.use((req, res) => {
  res.json({
    message: "404 NOT FOUND",
  });
});

db.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server is running successfully");
    });
  })
  .catch((err) => {
    console.log(err);
  });
