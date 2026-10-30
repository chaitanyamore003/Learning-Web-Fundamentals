const userModel = require("./user.model");
const expenseModel = require("./expense.model");
const orderModel = require("./order.model");

// User - Expense (One-to-Many)
userModel.hasMany(expenseModel);
expenseModel.belongsTo(userModel);

// User - Order (One-to-Many)
userModel.hasMany(orderModel);
orderModel.belongsTo(userModel);

module.exports = {
  userModel,
  expenseModel,
  orderModel,
};
