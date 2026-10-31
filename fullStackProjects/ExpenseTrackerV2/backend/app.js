const express = require("express");
require("dotenv").config();

const db = require("./utils/database");
const userRouter = require("./routes/user.routes");
const expenseRouter = require("./routes/expense.routes");
const paymentRouter = require("./routes/payment.routes");
const premiumRouter = require("./routes/premium.routes");

const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

require("./models/associations");

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend/views")));

// Payment result page
app.get("/payment-result.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/views/payment-result.html"));
});

// API routes
app.use("/users", userRouter);
app.use("/expenses", expenseRouter);
app.use("/payment", paymentRouter);
app.use("/premium", premiumRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

// Database synchronization
db.sync()
  .then(() => {
    console.log("Database synchronization successful");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database synchronization failed:", err);
  });
