const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

// Create the Sequelize instance
const db = new Sequelize(
  process.env.DB_NAME, // defaultdb
  process.env.DB_USER, // avnadmin
  process.env.DB_PASSWORD, // your password
  {
    host: process.env.DB_HOST, // mysql-258b6fef...aivencloud.com
    port: process.env.DB_PORT, // 20748
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      // ✅ Aiven requires SSL. We read the ca.pem file you downloaded.
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.join(__dirname, "..", "ca.pem")).toString(),
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
