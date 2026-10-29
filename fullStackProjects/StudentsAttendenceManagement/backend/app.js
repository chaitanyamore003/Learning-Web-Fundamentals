const express = require("express");
const cors = require("cors");
const db = require("./utils/database");
require("dotenv").config();
require("./models/index");

const studentRoutes = require("./routes/student.routes");
const attendanceRoutes = require("./routes/attendance.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);
app.use("/attendance", attendanceRoutes);

app.use((req, res) => {
  res.json({
    message: "Error 404: Page Not Found",
  });
});

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
