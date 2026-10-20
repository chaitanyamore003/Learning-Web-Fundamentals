const express = require("express");
const db = require("./utils/db-connection");
const studentRouter = require("./routes/student.routes");
const app = express();
require("dotenv").config();

app.use(express.json());

app.use("/students", studentRouter);

app.use("/", (req, res) => {
  res.send("<h1>HI There</h1>");
});

app.listen(process.env.PORT, () => {
  console.log(`server is started on http://localhost:${process.env.PORT}`);
});
