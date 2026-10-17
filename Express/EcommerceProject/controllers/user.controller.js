const getAllUsers = (req, res) => {
  res.send(`<h2>Fetching all users</h2>`);
};

const addUser = (req, res) => {
  res.send(`<h2>Adding a new user</h2>`);
};

const getUserById = (req, res) => {
  res.send(`<h2>Fetching user with ID: ${req.params.id}</h2>`);
};

module.exports = {
  getAllUsers,
  addUser,
  getUserById,
};
