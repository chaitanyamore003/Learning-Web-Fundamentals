const express = require("express");
const db = require("./utils/database");
require("dotenv").config();
require("./models/index");

const app = express();

db.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running successfully on port: ${process.env.PORT}`,
      );
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
