const express = require("express");
require("dotenv").config();

const db = require("./utils/database");

// Routes
const userRouter = require("./routes/user.routes");
const expenseRouter = require("./routes/expense.routes");
const paymentRouter = require("./routes/payment.routes");
const premiumRouter = require("./routes/premium.routes");
const passwordRouter = require("./routes/password.routes");

// Middleware
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const morgan = require("morgan");

// Model associations
require("./models/associations");

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:3500",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ExpenseFlow API is running",
  });
});

// API routes
app.use("/users", userRouter);
app.use("/expenses", expenseRouter);
app.use("/payment", paymentRouter);
app.use("/premium", premiumRouter);
app.use("/password", passwordRouter);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Database synchronization and server startup
const PORT = process.env.PORT || 3000;

db.sync({ force: false })
  .then(() => {
    console.log("Database synchronization successful");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database synchronization failed:", err);
    process.exit(1);
  });
