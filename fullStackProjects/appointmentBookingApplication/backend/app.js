const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
require("dotenv").config();
require("./models/user.model");
const db = require("./utils/db-connection");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes here
app.use("/users", userRouter);

db.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is started on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
