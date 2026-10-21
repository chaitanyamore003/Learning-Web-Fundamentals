const { where } = require("sequelize");
const userModel = require("../models/user.model");

//get all users
const getUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();

    res.status(200).json({
      success: true,
      message: "Users fetched Successfully",
      users: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch the users",
    });
  }
};

//edit user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const [updatedRows] = await userModel.update(
      { name },
      {
        where: { id },
      },
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Unable to update the user",
    });
  }
};

//delete user
const deleteUser = async (req, res) => {
  //id
  const { id } = req.params;

  try {
    const deletedRows = await userModel.destroy({
      where: { id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to delete the user",
    });
  }
};

//add new user
const addUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    const added = await userModel.create({ name: name, email: email });

    res.status(201).json({
      success: true,
      message: "user added successfully",
    });
  } catch (err) {
    console.error("Add user failed:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const addingValuesToStudentAndIdentityTable = async (req, res) => {
  try {
  } catch (err) {}
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
  addUser,
};
