const { Sequelize } = require("sequelize");
require("dotenv").config();

const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  },
);

//testing the connection using IFFE Function
(async () => {
  try {
    await database.authenticate();
    console.log("Database connection successful");
  } catch (err) {
    console.log(err);
  }
})();

module.exports = database;
