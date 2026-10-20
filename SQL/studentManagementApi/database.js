const mysql = require("mysql2");
require("dotenv").config();

const database = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const StudentsTableCreationQuery = `CREATE TABLE IF NOT EXISTS STUDENTS (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  age INT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
  UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE)`;

const initializeDatabase = (callback) => {
  database.connect((err) => {
    if (err) return callback(err);

    database.execute(StudentsTableCreationQuery, (err) => {
      if (err) return callback(err);

      return callback(null);
    });
  });
};

module.exports = {
  database,
  initializeDatabase,
};
