const express = require("express");
const { initializeDatabase } = require("./database");
const studentRouter = require("./routes/student.routes");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/students", studentRouter);

initializeDatabase((err) => {
  if (err) {
    console.error("Database initialization failed:", err.message);
    return;
  }

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
