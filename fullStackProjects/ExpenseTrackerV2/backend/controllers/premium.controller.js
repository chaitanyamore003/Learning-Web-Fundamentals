const { userModel, expenseModel } = require("../models/associations");
const { Sequelize } = require("sequelize");

const getLeaderboard = async (req, res) => {
  try {
    // Get logged-in user's ID from JWT
    const userId = req.user.userId;

    // Check whether the requesting user is premium
    const user = await userModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isPremium) {
      return res.status(403).json({
        success: false,
        message: "Premium membership required",
      });
    }

    // Fetch all users and calculate their all-time expenses
    const leaderboard = await userModel.findAll({
      attributes: [
        "id",
        "name",
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("SUM", Sequelize.col("Expenses.expenseAmount")),
            0,
          ),
          "totalExpense",
        ],
      ],

      include: [
        {
          model: expenseModel,
          attributes: [],
          required: false,
        },
      ],

      group: ["Users.id", "Users.name"],

      order: [[Sequelize.literal("totalExpense"), "DESC"]],
    });

    return res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch leaderboard",
    });
  }
};

module.exports = { getLeaderboard };
