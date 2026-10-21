require("dotenv").config();

const express = require("express");
const userRouter = require("./routes/user.routes");
const busRouter = require("./routes/bus.routes");

//importing all models(necessary for creating required tables)
const db = require("./database");
require("./models/bookings.model");
require("./models/buses.model");
require("./models/payments.model");
require("./models/users.model");

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/buses", busRouter);

db.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
