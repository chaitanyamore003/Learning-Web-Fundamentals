const express = require("express");
const { database, queries } = require("./database");

const app = express();

database.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Database connection successful");

  let completed = 0;

  queries.forEach((query) => {
    database.query(query, (err) => {
      if (err) {
        console.log(err);
        return;
      }

      completed++;

      if (completed === queries.length) {
        app.listen(process.env.PORT, () => {
          console.log(`Server running on port ${process.env.PORT}`);
        });
      }
    });
  });
});
