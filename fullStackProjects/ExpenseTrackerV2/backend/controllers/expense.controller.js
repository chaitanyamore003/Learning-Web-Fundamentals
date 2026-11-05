const { expenseModel, userModel } = require("../models/associations");
const db = require("../utils/database");
const { main } = require("../utils/ai");

// ==========================================
// ADD EXPENSE / INCOME
// ==========================================
const addExpense = async (req, res) => {
  let transaction;
  let transactionType = "expense"; // Defined here so catch block can access it

  try {
    const userId = req.user.userId;
    const { amount, description, type = "expense" } = req.body;

    transactionType = type;

    // Validate input
    if (!amount || Number(amount) <= 0 || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Valid amount and description are required",
      });
    }

    // Define categories based on type
    const allowedExpenseCategories = [
      "Food",
      "Transportation",
      "Entertainment",
      "Utilities",
      "Healthcare",
      "Education",
      "Shopping",
      "Travel",
      "Other",
    ];
    const allowedIncomeCategories = [
      "Salary",
      "Freelance",
      "Investments",
      "Business",
      "Gifts",
      "Other Income",
    ];

    const allowedCategories =
      type === "income" ? allowedIncomeCategories : allowedExpenseCategories;

    // Generate category using AI
    const prompt = `
      You are a financial categorization system.

      Categorize the following ${type} into exactly ONE category from this list:
      ${allowedCategories.join(", ")}.

      Description: ${description}

      Rules:
      - Return ONLY the category name.
      - Do not use Markdown, explanations, or punctuation.
      - If uncertain, return ${type === "income" ? "Other Income" : "Other"}.
    `;

    let category = type === "income" ? "Other Income" : "Other";

    try {
      const aiResponse = await main(prompt);
      const normalizedCategory = String(aiResponse)
        .replace(/\*/g, "")
        .replace(/[`"'"]/g, "")
        .trim()
        .split(/\s+/)[0];

      const matchedCategory = allowedCategories.find(
        (item) => item.toLowerCase() === normalizedCategory.toLowerCase(),
      );

      category =
        matchedCategory || (type === "income" ? "Other Income" : "Other");
    } catch (aiError) {
      console.error("AI categorization failed:", aiError.message);
    }

    // Start transaction
    transaction = await db.transaction();

    // Create expense/income record
    await expenseModel.create(
      {
        expenseAmount: amount,
        category,
        description: description.trim(),
        UserId: userId,
        type: type,
      },
      { transaction },
    );

    // ✅ Update the respective total based on type
    if (type === "expense") {
      await userModel.increment(
        { totalExpense: amount },
        { where: { id: userId }, transaction },
      );
    } else {
      await userModel.increment(
        { totalIncome: amount },
        { where: { id: userId }, transaction },
      );
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: `${type === "income" ? "Income" : "Expense"} created successfully`,
      category,
    });
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("Add Expense Error:", err.message);
    return res.status(500).json({
      success: false,
      message: `Adding ${transactionType} failed`,
    });
  }
};

// ==========================================
// UPDATE EXPENSE / INCOME
// ==========================================
const updateExpense = async (req, res) => {
  let transaction;
  let transactionType = "expense";

  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { amount, description, type } = req.body;

    if (type) transactionType = type;

    const expense = await expenseModel.findOne({
      where: { id, UserId: userId },
    });

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    if (
      (amount !== undefined && Number(amount) <= 0) ||
      (description !== undefined && !description.trim())
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount or description" });
    }

    const allowedExpenseCategories = [
      "Food",
      "Transportation",
      "Entertainment",
      "Utilities",
      "Healthcare",
      "Education",
      "Shopping",
      "Travel",
      "Other",
    ];
    const allowedIncomeCategories = [
      "Salary",
      "Freelance",
      "Investments",
      "Business",
      "Gifts",
      "Other Income",
    ];

    const updatedAmount =
      amount !== undefined ? Number(amount) : expense.expenseAmount;
    const updatedDescription =
      description !== undefined ? description.trim() : expense.description;
    const updatedType = type !== undefined ? type : expense.type;

    const allowedCategories =
      updatedType === "income"
        ? allowedIncomeCategories
        : allowedExpenseCategories;

    // Generate category only when description or type changes
    let category = expense.category;

    if (
      (description !== undefined &&
        updatedDescription !== expense.description) ||
      (type !== undefined && type !== expense.type)
    ) {
      const prompt = `
        You are a financial categorization system.

        Categorize the following ${updatedType} into exactly ONE category from this list:
        ${allowedCategories.join(", ")}.

        Description: ${updatedDescription}

        Rules:
        - Return ONLY the category name.
        - Do not use Markdown, explanations, or punctuation.
        - If uncertain, return ${updatedType === "income" ? "Other Income" : "Other"}.
      `;

      try {
        const aiResponse = await main(prompt);
        const normalizedCategory = String(aiResponse)
          .replace(/\*/g, "")
          .replace(/[`"'"]/g, "")
          .trim()
          .split(/\s+/)[0];
        const matchedCategory = allowedCategories.find(
          (item) => item.toLowerCase() === normalizedCategory.toLowerCase(),
        );
        category =
          matchedCategory ||
          (updatedType === "income" ? "Other Income" : "Other");
      } catch (aiError) {
        console.error("AI categorization failed:", aiError.message);
      }
    }

    // Keep old values to calculate differences
    const oldAmount = Number(expense.expenseAmount);
    const oldType = expense.type;

    // Start transaction
    transaction = await db.transaction();

    // Update transaction record
    await expense.update(
      {
        expenseAmount: updatedAmount,
        description: updatedDescription,
        category,
        type: updatedType,
      },
      { transaction },
    );

    // ✅ Handle totals by removing the old amount first
    if (oldType === "expense") {
      await userModel.decrement(
        { totalExpense: oldAmount },
        { where: { id: userId }, transaction },
      );
    } else {
      await userModel.decrement(
        { totalIncome: oldAmount },
        { where: { id: userId }, transaction },
      );
    }

    // ✅ Then add the new amount to the correct bucket
    if (updatedType === "expense") {
      await userModel.increment(
        { totalExpense: updatedAmount },
        { where: { id: userId }, transaction },
      );
    } else {
      await userModel.increment(
        { totalIncome: updatedAmount },
        { where: { id: userId }, transaction },
      );
    }

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      category,
    });
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("Update Expense Error:", err.message);
    return res.status(500).json({
      success: false,
      message: `Failed to update ${transactionType}`,
    });
  }
};

// ==========================================
// DELETE EXPENSE / INCOME
// ==========================================
const deleteExpense = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const expense = await expenseModel.findOne({
      where: { id, UserId: userId },
      transaction,
    });

    if (!expense) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    // ✅ Decrement the respective total based on type
    if (expense.type === "expense") {
      await userModel.decrement(
        { totalExpense: expense.expenseAmount },
        { where: { id: userId }, transaction },
      );
    } else {
      await userModel.decrement(
        { totalIncome: expense.expenseAmount },
        { where: { id: userId }, transaction },
      );
    }

    await expense.destroy({ transaction });
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    if (!transaction.finished) await transaction.rollback();
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete the transaction" });
  }
};

// ==========================================
// GET ALL EXPENSES
// ==========================================
const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenses = await expenseModel.findAll({
      where: { UserId: userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      expenses,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all transactions",
    });
  }
};

// ==========================================
// GET SINGLE EXPENSE
// ==========================================
const getExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await expenseModel.findOne({
      where: { id },
    });

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction fetched successfully",
      expense,
    });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, message: "Unable to fetch the transaction" });
  }
};

module.exports = {
  getAllExpenses,
  deleteExpense,
  addExpense,
  getExpense,
  updateExpense,
};
