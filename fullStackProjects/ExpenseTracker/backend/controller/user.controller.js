const { userModel } = require("../models/associations");

const getUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();
    res.json({
      success: true,
      users: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      err: err.message,
    });
  }
};

const addUser = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await userModel.create({ name: name });

    res.json({
      success: true,
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      err: err.message,
    });
  }
};

module.exports = {
  getUsers,
  addUser,
};
