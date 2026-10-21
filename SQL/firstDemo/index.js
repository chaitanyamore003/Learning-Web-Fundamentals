const express = require("express");
const db = require("./utils/db-connection");
const studentRouter = require("./routes/student.routes");
const studentModel = require("./models/students");
const app = express();
require("dotenv").config();

app.use(express.json());

app.use("/students", studentRouter);

app.use("/", (req, res) => {
  res.send("<h1>HI There</h1>");
});

db.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is started on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
