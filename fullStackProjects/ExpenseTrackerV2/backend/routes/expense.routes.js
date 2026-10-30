const express = require("express");
const expenseController = require("../controllers/expense.controller");
const authenticateUser = require("../middlewares/auth");

const router = express.Router();

//get all expenses
router.get("/", authenticateUser, expenseController.getAllExpenses);

//delete expense
router.delete("/delete/:id", authenticateUser, expenseController.deleteExpense);

//add expense
router.post("/add", authenticateUser, expenseController.addExpense);

module.exports = router;
