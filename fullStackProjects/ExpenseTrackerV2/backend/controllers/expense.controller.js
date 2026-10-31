const { where } = require("sequelize");
const { expenseModel } = require("../models/associations");

const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenses = await expenseModel.findAll({
      where: {
        UserId: userId,
      },
    });

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
    const userId = req.user.userId;

    const { amount, category, description } = req.body;

    await expenseModel.create({
      expenseAmount: amount,
      category,
      description,
      UserId: userId,
    });

    return res.status(201).json({
      success: true,
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
    const userId = req.user.userId;

    const { id } = req.params;

    const deleted = await expenseModel.destroy({
      where: {
        id,
        UserId: userId,
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

const getExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await expenseModel.findOne({
      where: {
        id,
      },
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "expense fetched successfully",
      expense,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "unable the fetch the expense",
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, description } = req.body;

    const [updated] = await expenseModel.update(
      {
        expenseAmount: amount,
        category,
        description,
      },
      {
        where: {
          id,
          UserId: req.user.userId,
        },
      },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or no changes made",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
    });
  } catch (err) {
    console.error("Update Expense Error:", err);
    console.error("SQL Error:", err.parent?.sqlMessage);

    return res.status(500).json({
      success: false,
      message: "Failed to update expense",
    });
  }
};

module.exports = {
  getAllExpenses,
  deleteExpense,
  addExpense,
  getExpense,
  updateExpense,
};
