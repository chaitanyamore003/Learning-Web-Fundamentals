const expenseModel = require("../models/expense.model");

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await expenseModel.findAll();

    return res.status(200).json({
      success: true,
      message: "expenses fetched successfully",
      expenses,
    });
  } catch (err) {
    console.log(err.message);

    return res.status(500).json({
      success: false,
      message: "failed to fetch all expenses",
    });
  }
};

const addExpense = async (req, res) => {
  try {
    const { amount, category, description } = req.body;

    const expenseCreated = await expenseModel.create({
      expenseAmount: amount,
      category,
      description,
    });

    return res.status(201).json({
      success: false,
      message: "new expense created successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "adding expense failed",
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await expenseModel.destroy({
      where: {
        id,
      },
    });

    //if expense not found
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "expense not found",
      });
    }

    //deletion success
    return res.status(200).json({
      success: true,
      message: "expense deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to delete the expense",
    });
  }
};

module.exports = {
  getAllExpenses,
  deleteExpense,
  addExpense,
};
