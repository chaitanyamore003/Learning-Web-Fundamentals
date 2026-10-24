const { expenseModel } = require("../models/associations");

const addExpense = async (req, res) => {
  try {
    const { name, amount, userId } = req.body;

    const expense = await expenseModel.create({
      name,
      amount,
      UserId: userId,
    });

    res.json({
      success: true,
      expense,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      err: err.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    await expenseModel.destroy({
      where: { id: id },
    });

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      err: err.message,
    });
  }
};

const getUserExpenses = async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await expenseModel.findAll({
      where: {
        UserId: id,
      },
    });

    res.json({
      success: true,
      expenses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      err: err.message,
    });
  }
};

const editExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount } = req.body;

    const updatedExpense = await expenseModel.update(
      {
        name,
        amount,
      },
      {
        where: {
          id: id,
        },
      },
    );

    res.json({
      success: true,
      expense: updatedExpense,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      err: err.message,
    });
  }
};

module.exports = {
  addExpense,
  deleteExpense,
  getUserExpenses,
  editExpense,
};
