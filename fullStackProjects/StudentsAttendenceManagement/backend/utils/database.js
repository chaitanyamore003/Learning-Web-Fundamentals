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

//testing connection using IFFE function
(async () => {
  try {
    db.authenticate();
    console.log("database connection successful");
  } catch (err) {
    console.log(err.message);
  }
})();

module.exports = db;
