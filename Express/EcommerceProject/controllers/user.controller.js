const userService = require("../services/user.service");

const getAllUsers = (req, res) => {
  res.send(userService.getUsers());
};

const addUser = (req, res) => {
  res.send(userService.addUser());
};

const getUserById = (req, res) => {
  res.send(userService.getUserWithId(req.params.id));
};

module.exports = {
  getAllUsers,
  addUser,
  getUserById,
};
