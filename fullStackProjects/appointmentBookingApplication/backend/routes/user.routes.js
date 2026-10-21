const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

/**
 * get all users
 */
router.get("/", userController.getUsers);

/**
 * edit user data
 */
router.put("/update/:id", userController.updateUser);

/**
 * delete user
 */
router.delete("/delete/:id", userController.deleteUser);

/**
 * add new user
 */
router.post("/add", userController.addUser);

module.exports = router;
