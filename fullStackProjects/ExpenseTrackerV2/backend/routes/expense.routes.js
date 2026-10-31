const express = require("express");
const expenseController = require("../controllers/expense.controller");
const authenticateUser = require("../middlewares/auth");

const router = express.Router();

//get all expenses
router.get("/", authenticateUser, expenseController.getAllExpenses);

//get expense by id
router.get("/:id", authenticateUser, expenseController.getExpense);

//delete expense
router.delete("/delete/:id", authenticateUser, expenseController.deleteExpense);

//add expense
router.post("/add", authenticateUser, expenseController.addExpense);

//update expense
router.put("/update/:id", authenticateUser, expenseController.updateExpense);

module.exports = router;
