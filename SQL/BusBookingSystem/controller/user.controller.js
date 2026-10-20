const { database } = require("../database");

const getUsers = (req, res) => {
  const query = `SELECT * FROM USERS`;

  database.execute(query, (err, results) => {
    if (err) {
      return res.status(500).send("Cannot Fetch Users");
    }

    res.send(results);
  });
};

const addUser = (req, res) => {
  const { name, email } = req.body;

  const addUserQuery = `INSERT INTO USERS (email, name) VALUES (?, ?)`;

  database.execute(addUserQuery, [email, name], (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.send("User added succcessfully");
  });
};

module.exports = {
  getUsers,
  addUser,
};
