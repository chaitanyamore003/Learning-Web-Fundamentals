const express = require("express");
const expenseController = require("../controllers/expense.controller");

const router = express.Router();

//get all expenses
router.get("/", expenseController.getAllExpenses);

//delete expense
router.delete("/delete/:id", expenseController.deleteExpense);

//add expense
router.post("/add", expenseController.addExpense);

module.exports = router;
