const { DataTypes, ENUM } = require("sequelize");
const db = require("../utils/database");

const expenses = db.define("Expenses", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  expenseAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.ENUM("expense", "income"),
    defaultValue: "expense",
    allowNull: false,
  },
});

module.exports = expenses;
