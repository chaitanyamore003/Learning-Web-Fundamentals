const { expenseModel, userModel } = require("../models/associations");
const db = require("../utils/database");
const { main } = require("../utils/ai");

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
  let transaction;

  try {
    const userId = req.user.userId;
    const { amount, description } = req.body;

    // Validate input
    if (!amount || Number(amount) <= 0 || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Valid amount and description are required",
      });
    }

    // Allowed categories
    const allowedCategories = [
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

    // Generate category using AI
    const prompt = `
      You are an expense categorization system.

      Categorize the following expense into exactly ONE category:
      Food, Transportation, Entertainment, Utilities,
      Healthcare, Education, Shopping, Travel, Other.

      Expense description: ${description}

      Rules:
      - Return ONLY the category name.
      - Do not use Markdown.
      - Do not include explanations.
      - Do not include quotation marks.
      - If uncertain, return Other.
    `;

    let category = "Other";

    try {
      const aiResponse = await main(prompt);

      // Normalize AI response
      const normalizedCategory = String(aiResponse)
        .replace(/\*/g, "")
        .replace(/[`"'"]/g, "")
        .trim()
        .split(/\s+/)[0];

      // Validate category
      const matchedCategory = allowedCategories.find(
        (item) => item.toLowerCase() === normalizedCategory.toLowerCase(),
      );

      category = matchedCategory || "Other";
    } catch (aiError) {
      console.error("AI categorization failed:", aiError.message);
    }

    // Start transaction after AI processing
    transaction = await db.transaction();

    // Create expense
    await expenseModel.create(
      {
        expenseAmount: amount,
        category,
        description: description.trim(),
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
      category,
    });
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    console.error(err.message);

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
  let transaction;

  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { amount, description } = req.body;

    // Find existing expense
    const expense = await expenseModel.findOne({
      where: {
        id,
        UserId: userId,
      },
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Validate input
    if (
      (amount !== undefined && Number(amount) <= 0) ||
      (description !== undefined && !description.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount or description",
      });
    }

    const allowedCategories = [
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

    // Keep existing values if not provided
    const updatedAmount =
      amount !== undefined ? Number(amount) : expense.expenseAmount;

    const updatedDescription =
      description !== undefined ? description.trim() : expense.description;

    // Generate category only when description changes
    let category = expense.category;

    if (
      description !== undefined &&
      updatedDescription !== expense.description
    ) {
      const prompt = `
        You are an expense categorization system.

        Categorize the following expense into exactly ONE category:
        Food, Transportation, Entertainment, Utilities,
        Healthcare, Education, Shopping, Travel, Other.

        Expense description: ${updatedDescription}

        Return ONLY the category name.
        No Markdown, explanations, or punctuation.
        If uncertain, return Other.
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

        category = matchedCategory || "Other";
      } catch (aiError) {
        console.error("AI categorization failed:", aiError.message);

        category = "Other";
      }
    }

    // Start transaction
    transaction = await db.transaction();

    // Update expense
    await expense.update(
      {
        expenseAmount: updatedAmount,
        description: updatedDescription,
        category,
      },
      { transaction },
    );

    // Calculate amount difference
    const difference =
      updatedAmount - Number(expense.previous("expenseAmount"));

    // Update user's total expense only if amount changed
    if (difference !== 0) {
      await userModel.increment(
        { totalExpense: difference },
        {
          where: { id: userId },
          transaction,
        },
      );
    }

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      category,
    });
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    console.error(err.message);

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
