const { expenseModel, userModel } = require("../models/associations");
const db = require("../utils/database");

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
  const transaction = await db.transaction();

  try {
    const userId = req.user.userId;
    const { amount, category, description } = req.body;

    // Create expense
    await expenseModel.create(
      {
        expenseAmount: amount,
        category,
        description,
        UserId: userId,
      },
      { transaction },
    );

    // Update user's total expense
    await userModel.increment(
      { totalExpense: amount },
      {
        where: { id: userId },
        transaction,
      },
    );

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "New expense created successfully",
    });
  } catch (err) {
    await transaction.rollback();

    console.log(err.message);

    return res.status(500).json({
      success: false,
      message: "Adding expense failed",
    });
  }
};

const deleteExpense = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // Find expense belonging to this user
    const expense = await expenseModel.findOne({
      where: {
        id,
        UserId: userId,
      },
      transaction,
    });

    if (!expense) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Delete expense
    await expense.destroy({ transaction });

    // Decrease user's total expense
    await userModel.decrement(
      {
        totalExpense: expense.expenseAmount,
      },
      {
        where: {
          id: userId,
        },
        transaction,
      },
    );

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    console.log(err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete the expense",
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
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { amount, category, description } = req.body;

    // 1. Find the existing expense
    const expense = await expenseModel.findOne({
      where: {
        id,
        UserId: userId,
      },
      transaction,
    });

    if (!expense) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // 2. Calculate the difference
    const difference = Number(amount) - Number(expense.expenseAmount);

    // 3. Update the expense
    await expense.update(
      {
        expenseAmount: amount,
        category,
        description,
      },
      { transaction },
    );

    // 4. Update user's total expense
    await userModel.increment(
      {
        totalExpense: difference,
      },
      {
        where: {
          id: userId,
        },
        transaction,
      },
    );

    // 5. Commit transaction
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
    });
  } catch (err) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    console.error("Update Expense Error:", err);

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
