const express = require("express");
const mysql = require("mysql2");
const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "testdb",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("The database Connection is Successfull");

  const creationQuery = `create table Students(
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

app.listen(3000, () => {
  console.log("server is started on http://localhost:3000");
});
