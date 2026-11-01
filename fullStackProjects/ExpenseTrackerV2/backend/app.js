const express = require("express");
require("dotenv").config();

const db = require("./utils/database");
const userRouter = require("./routes/user.routes");
const expenseRouter = require("./routes/expense.routes");
const paymentRouter = require("./routes/payment.routes");
const premiumRouter = require("./routes/premium.routes");
const passwordRouter = require("./routes/password.routes");

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
app.use(express.static(path.join(__dirname, "../frontend")));

// Payment result page
app.get("/payment-result.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/views/payment-result.html"));
});

// Frontend pages
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/views/login.html"));
});

app.get("/home.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/views/home.html"));
});

app.get("/dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/views/dashboard.html"));
});

// Signup page
app.get("/signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/views/signup.html"));
});

// API routes
app.use("/users", userRouter);
app.use("/expenses", expenseRouter);
app.use("/payment", paymentRouter);
app.use("/premium", premiumRouter);
app.use("/password", passwordRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

// Database synchronization
db.sync({ force: false })
  .then(() => {
    console.log("Database synchronization successful");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database synchronization failed:", err);
  });
