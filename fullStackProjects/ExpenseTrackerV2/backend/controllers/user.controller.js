const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

/** user signup */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //checking if all fields are recieved or not
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "all the fields are required",
      });
    }

    //checking for duplicate email
    const emailExist = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (emailExist) {
      return res.status(409).json({
        success: false,
        message: "email already exists",
      });
    }
    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(password, saltRounds);

    //store the user
    const user = await userModel.create({
      name: name,
      email: email,
      password: passwordHash,
    });

    return res.status(201).json({
      success: true,
      message: "user signup successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "signup failed",
    });
  }
};

/** user login */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if email exists or not
    const userExists = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "email is not registered",
      });
    }

    //check if password is correct
    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }

    //login the user
    return res.status(200).json({
      success: true,
      message: "user login successful",
      user: userExists,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "user login failed",
    });
  }
};

/**get all registered users */
const getUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();

    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "fetching all users failed",
    });
  }
};

module.exports = {
  signup,
  getUsers,
  login,
};
