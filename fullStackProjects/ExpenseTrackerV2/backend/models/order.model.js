const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const orders = db.define("Orders", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
    defaultValue: "PENDING",
    allowNull: false,
  },

  cfOrderId: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  paymentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = orders;
