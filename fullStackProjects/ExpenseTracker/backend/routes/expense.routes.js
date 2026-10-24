const express = require("express");

const expenseController = require("../controller/expense.controller");

const router = express.Router();

router.post("/add", expenseController.addExpense);

router.delete("/delete/:id", expenseController.deleteExpense);

router.get("/:id", expenseController.getUserExpenses);

router.put("/update/:id", expenseController.editExpense);

module.exports = router;
