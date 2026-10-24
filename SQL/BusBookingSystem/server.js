require("dotenv").config();

const express = require("express");
const userRouter = require("./routes/user.routes");
const busRouter = require("./routes/bus.routes");
const bookingsRouter = require("./routes/bookings.routes");

//importing all models(necessary for creating required tables)
const db = require("./database");
require("./models/associations"); //gets bookings, buses, and users
require("./models/payments.model");

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/buses", busRouter);
app.use("/bookings", bookingsRouter);

db.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
