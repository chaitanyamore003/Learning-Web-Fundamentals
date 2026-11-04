const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./utils/database");

// Load environment variables from the .env file
require("dotenv").config();

// Register Sequelize models and their associations
require("./models/index");

const studentRoutes = require("./routes/student.routes");
const attendanceRoutes = require("./routes/attendance.routes");

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Log incoming HTTP requests in development format
app.use(morgan("dev"));

// Register student and attendance API routes
app.use("/students", studentRoutes);
app.use("/attendance", attendanceRoutes);

// Handle requests to undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

// Synchronize database models before starting the server
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
