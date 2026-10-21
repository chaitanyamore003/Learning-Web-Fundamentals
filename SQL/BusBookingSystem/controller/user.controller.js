//using sequelize for CRUD
const userModel = require("../models/users.model");

const getUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();

    res.send(users);
  } catch (err) {
    res.status(500).send(`Unable to fetch all users`);
  }
};

const addUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await userModel.create({ name: name, email: email });

    res.send(`User with name:${name} has been added successfully`);
  } catch (err) {
    res.status(500).send("Unable to Add a new user");
  }
};

// const { database } = require("../database");

// const getUsers = (req, res) => {
//   const query = `SELECT * FROM USERS`;

//   database.execute(query, (err, results) => {
//     if (err) {
//       return res.status(500).send("Cannot Fetch Users");
//     }

//     res.send(results);
//   });
// };

// const addUser = (req, res) => {
//   const { name, email } = req.body;

//   const addUserQuery = `INSERT INTO USERS (email, name) VALUES (?, ?)`;

//   database.execute(addUserQuery, [email, name], (err, result) => {
//     if (err) {
//       return res.status(500).send(err.message);
//     }

//     res.send("User added succcessfully");
//   });
// };

module.exports = {
  getUsers,
  addUser,
};
