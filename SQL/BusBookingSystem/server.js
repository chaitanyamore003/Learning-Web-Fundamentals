require("dotenv").config();

const express = require("express");
const { initializeDatabase } = require("./database");
const userRouter = require("./routes/user.routes");
const busRouter = require("./routes/bus.routes");

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/buses", busRouter);

initializeDatabase((err) => {
  if (err) {
    console.error("Database initialization failed:", err.message);
    return;
  }

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
