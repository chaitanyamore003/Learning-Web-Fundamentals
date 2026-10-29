const express = require("express");
require("dotenv").config();
const db = require("./utils/database");
const userRouter = require("./routes/user.routes");
const cors = require("cors");
const morgan = require("morgan");

require("./models/user.model");

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", userRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

db.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is running successful on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
