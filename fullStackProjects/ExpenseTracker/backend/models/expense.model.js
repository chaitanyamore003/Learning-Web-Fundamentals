const db = require("../database");
const { DataTypes } = require("sequelize");

const Expenses = db.define("Expenses", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Expenses;
