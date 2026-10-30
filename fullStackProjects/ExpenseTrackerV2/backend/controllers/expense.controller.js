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

module.exports = {
  getAllExpenses,
  deleteExpense,
  addExpense,
};
