const express = require("express");
const app = express();

app.get("/welcome/:username", (req, res) => {
  const username = req.params.username;
  const role = req.query.role;
  res.send(`<h1>Welcome ${username}, your Role is ${role}</h1>`);
});

app.listen(3000, () => {
  console.log("Server is up and running on port 3000, http://localhost:3000");
});
