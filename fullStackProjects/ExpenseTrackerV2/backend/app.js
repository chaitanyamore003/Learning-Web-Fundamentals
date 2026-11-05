const express = require("express");
require("dotenv").config();

const db = require("./utils/database");
const userRouter = require("./routes/user.routes");
const expenseRouter = require("./routes/expense.routes");
const paymentRouter = require("./routes/payment.routes");
const premiumRouter = require("./routes/premium.routes");
const passwordRouter = require("./routes/password.routes");
const errorHandler = require("./middlewares/errorHandler");

const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

require("./models/associations");

const app = express();

// Middlewares

app.use(
  cors({
    origin: "http://localhost:3500",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

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

app.use(errorHandler);
