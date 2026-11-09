const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

// AWS RDS MySQL connection
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),

    dialect: "mysql",

    logging: false,

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs
          .readFileSync(path.join(__dirname, "..", "global-bundle.pem"))
          .toString(),
      },
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

module.exports = db;
