const express = require("express");
const mysql = require("mysql2");
const app = express();
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("The database Connection is Successfull");

  const creationQuery = `CREATE TABLE IF NOT EXISTS Students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    email VARCHAR(20)
)`;

  connection.execute(creationQuery, (err) => {
    if (err) {
      console.log(err);
      connection.end();
      return;
    }

    console.log("Table created successfully");
  });
});

app.use("/", (req, res) => {
  res.send("<h1>HI There</h1>");
});

app.listen(process.env.PORT, () => {
  console.log("server is started on http://localhost:3000");
});
