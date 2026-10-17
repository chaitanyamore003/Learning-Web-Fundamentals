const getUsers = () => {
  return `<h2>Fetching all users</h2>`;
};

const addUser = () => {
  return `<h2>Adding a new user</h2>`;
};

const getUserWithId = (id) => {
  return `<h2>Fetching user with ID: ${id}</h2>`;
};

module.exports = {
  getUsers,
  addUser,
  getUserWithId,
};
