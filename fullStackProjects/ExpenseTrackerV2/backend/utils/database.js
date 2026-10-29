const { Sequelize } = require("sequelize");
require("dotenv").config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  },
);

//checking the connection using IFFE module
(async () => {
  try {
    await db.authenticate();
    console.log("database connection successful");
  } catch (err) {
    console.log("database connection failed");
    console.log(err.message);
  }
})();

module.exports = db;
