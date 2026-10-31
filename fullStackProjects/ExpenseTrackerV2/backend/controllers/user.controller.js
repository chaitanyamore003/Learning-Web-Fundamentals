const bcrypt = require("bcrypt");
const { userModel } = require("../models/associations");
const jwt = require("jsonwebtoken");

/** user signup */
const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    //checking if all fields are recieved or not
    if (!name || !email || !password || !phone) {
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
        message: "email already registered",
      });
    }

    //checking duplicate phone no
    const phoneExists = await userModel.findOne({
      where: {
        phone,
      },
    });

    if (phoneExists) {
      return res.status(409).json({
        success: false,
        message: "phone number already registered",
      });
    }

    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(password, saltRounds);

    //store the user
    const user = await userModel.create({
      name: name,
      email: email,
      password: passwordHash,
      phone: phone,
    });

    return res.status(201).json({
      success: true,
      message: "user signup successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
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

    //validating required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

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

    //crete and send the token
    const token = await jwt.sign(
      { userId: userExists.id },
      process.env.JWT_SECRET,
    );

    //login the user
    return res.status(200).json({
      success: true,
      message: "user login successful",
      token,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "user login failed",
    });
  }
};

/** Get all registered users */
const getUsers = async (req, res) => {
  try {
    const users = await userModel.findAll({
      attributes: ["id", "name"],
    });

    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Fetching all users failed",
    });
  }
};

/** get user details */
const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await userModel.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user found",
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        premiumStatus: user.isPremium,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "failed to fetch user details",
    });
  }
};

module.exports = {
  signup,
  getUsers,
  login,
  getMe,
};
